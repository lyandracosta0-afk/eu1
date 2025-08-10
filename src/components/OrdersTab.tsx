import React, { useState, useEffect } from 'react'
import { Plus, Search, Calendar, DollarSign, User, Package } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface Order {
  id: string
  customer_id: string
  status: string
  total_amount: number
  delivery_date: string | null
  notes: string | null
  created_at: string
  customers: { name: string } | null
}

interface Customer {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  price: number
}

export const OrdersTab: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    customer_id: '',
    status: 'pendente',
    total_amount: 0,
    delivery_date: '',
    notes: ''
  })

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    setLoading(true)
    
    // Load orders with customer names
    const { data: ordersData } = await supabase
      .from('orders')
      .select(`
        *,
        customers (name)
      `)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })

    // Load customers
    const { data: customersData } = await supabase
      .from('customers')
      .select('id, name')
      .eq('user_id', user?.id)

    // Load products
    const { data: productsData } = await supabase
      .from('products')
      .select('id, name, price')
      .eq('user_id', user?.id)
      .eq('active', true)

    setOrders(ordersData || [])
    setCustomers(customersData || [])
    setProducts(productsData || [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { error } = await supabase.from('orders').insert([
      {
        ...formData,
        user_id: user?.id,
        total_amount: Number(formData.total_amount)
      }
    ])

    if (!error) {
      setShowForm(false)
      setFormData({
        customer_id: '',
        status: 'pendente',
        total_amount: 0,
        delivery_date: '',
        notes: ''
      })
      loadData()
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (!error) {
      loadData()
    }
  }

  const filteredOrders = orders.filter(order =>
    order.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800'
      case 'em_producao': return 'bg-blue-100 text-blue-800'
      case 'pronto': return 'bg-green-100 text-green-800'
      case 'entregue': return 'bg-gray-100 text-gray-800'
      case 'cancelado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Carregando...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Pedidos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Pedido</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Buscar pedidos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <h3 className="font-semibold text-gray-900">{order.customers?.name}</h3>
                  <p className="text-sm text-gray-500">Pedido #{order.id.slice(0, 8)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status.replace('_', ' ')}
                </span>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="pendente">Pendente</option>
                  <option value="em_producao">Em Produção</option>
                  <option value="pronto">Pronto</option>
                  <option value="entregue">Entregue</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span>R$ {order.total_amount.toFixed(2)}</span>
              </div>
              {order.delivery_date && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span>{new Date(order.delivery_date).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
              <div className="text-gray-500">
                Criado em {new Date(order.created_at).toLocaleDateString('pt-BR')}
              </div>
            </div>

            {order.notes && (
              <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                <strong>Observações:</strong> {order.notes}
              </div>
            )}
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'Nenhum pedido encontrado' : 'Nenhum pedido cadastrado ainda'}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Novo Pedido</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <select
                  required
                  value={formData.customer_id}
                  onChange={(e) => setFormData({...formData, customer_id: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Selecione um cliente</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.total_amount}
                  onChange={(e) => setFormData({...formData, total_amount: Number(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Entrega</label>
                <input
                  type="date"
                  value={formData.delivery_date}
                  onChange={(e) => setFormData({...formData, delivery_date: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}