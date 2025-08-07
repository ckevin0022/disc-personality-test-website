import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Brain, Users, Target, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HomePage() {
  const personalityTypes = [
    {
      type: 'D',
      name: '掌控型',
      animal: '老虎',
      color: 'from-orange-500 to-red-500',
      description: '果斷、自信、目標導向',
      icon: '🐅'
    },
    {
      type: 'I',
      name: '影響型',
      animal: '孔雀',
      color: 'from-blue-500 to-cyan-500',
      description: '外向、樂觀、善於溝通',
      icon: '🦚'
    },
    {
      type: 'S',
      name: '穩定型',
      animal: '無尾熊',
      color: 'from-green-500 to-emerald-500',
      description: '穩定、可靠、團隊合作',
      icon: '🐨'
    },
    {
      type: 'C',
      name: '分析型',
      animal: '貓頭鷹',
      color: 'from-purple-500 to-violet-500',
      description: '謹慎、精確、注重細節',
      icon: '🦉'
    }
  ]

  const features = [
    {
      icon: Brain,
      title: '科學測評',
      description: '基於DISC理論的專業心理測評工具'
    },
    {
      icon: Users,
      title: '團隊分析',
      description: '了解團隊成員的人格特質，提升協作效率'
    },
    {
      icon: Target,
      title: '職業建議',
      description: '根據人格類型提供個人化的職業發展建議'
    },
    {
      icon: BarChart3,
      title: '詳細報告',
      description: '生成專業的PDF報告，可下載保存'
    }
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section 
        className="text-center space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold neon-text">
            DISC
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              四型人格測驗
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            探索您的人格特質，發現最適合的職業道路。
            基於科學的DISC理論，為您提供專業的人格分析。
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/test">
            <Button size="lg" className="glow-effect pulse-glow">
              開始測驗
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link to="/introduction">
            <Button variant="outline" size="lg" className="glow-effect">
              了解更多
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* Personality Types */}
      <motion.section 
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">四種人格類型</h2>
          <p className="text-muted-foreground">
            每個人都有獨特的人格特質，了解自己的類型有助於個人成長
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {personalityTypes.map((type, index) => (
            <motion.div
              key={type.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass-morphism glow-effect hover:scale-105 transition-transform duration-300 floating-animation">
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${type.color} flex items-center justify-center text-3xl`}>
                    {type.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{type.name}</h3>
                    <p className="text-sm text-muted-foreground">{type.animal}</p>
                  </div>
                  <p className="text-sm">{type.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features */}
      <motion.section 
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">為什麼選擇我們的測驗？</h2>
          <p className="text-muted-foreground">
            專業、準確、易用的人格測評平台
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <Card className="glass-morphism glow-effect hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-lg bg-primary/20 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="text-center space-y-6 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">準備好了解真正的自己嗎？</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            只需要10分鐘，就能獲得專業的人格分析報告
          </p>
        </div>
        
        <Link to="/test">
          <Button size="lg" className="glow-effect pulse-glow">
            立即開始測驗
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </motion.section>
    </div>
  )
}

