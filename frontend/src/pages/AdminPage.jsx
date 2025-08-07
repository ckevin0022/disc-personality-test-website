import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { 
  Lock, 
  Eye, 
  Download, 
  Settings, 
  Search, 
  Filter,
  BarChart3,
  Users,
  Calendar,
  FileText,
  X,
  TrendingUp,
  AlertCircle,
  Briefcase
} from 'lucide-react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

// API基礎URL
const API_BASE = '/api'

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
    color: '#3b82f6',
    description: '外向、樂觀、善於與人溝通。喜歡影響他人，追求認同和讚賞。',
    strengths: ['溝通能力強', '樂觀積極', '創意豐富', '人際關係好', '激勵他人'],
    challenges: ['注意力分散', '過於樂觀', '缺乏細節', '決策衝動', '避免衝突'],
    careers: ['銷售代表', '公關專員', '培訓師', '市場營銷', '客戶服務']
  },
  'S': {
    name: '穩定型 (Steadiness)',
    animal: '無尾熊',
    color: '#10b981',
    description: '穩定、可靠、善於合作。重視和諧關係，喜歡穩定的環境。',
    strengths: ['穩定可靠', '團隊合作', '耐心細心', '忠誠度高', '善於傾聽'],
    challenges: ['抗拒變化', '決策緩慢', '避免衝突', '缺乏主動', '過於謙遜'],
    careers: ['人力資源', '客戶服務', '行政助理', '社工', '護理師']
  },
  'C': {
    name: '分析型 (Conscientiousness)',
    animal: '貓頭鷹',
    color: '#8b5cf6',
    description: '謹慎、精確、注重細節。追求完美和準確性，重視品質。',
    strengths: ['注重細節', '邏輯思維', '品質導向', '謹慎小心', '分析能力'],
    challenges: ['過於謹慎', '完美主義', '決策緩慢', '抗拒風險', '批判性強'],
    careers: ['會計師', '工程師', '研究員', '品質管理', '數據分析師']
  }
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [testResults, setTestResults] = useState([])
  const [stats, setStats] = useState({ total_tests: 0, type_distribution: {} })
  const [loading, setLoading] = useState(false)
  const [selectedResult, setSelectedResult] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // 獲取統計數據
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/test/stats`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('獲取統計數據失敗:', error)
    }
  }

  // 獲取測驗結果
  const fetchTestResults = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/test/results`)
      if (response.ok) {
        const data = await response.json()
        setTestResults(data.results || [])
      }
    } catch (error) {
      console.error('獲取測驗結果失敗:', error)
    } finally {
      setLoading(false)
    }
  }

  // 獲取單個測驗結果詳情
  const fetchTestDetail = async (resultId) => {
    try {
      const response = await fetch(`${API_BASE}/test/results/${resultId}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedResult(data)
        setShowDetailModal(true)
      }
    } catch (error) {
      console.error('獲取測驗詳情失敗:', error)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats()
      fetchTestResults()
    }
  }, [isAuthenticated])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE}/test/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
      })
      
      if (response.ok) {
        setIsAuthenticated(true)
        setPassword('')
      } else {
        alert('密碼錯誤！')
      }
    } catch (error) {
      console.error('登錄失敗:', error)
      alert('登錄失敗，請重試')
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert('密碼不匹配！')
      return
    }
    if (newPassword.length < 6) {
      alert('密碼長度不足6位！')
      return
    }

    try {
      const response = await fetch(`${API_BASE}/test/admin/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          new_password: newPassword, 
          confirm_password: confirmPassword 
        })
      })
      
      if (response.ok) {
        alert('密碼已成功變更！')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        alert('密碼變更失敗！')
      }
    } catch (error) {
      console.error('密碼變更失敗:', error)
      alert('密碼變更失敗，請重試')
    }
  }

  const handleExport = async () => {
    try {
      const response = await fetch(`${API_BASE}/test/export`)
      if (response.ok) {
        const data = await response.json()
        // 創建CSV內容
        const csvContent = data.data.map(row => row.join(',')).join('\\n')
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', data.filename)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error('匯出失敗:', error)
      alert('匯出失敗，請重試')
    }
  }

  const getPersonalityIcon = (type) => {
    const icons = { D: '🐅', I: '🦚', S: '🐨', C: '🦉' }
    return icons[type] || '❓'
  }

  const getPersonalityColor = (type) => {
    const colors = {
      D: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      I: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      S: 'bg-green-500/20 text-green-400 border-green-500/50',
      C: 'bg-purple-500/20 text-purple-400 border-purple-500/50'
    }
    return colors[type] || 'bg-gray-500/20 text-gray-400 border-gray-500/50'
  }

  // 過濾數據
  const filteredResults = testResults.filter(result => {
    const matchesSearch = result.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || result.primary_type === selectedFilter
    return matchesSearch && matchesFilter
  })

  // 詳細報告模態
  const DetailModal = () => {
    if (!selectedResult) return null

    const personality = personalityTypes[selectedResult.primary_type]
    const scores = selectedResult.scores

    // 準備雷達圖數據
    const radarData = [
      { subject: '掌控型 (D)', score: scores.D, fullMark: 10 },
      { subject: '影響型 (I)', score: scores.I, fullMark: 10 },
      { subject: '穩定型 (S)', score: scores.S, fullMark: 10 },
      { subject: '分析型 (C)', score: scores.C, fullMark: 10 }
    ]

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-background border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold neon-text">測驗詳細報告</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowDetailModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* 基本信息 */}
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle>基本信息</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">姓名</p>
                      <p className="font-medium">{selectedResult.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">工號</p>
                      <p className="font-medium">{selectedResult.employee_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">電子郵件</p>
                      <p className="font-medium">{selectedResult.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">測驗時間</p>
                      <p className="font-medium">
                        {new Date(selectedResult.created_at).toLocaleString('zh-TW')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 人格類型結果 */}
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{getPersonalityIcon(selectedResult.primary_type)}</span>
                    您的人格類型：{personality.name}
                  </CardTitle>
                  {selectedResult.secondary_type && (
                    <p className="text-muted-foreground">
                      次要類型：{personalityTypes[selectedResult.secondary_type].name}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-center text-lg">
                    {personality.description}
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

              {/* 雷達圖 */}
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

              {/* 優勢特質和注意事項 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-morphism">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-400">
                      <TrendingUp className="w-5 h-5" />
                      優勢特質
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {personality.strengths.map((strength, index) => (
                        <Badge key={index} variant="default" className="bg-green-500/20 text-green-400 border-green-500/50">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-morphism">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-400">
                      <AlertCircle className="w-5 h-5" />
                      需要注意的地方
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {personality.challenges.map((challenge, index) => (
                        <Badge key={index} variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                          {challenge}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 職業建議 */}
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    適合的職業領域
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {personality.careers.map((career, index) => (
                      <Badge key={index} variant="default" className="justify-center py-2">
                        {career}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 登錄表單
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="glass-morphism glow-effect">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl neon-text">管理員登錄</CardTitle>
              <p className="text-muted-foreground">
                請輸入管理員密碼以訪問系統
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">密碼</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="請輸入管理員密碼"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-morphism"
                    required
                  />
                </div>
                <Button type="submit" className="w-full glow-effect pulse-glow">
                  登錄
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // 管理員界面
  return (
    <div className="space-y-8">
      {/* 標題 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold neon-text">管理員控制台</h1>
        <p className="text-muted-foreground">
          測驗數據管理與統計分析
        </p>
      </motion.div>

      {/* 統計卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="glass-morphism glow-effect">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{stats.total_tests}</div>
              <div className="text-sm text-muted-foreground">總測驗數</div>
            </CardContent>
          </Card>
          
          {Object.entries(stats.type_distribution || {}).map(([type, count]) => (
            <Card key={type} className="glass-morphism glow-effect">
              <CardContent className="p-6 text-center">
                <div className="text-2xl mb-2">{getPersonalityIcon(type)}</div>
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-muted-foreground">{type}型人格</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 測驗結果列表 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="glass-morphism glow-effect">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                測驗結果記錄
              </CardTitle>
              
              {/* 搜索和過濾 */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索姓名、工號或郵件..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 glass-morphism"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="px-3 py-2 rounded-md bg-input border border-border text-foreground"
                  >
                    <option value="all">所有類型</option>
                    <option value="D">D型</option>
                    <option value="I">I型</option>
                    <option value="S">S型</option>
                    <option value="C">C型</option>
                  </select>
                  <Button onClick={handleExport} variant="outline" className="glow-effect">
                    <Download className="w-4 h-4 mr-2" />
                    匯出
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">載入中...</div>
              ) : (
                <div className="space-y-4">
                  {filteredResults.map((result) => (
                    <div key={result.id} className="p-4 rounded-lg glass-morphism border border-primary/20">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{result.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {result.employee_id} • {result.email}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPersonalityColor(result.primary_type)}>
                            {getPersonalityIcon(result.primary_type)} {result.primary_type}型
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="glow-effect"
                            onClick={() => fetchTestDetail(result.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 text-center text-sm">
                        {Object.entries(result.scores).map(([type, score]) => (
                          <div key={type}>
                            <div className="text-xs text-muted-foreground">{type}</div>
                            <div className="font-medium">{score}</div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-3 text-xs text-muted-foreground flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(result.created_at).toLocaleDateString('zh-TW')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* 系統設置 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="glass-morphism glow-effect">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                系統設置
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">新密碼</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="請輸入新密碼"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="glass-morphism"
                    minLength={6}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">確認密碼</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="請再次輸入新密碼"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="glass-morphism"
                    minLength={6}
                  />
                </div>
                
                <Button type="submit" className="w-full glow-effect">
                  變更密碼
                </Button>
              </form>
              
              <div className="mt-6 pt-6 border-t border-border">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAuthenticated(false)}
                  className="w-full glow-effect"
                >
                  登出
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 詳細報告模態 */}
      {showDetailModal && <DetailModal />}
    </div>
  )
}

