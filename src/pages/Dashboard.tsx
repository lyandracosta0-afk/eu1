import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Cake, Users, ShoppingCart, Package, LogOut, Plus } from 'lucide-react'
import { OrdersTab } from '../components/OrdersTab'
import { CustomersTab } from '../components/CustomersTab'
import { ProductsTab } from '../components/ProductsTab'

type Tab = 'orders' | 'customers' | 'products'

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('orders')
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  const tabs = [
    { id: 'orders' as Tab, name: 'Pedidos', icon: ShoppingCart },
    { id: 'customers' as Tab, name: 'Clientes', icon: Users },
    { id: 'products' as Tab, name: 'Produtos', icon: Package },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Cake className="h-8 w-8 text-pink-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Confeitaria 7.0</h1>
                <p className="text-sm text-gray-500">Bem-vindo, {user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8 max-w-md">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-white text-pink-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'customers' && <CustomersTab />}
          {activeTab === 'products' && <ProductsTab />}
        </div>
      </div>
    </div>
  )
}