import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Cake, Mail, Lock, ArrowRight, CheckCircle, UserPlus, LogIn } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [isPasswordReset, setIsPasswordReset] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { signInWithEmailPassword, signUpWithEmailPassword, sendPasswordReset } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isPasswordReset) {
        const { error } = await sendPasswordReset(email)
        if (error) {
          setError(error.message)
        } else {
          setEmailSent(true)
        }
      } else if (isRegistering) {
        const { error } = await signUpWithEmailPassword(email, password)
        if (error) {
          setError(error.message)
        } else {
          setEmailSent(true)
        }
      } else {
        const { error } = await signInWithEmailPassword(email, password)
        if (error) {
          setError(error.message)
        } else {
          navigate('/dashboard')
        }
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = () => {
    window.open(import.meta.env.VITE_STRIPE_CHECKOUT_URL, '_blank')
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setError('')
    setEmailSent(false)
    setIsPasswordReset(false)
    setIsRegistering(false)
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2">
              <Cake className="h-10 w-10 text-pink-600" />
              <span className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Confeitaria 7.0
              </span>
            </Link>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-pink-100 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {isPasswordReset ? 'Email de Redefinição Enviado!' : 'Conta Criada com Sucesso!'}
            </h2>
            <p className="text-gray-600 mb-6">
              {isPasswordReset 
                ? `Enviamos um link para redefinir sua senha para ${email}. Verifique sua caixa de entrada e spam.`
                : `Sua conta foi criada! Verifique seu email ${email} para confirmar sua conta e depois faça login.`
              }
            </p>
            <button
              onClick={resetForm}
              className="text-pink-600 hover:text-pink-700 font-medium"
            >
              ← Voltar ao login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <Cake className="h-10 w-10 text-pink-600" />
            <span className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Confeitaria 7.0
            </span>
          </Link>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-pink-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isPasswordReset ? 'Redefinir Senha' : (isRegistering ? 'Criar Conta' : 'Entrar')}
            </h2>
            <p className="text-gray-600">
              {isPasswordReset 
                ? 'Digite seu email para receber o link de redefinição'
                : (isRegistering 
                  ? 'Crie sua conta para começar a usar o sistema'
                  : 'Entre com suas credenciais'
                )
              }
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {!isPasswordReset && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder={isRegistering ? "Crie uma senha segura" : "Sua senha"}
                    minLength={6}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isPasswordReset ? (
                <>
                  <Mail className="h-4 w-4" />
                  <span>{loading ? 'Enviando...' : 'Enviar Link de Redefinição'}</span>
                </>
              ) : isRegistering ? (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>{loading ? 'Criando conta...' : 'Criar Conta'}</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>{loading ? 'Entrando...' : 'Entrar'}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            {!isPasswordReset && (
              <div className="flex justify-center space-x-4 text-sm">
                <button
                  onClick={() => {
                    setIsRegistering(!isRegistering)
                    setError('')
                    setPassword('')
                  }}
                  className="text-pink-600 hover:text-pink-700 font-medium"
                >
                  {isRegistering ? 'Já tem conta? Entrar' : 'Não tem conta? Criar'}
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => {
                    setIsPasswordReset(true)
                    setIsRegistering(false)
                    setError('')
                    setPassword('')
                  }}
                  className="text-pink-600 hover:text-pink-700 font-medium"
                >
                  Esqueceu a senha?
                </button>
              </div>
            )}

            {isPasswordReset && (
              <button
                onClick={() => {
                  setIsPasswordReset(false)
                  setError('')
                }}
                className="w-full text-pink-600 hover:text-pink-700 font-medium text-sm"
              >
                ← Voltar ao login
              </button>
            )}

            {!isPasswordReset && (
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 text-center mb-3">
                  {isRegistering 
                    ? 'Após criar sua conta, você precisará de uma assinatura ativa para acessar o sistema'
                    : 'Ainda não tem acesso?'
                  }
                </p>
                <button
                  onClick={handleCheckout}
                  className="w-full border-2 border-pink-600 text-pink-600 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Assinar Agora</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
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