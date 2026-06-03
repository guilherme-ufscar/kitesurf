import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus, MessageCircle, Heart, User, LogOut, ChevronDown, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import LanguageSwitcher from './LanguageSwitcher'
import Logo from '@/components/ui/Logo'

export default function Navbar() {
  const { t } = useTranslation()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-navy-900 border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo className="h-8 w-auto" />
            <span className="font-display font-bold text-white text-lg hidden sm:block">
              KITE<span className="text-teal-400">360º</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/busca"
              className="text-steel-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {t('nav.buy')}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            {user ? (
              <>
                <Link
                  to="/anunciar"
                  className="hidden sm:flex items-center gap-2 btn-primary text-sm py-2"
                >
                  <Plus size={16} />
                  {t('nav.sell')}
                </Link>

                <Link
                  to="/mensagens"
                  className="p-2 text-steel-300 hover:text-white rounded-lg transition-colors"
                >
                  <MessageCircle size={20} />
                </Link>

                <Link
                  to="/favoritos"
                  className="p-2 text-steel-300 hover:text-white rounded-lg transition-colors"
                >
                  <Heart size={20} />
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 text-steel-300 hover:text-white rounded-lg transition-colors"
                  >
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-semibold">
                        {user.name[0].toUpperCase()}
                      </div>
                    )}
                    <ChevronDown size={14} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-steel-100 py-1 z-50">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-navy-800 hover:bg-steel-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User size={16} />
                        {t('nav.myListings')}
                      </Link>
                      <Link
                        to="/favoritos"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-navy-800 hover:bg-steel-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Heart size={16} />
                        {t('nav.favorites')}
                      </Link>
                      <hr className="my-1 border-steel-100" />
                      <button
                        onClick={() => { handleLogout(); setUserMenuOpen(false) }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} />
                        {t('nav.logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/entrar"
                  className="text-steel-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link to="/cadastro" className="btn-primary text-sm py-2">
                  {t('nav.register')}
                </Link>
              </>
            )}

            <button
              className="md:hidden p-2 text-steel-300 hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-navy-800 py-3 space-y-1">
            <Link to="/busca" className="block px-3 py-2 text-steel-300 hover:text-white text-sm" onClick={() => setMenuOpen(false)}>
              {t('nav.buy')}
            </Link>
            {user && (
              <Link to="/anunciar" className="block px-3 py-2 text-teal-400 hover:text-teal-300 text-sm font-medium" onClick={() => setMenuOpen(false)}>
                + {t('nav.sell')}
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
