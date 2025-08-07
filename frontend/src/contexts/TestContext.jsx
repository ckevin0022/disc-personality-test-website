import { createContext, useContext, useReducer, useEffect } from 'react'

// API基礎URL
const API_BASE = '/api'

// 初始狀態
const initialState = {
  questions: [],
  currentQuestion: 0,
  answers: {},
  userInfo: {
    employeeId: '',
    name: '',
    email: ''
  },
  testResult: null,
  isLoading: false,
  error: null
}

// Action類型
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_QUESTIONS: 'SET_QUESTIONS',
  SET_USER_INFO: 'SET_USER_INFO',
  SET_ANSWER: 'SET_ANSWER',
  NEXT_QUESTION: 'NEXT_QUESTION',
  PREV_QUESTION: 'PREV_QUESTION',
  SET_TEST_RESULT: 'SET_TEST_RESULT',
  RESET_TEST: 'RESET_TEST'
}

// Reducer函數
function testReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload }
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false }
    case actionTypes.SET_QUESTIONS:
      return { ...state, questions: action.payload, isLoading: false }
    case actionTypes.SET_USER_INFO:
      return { ...state, userInfo: action.payload }
    case actionTypes.SET_ANSWER:
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: action.payload.answer
        }
      }
    case actionTypes.NEXT_QUESTION:
      return {
        ...state,
        currentQuestion: Math.min(state.currentQuestion + 1, state.questions.length - 1)
      }
    case actionTypes.PREV_QUESTION:
      return {
        ...state,
        currentQuestion: Math.max(state.currentQuestion - 1, 0)
      }
    case actionTypes.SET_TEST_RESULT:
      return { ...state, testResult: action.payload, isLoading: false }
    case actionTypes.RESET_TEST:
      return {
        ...initialState,
        questions: state.questions
      }
    default:
      return state
  }
}

// 創建Context
const TestContext = createContext()

// Provider組件
export function TestProvider({ children }) {
  const [state, dispatch] = useReducer(testReducer, initialState)

  // 獲取測驗問題
  const fetchQuestions = async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true })
      const response = await fetch(`${API_BASE}/test/questions`)
      if (!response.ok) {
        throw new Error('獲取問題失敗')
      }
      const questions = await response.json()
      dispatch({ type: actionTypes.SET_QUESTIONS, payload: questions })
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message })
    }
  }

  // 提交測驗結果
  const submitTest = async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true })
      
      const submitData = {
        employee_id: state.userInfo.employeeId,
        name: state.userInfo.name,
        email: state.userInfo.email,
        answers: state.answers
      }

      const response = await fetch(`${API_BASE}/test/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      })

      if (!response.ok) {
        throw new Error('提交測驗失敗')
      }

      const result = await response.json()
      dispatch({ type: actionTypes.SET_TEST_RESULT, payload: result })
      return result
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message })
      throw error
    }
  }

  // 下載TXT報告
  const downloadTXTReport = async (resultId) => {
    try {
      const response = await fetch(`${API_BASE}/test/report/txt/${resultId}`)
      if (!response.ok) {
        throw new Error('下載報告失敗')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `DISC測驗報告_${state.userInfo.name}_${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message })
    }
  }

  // 設置用戶信息
  const setUserInfo = (userInfo) => {
    dispatch({ type: actionTypes.SET_USER_INFO, payload: userInfo })
  }

  // 設置答案
  const setAnswer = (questionId, answer) => {
    dispatch({ type: actionTypes.SET_ANSWER, payload: { questionId, answer } })
  }

  // 下一題
  const nextQuestion = () => {
    dispatch({ type: actionTypes.NEXT_QUESTION })
  }

  // 上一題
  const prevQuestion = () => {
    dispatch({ type: actionTypes.PREV_QUESTION })
  }

  // 重置測驗
  const resetTest = () => {
    dispatch({ type: actionTypes.RESET_TEST })
  }

  // 清除錯誤
  const clearError = () => {
    dispatch({ type: actionTypes.SET_ERROR, payload: null })
  }

  // 初始化時獲取問題
  useEffect(() => {
    fetchQuestions()
  }, [])

  const value = {
    ...state,
    setUserInfo,
    setAnswer,
    nextQuestion,
    prevQuestion,
    submitTest,
    downloadTXTReport,
    resetTest,
    clearError,
    fetchQuestions
  }

  return (
    <TestContext.Provider value={value}>
      {children}
    </TestContext.Provider>
  )
}

// Hook
export function useTest() {
  const context = useContext(TestContext)
  if (!context) {
    throw new Error('useTest must be used within a TestProvider')
  }
  return context
}

