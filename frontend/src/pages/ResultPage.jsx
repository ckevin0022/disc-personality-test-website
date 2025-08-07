import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Download, Home, TrendingUp, AlertCircle, Briefcase } from 'lucide-react'
import { useTest } from '../contexts/TestContext'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

// 人格類型詳細信息
const personalityTypes = {
  'D': {
    name: '掌控型 (Dominance)',
    animal: '老虎',
    color: '#ef4444',
    description: '具有自信、果斷和目標導向的特質。喜歡掌控局勢，追求成就和成功。',
    strengths: ['決斷力強', '自信心強', '目標導向', '領導能力', '勇於挑戰'],
    challenges: ['過於競爭', '不善於妥協', '過於直接', '過度控制', '忽視細節'],
    careers: ['管理職位', '企業家', '項目經理', '銷售主管', '執行長']
  },
  'I': {
    name: '影響型 (Influence)',
    animal: '孔雀',
    color: '#f59e0b',
    description: '心胸開放，強調人與人之間的關係互動，重視去影響或說服他人。',
    strengths: ['社交能力強', '外向開朗', '溝通能力佳', '樂觀主義', '創意靈活'],
    challenges: ['過度重視社交', '缺乏細節', '過度樂觀', '分散注意力', '依賴他人'],
    careers: ['公關專員', '銷售代表', '培訓師', '市場營銷', '客戶服務']
  },
  'S': {
    name: '穩定型 (Steadiness)',
    animal: '無尾熊',
    color: '#10b981',
    description: '給人可靠的印象，溝通時強調合作和真誠。',
    strengths: ['可靠穩定', '耐心細心', '團隊合作', '忠誠度高', '善於傾聽'],
    challenges: ['抗拒變化', '決策緩慢', '避免衝突', '缺乏主動性', '過於保守'],
    careers: ['人力資源', '客戶服務', '行政助理', '教師', '護理師']
  },
  'C': {
    name: '分析型 (Conscientiousness)',
    animal: '貓頭鷹',
    color: '#3b82f6',
    description: '精確，有條理，注重細節。追求完美和準確性。',
    strengths: ['注重細節', '分析能力強', '追求完美', '邏輯思維', '專業性強'],
    challenges: ['過於謹慎', '完美主義', '決策緩慢', '抗拒變化', '缺乏靈活性'],
    careers: ['會計師', '工程師', '研究員', '質量控制', '數據分析師']
  }
}

export default function ResultPage() {
  const navigate = useNavigate()
  const { testResult, userInfo, resetTest, downloadTXTReport } = useTest()

  useEffect(() => {
    if (!testResult) {
      navigate('/test')
    }
  }, [testResult, navigate])

  if (!testResult) {
    return null
  }

  const { primary_type, secondary_type, scores, id } = testResult
  const primaryPersonality = personalityTypes[primary_type]
  const secondaryPersonality = personalityTypes[secondary_type]

  // 準備雷達圖數據
  const radarData = [
    {
      subject: '掌控型 (D)',
      score: scores.D,
      fullMark: 10
    },
    {
      subject: '影響型 (I)',
      score: scores.I,
      fullMark: 10
    },
    {
      subject: '穩定型 (S)',
      score: scores.S,
      fullMark: 10
    },
    {
      subject: '分析型 (C)',
      score: scores.C,
      fullMark: 10
    }
  ]

  const handleDownloadReport = () => {
    downloadTXTReport(id)
  }

  const getPersonalityIcon = (type) => {
    const icons = { D: '🐅', I: '🦚', S: '🐨', C: '🦉' }
    return icons[type] || '❓'
  }

  const getPersonalityColor = (type) => {
    const colors = {
      D: 'from-orange-500 to-red-500',
      I: 'from-blue-500 to-cyan-500',
      S: 'from-green-500 to-emerald-500',
      C: 'from-purple-500 to-violet-500'
    }
    return colors[type] || 'from-gray-500 to-gray-600'
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 標題 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold neon-text">您的人格測驗結果</h1>
        <p className="text-muted-foreground">
          基於您的回答，我們為您分析出以下人格特質
        </p>
      </motion.div>

      {/* 主要結果 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Card className="glass-morphism glow-effect">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">
              {getPersonalityIcon(primary_type)}
            </div>
            <CardTitle className="text-3xl neon-text">
              {primaryPersonality.name}
            </CardTitle>
            <p className="text-lg text-muted-foreground">
              代表動物：{primaryPersonality.animal}
            </p>
            {secondary_type && secondaryPersonality && (
              <p className="text-sm text-muted-foreground">
                次要類型：{secondaryPersonality.name}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-lg">
              {primaryPersonality.description}
            </p>
            
            {/* 分數顯示 */}
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(scores).map(([type, score]) => (
                <div key={type} className="text-center">
                  <div className="text-2xl font-bold neon-text">{score}</div>
                  <div className="text-sm text-muted-foreground">{type}型</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 雷達圖 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              能力指標分析
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} />
                  <Radar
                    name="分數"
                    dataKey="score"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 詳細分析 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 優勢特質 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <TrendingUp className="w-5 h-5" />
                您的優勢特質
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {primaryPersonality.strengths.map((strength, index) => (
                  <Badge key={index} variant="secondary" className="mr-2 mb-2">
                    {strength}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 需要注意的地方 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <AlertCircle className="w-5 h-5" />
                需要注意的地方
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {primaryPersonality.challenges.map((challenge, index) => (
                  <Badge key={index} variant="outline" className="mr-2 mb-2">
                    {challenge}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 職業建議 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
      >
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              適合的職業領域
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {primaryPersonality.careers.map((career, index) => (
                <Badge key={index} variant="default" className="justify-center py-2">
                  {career}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 操作按鈕 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        <Button onClick={handleDownloadReport} className="cyber-button">
          <Download className="w-4 h-4 mr-2" />
          下載詳細報告
        </Button>
        <Button onClick={() => navigate('/')} variant="outline" className="cyber-button-outline">
          <Home className="w-4 h-4 mr-2" />
          回到首頁
        </Button>
      </motion.div>
    </div>
  )
}

