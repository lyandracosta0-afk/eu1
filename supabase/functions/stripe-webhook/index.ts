import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Stripe
    const stripe = (await import('npm:stripe@14')).default(Deno.env.get('STRIPE_SECRET_KEY')!)
    
    // Initialize Supabase Admin Client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the raw body and signature
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      console.error('Missing stripe-signature header')
      return new Response('Missing signature', { status: 400, headers: corsHeaders })
    }

    // Verify webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get('STRIPE_WEBHOOK_SECRET')!
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response('Invalid signature', { status: 400, headers: corsHeaders })
    }

    console.log('Received event:', event.type)

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any

      // Only process if payment was successful
      if (session.payment_status === 'paid') {
        const customerEmail = session.customer_details?.email || session.customer_email

        if (!customerEmail) {
          console.error('No customer email found in session')
          return new Response('No customer email', { status: 400, headers: corsHeaders })
        }

        console.log('Processing successful payment for:', customerEmail)

        // Get customer and subscription details from Stripe
        const customer = await stripe.customers.retrieve(session.customer)
        const subscriptions = await stripe.subscriptions.list({
          customer: session.customer,
          status: 'active',
          limit: 1
        })

        let subscriptionData = null
        if (subscriptions.data.length > 0) {
          const subscription = subscriptions.data[0]
          subscriptionData = {
            stripe_subscription_id: subscription.id,
            subscription_status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
          }
        }

        // Check if user already exists in auth.users
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
        const existingUser = existingUsers.users.find(u => u.email === customerEmail)

        let userId = existingUser?.id

        // If user doesn't exist, create them
        if (!existingUser) {
          console.log('Creating new user:', customerEmail)
          
          // Generate a temporary password (user will need to reset it)
          const tempPassword = crypto.randomUUID()
          
          const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: customerEmail,
            password: tempPassword,
            email_confirm: true, // Auto-confirm email since they paid
            user_metadata: {
              created_via_stripe: true,
              stripe_customer_id: session.customer
            }
          })

          if (createError) {
            console.error('Error creating user:', createError)
            return new Response('Error creating user', { status: 500, headers: corsHeaders })
          }

          userId = newUser.user.id
          console.log('User created successfully:', userId)
        }

        // Update or create subscription record
        const { error: upsertError } = await supabaseAdmin
          .from('user_subscriptions')
          .upsert({
            user_id: userId,
            email: customerEmail,
            stripe_customer_id: session.customer,
            ...subscriptionData,
            subscription_status: 'active'
          }, {
            onConflict: 'email'
          })

        if (upsertError) {
          console.error('Error upserting subscription:', upsertError)
          return new Response('Error updating subscription', { status: 500, headers: corsHeaders })
        }

        console.log('Subscription updated successfully for:', customerEmail)
      }
    }

    // Handle subscription status changes
    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as any
      
      // Get customer email
      const customer = await stripe.customers.retrieve(subscription.customer)
      const customerEmail = (customer as any).email

      if (customerEmail) {
        const subscriptionData = {
          stripe_subscription_id: subscription.id,
          subscription_status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
        }

        // Update subscription status
        const { error } = await supabaseAdmin
          .from('user_subscriptions')
          .update(subscriptionData)
          .eq('email', customerEmail)

        if (error) {
          console.error('Error updating subscription status:', error)
        } else {
          console.log('Subscription status updated for:', customerEmail)
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Webhook error', { status: 500, headers: corsHeaders })
  }
})