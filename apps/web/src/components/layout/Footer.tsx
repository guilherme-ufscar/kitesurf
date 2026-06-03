import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Logo from '@/components/ui/Logo'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-navy-900 border-t border-navy-800 text-steel-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Logo className="h-7 w-auto" />
              <span className="font-display font-bold text-white">
                KITE<span className="text-teal-400">360º</span>
              </span>
            </Link>
            <p className="text-sm text-steel-400 leading-relaxed">
              O marketplace de kitesurf, wingfoil, kitefoil e kitewave do Brasil.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/busca" className="hover:text-white transition-colors">Comprar</Link></li>
              <li><Link to="/anunciar" className="hover:text-white transition-colors">Vender</Link></li>
              <li><Link to="/mensagens" className="hover:text-white transition-colors">Mensagens</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Modalidades</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/busca?modality=KITESURF" className="hover:text-white transition-colors">Kitesurf</Link></li>
              <li><Link to="/busca?modality=WINGFOIL" className="hover:text-white transition-colors">Wingfoil</Link></li>
              <li><Link to="/busca?modality=KITEFOIL" className="hover:text-white transition-colors">Kitefoil</Link></li>
              <li><Link to="/busca?modality=KITEWAVE" className="hover:text-white transition-colors">Kitewave</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Conta</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/cadastro" className="hover:text-white transition-colors">Criar conta</Link></li>
              <li><Link to="/entrar" className="hover:text-white transition-colors">Entrar</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Meu painel</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-navy-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-steel-500">
          <span>© {new Date().getFullYear()} KITE360º. Todos os direitos reservados.</span>
          <span>kite360.com.br</span>
        </div>
      </div>
    </footer>
  )
}
