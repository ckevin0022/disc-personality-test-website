import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, User, Mail, Hash, Loader2 } from 'lucide-react'
import { useTest } from '../contexts/TestContext'

export default function TestPage() {
  const navigate = useNavigate()
  const {
    userInfo,
    currentQuestion,
    answers,
    questions,
    testResult,
    isLoading,
    error,
    setUserInfo,
    setAnswer,
    nextQuestion,
    prevQuestion,
    submitTest,
    clearError
  } = useTest()

  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: ''
  })

  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isTestStarted, setIsTestStarted] = useState(false)

  // 如果測驗已完成，跳轉到結果頁
  useEffect(() => {
    if (testResult) {
      navigate('/result')
    }
  }, [testResult, navigate])

  // 載入當前問題的已選答案
  useEffect(() => {
    if (isTestStarted && questions[currentQuestion]) {
      const currentAnswer = answers[questions[currentQuestion].id]
      setSelectedAnswer(currentAnswer || null)
    }
  }, [currentQuestion, answers, isTestStarted, questions])

  // 清除錯誤
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  const handleUserInfoSubmit = (e) => {
    e.preventDefault()
    if (formData.employeeId && formData.name && formData.email) {
      setUserInfo(formData)
      setIsTestStarted(true)
    }
  }

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option)
    setAnswer(questions[currentQuestion].id, option)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      nextQuestion()
    } else {
      // 最後一題，提交測驗
      handleSubmitTest()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      prevQuestion()
    }
  }

  const handleSubmitTest = async () => {
    try {
      await submitTest()
    } catch (error) {
      console.error('提交測驗失敗:', error)
    }
  }

  const progress = isTestStarted ? ((currentQuestion + 1) / questions.length) * 100 : 0

  // 載入中狀態
  if (isLoading && questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">載入測驗問題中...</p>
        </div>
      </div>
    )
  }

  // 錯誤狀態
  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="glass-morphism border-red-500">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-red-400">發生錯誤：{error}</p>
              <Button onClick={() => window.location.reload()}>
                重新載入
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 用戶信息收集表單
  if (!isTestStarted) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="glass-morphism glow-effect">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl neon-text">開始您的人格測驗</CardTitle>
              <p className="text-muted-foreground">
                請先填寫基本資料，我們將為您生成個人化的測驗報告
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUserInfoSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeId" className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      工號
                    </Label>
                    <Input
                      id="employeeId"
                      type="text"
                      placeholder="請輸入您的工號"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      className="cyber-input"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      姓名
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="請輸入您的姓名"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="cyber-input"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      電子郵件
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="請輸入您的電子郵件"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="cyber-input"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full cyber-button"
                  disabled={!formData.employeeId || !formData.name || !formData.email}
                >
                  開始測驗
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // 測驗問題頁面
  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="glass-morphism">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground">沒有可用的測驗問題</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestionData = questions[currentQuestion]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 進度條 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-morphism">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>問題 {currentQuestion + 1} / {questions.length}</span>
                <span>{Math.round(progress)}% 完成</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 問題卡片 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-morphism glow-effect">
            <CardHeader>
              <CardTitle className="text-xl neon-text">
                {currentQuestionData.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentQuestionData.options.map((option, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={selectedAnswer?.text === option.text ? "default" : "outline"}
                    className={`w-full text-left justify-start h-auto p-4 ${
                      selectedAnswer?.text === option.text 
                        ? 'cyber-button' 
                        : 'cyber-button-outline'
                    }`}
                    onClick={() => handleAnswerSelect(option)}
                  >
                    <span className="text-wrap">{option.text}</span>
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* 導航按鈕 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-between"
      >
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="cyber-button-outline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          上一題
        </Button>

        <Button
          onClick={handleNext}
          disabled={!selectedAnswer || isLoading}
          className="cyber-button"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              處理中...
            </>
          ) : currentQuestion === questions.length - 1 ? (
            <>
              完成測驗
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              下一題
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  )
}

