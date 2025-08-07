import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'

export default function Header() {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: '首頁' },
    { path: '/introduction', label: '人格介紹' },
    { path: '/test', label: '開始測驗' }
  ]
  
  return (
    <header className="glass-morphism border-b border-primary/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-effect">
              <span className="text-primary-foreground font-bold text-lg">D</span>
            </div>
            <div>
              <h1 className="text-xl font-bold neon-text">DISC測驗</h1>
              <p className="text-xs text-muted-foreground">四型人格分析</p>
            </div>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.path 
                    ? 'text-primary neon-text' 
                    : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Admin Button */}
          <Link to="/admin">
            <Button variant="outline" size="sm" className="glow-effect">
              <Settings className="w-4 h-4 mr-2" />
              管理員
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

