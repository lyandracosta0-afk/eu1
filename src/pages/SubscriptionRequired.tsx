import React from 'react'
import { Link } from 'react-router-dom'
import { Cake, CreditCard, ArrowRight, RefreshCw } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export const SubscriptionRequired: React.FC = () => {
  const { user, signOut, checkSubscription, subscription } = useAuth()

  const handleCheckout = () => {
    window.open(import.meta.env.VITE_STRIPE_CHECKOUT_URL, '_blank')
  }

  const handleCheckSubscription = async () => {
    await checkSubscription()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Cake className="h-10 w-10 text-pink-600" />
            <span className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Confeitaria 7.0
            </span>
          </Link>
        </div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-pink-100">
          <div className="mb-6">
            <CreditCard className="h-16 w-16 text-pink-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Assinatura Necessária
            </h2>
            <p className="text-gray-600 mb-4">
              Olá, {user?.email}! Para acessar o dashboard, você precisa de uma assinatura ativa.
            </p>
            
            {subscription && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Status da Assinatura:</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Status:</span> {subscription.subscription_status}</p>
                  {subscription.current_period_end && (
                    <p><span className="font-medium">Válida até:</span> {new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>Assinar Agora</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={handleCheckSubscription}
              className="w-full border-2 border-pink-600 text-pink-600 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Verificar Status da Assinatura</span>
            </button>

            <button
              onClick={signOut}
              className="w-full text-gray-600 hover:text-gray-800 py-2 transition-colors"
            >
              Sair da conta
            </button>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-pink-600 transition-colors"
          >
            ← Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  )
}