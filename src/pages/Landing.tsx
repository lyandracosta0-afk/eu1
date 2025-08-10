import React from 'react'
import { Link } from 'react-router-dom'
import { Cake, Users, ShoppingCart, BarChart3, Star, ArrowRight, CheckCircle } from 'lucide-react'

export const Landing: React.FC = () => {
  const handleCheckout = () => {
    window.open(import.meta.env.VITE_STRIPE_CHECKOUT_URL, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Cake className="h-8 w-8 text-pink-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Confeitaria 7.0
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
              >
                Entrar
              </Link>
              <button
                onClick={handleCheckout}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Começar Agora
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-pink-100 rounded-full text-pink-700 text-sm font-medium mb-8">
            <Star className="h-4 w-4 mr-2" />
            O Sistema Mais Completo para Confeitarias
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Gerencie sua confeitaria
            <span className="block bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              de forma inteligente
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Sistema completo de gestão para confeitarias modernas. Controle pedidos, 
            clientes e produtos em uma plataforma intuitiva e poderosa.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleCheckout}
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center"
            >
              Começar Gratuitamente
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <Link
              to="/login"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-pink-300 hover:text-pink-600 transition-all duration-200"
            >
              Já Tenho Acesso
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Como funciona
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Processo simples e seguro para começar a usar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Assine o Plano</h3>
              <p className="text-gray-600 leading-relaxed">
                Clique em "Começar Agora" e complete o pagamento seguro via Stripe. 
                Seu acesso será liberado automaticamente.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Receba o Acesso</h3>
              <p className="text-gray-600 leading-relaxed">
                Após o pagamento, você receberá um email com link de acesso direto. 
                Não precisa criar senha - é tudo automático!
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Comece a Gerenciar</h3>
              <p className="text-gray-600 leading-relaxed">
                Acesse o dashboard completo e comece a organizar pedidos, 
                clientes e produtos da sua confeitaria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Funcionalidades desenvolvidas especificamente para confeitarias
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group cursor-pointer bg-white p-6 rounded-xl hover:shadow-lg transition-all duration-200">
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Gestão de Pedidos</h3>
              <p className="text-gray-600 leading-relaxed">
                Controle completo de todos os pedidos, desde a criação até a entrega. 
                Acompanhe status, prazos e valores em tempo real.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Status em tempo real</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Controle de prazos</span>
                </div>
              </div>
            </div>

            <div className="text-center group cursor-pointer bg-white p-6 rounded-xl hover:shadow-lg transition-all duration-200">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Gestão de Clientes</h3>
              <p className="text-gray-600 leading-relaxed">
                Cadastro completo de clientes com histórico de pedidos, 
                preferências e informações de contato organizadas.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Histórico completo</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Dados organizados</span>
                </div>
              </div>
            </div>

            <div className="text-center group cursor-pointer bg-white p-6 rounded-xl hover:shadow-lg transition-all duration-200">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Controle de Produtos</h3>
              <p className="text-gray-600 leading-relaxed">
                Catálogo completo com preços, categorias e status. 
                Gerencie seu cardápio de forma prática e eficiente.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Catálogo organizado</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Controle de preços</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para transformar sua confeitaria?
          </h2>
          <p className="text-xl text-pink-100 mb-10">
            Junte-se a centenas de confeiteiros que já modernizaram seus negócios
          </p>
          <button
            onClick={handleCheckout}
            className="bg-white text-pink-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Comece Sua Transformação Agora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Cake className="h-6 w-6 text-pink-400" />
              <span className="text-xl font-bold">Confeitaria 7.0</span>
            </div>
            <p className="text-gray-400">
              © 2025 Confeitaria 7.0. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}