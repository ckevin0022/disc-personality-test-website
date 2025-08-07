import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import './App.css'

// 組件導入
import Header from './components/Header'
import HomePage from './pages/HomePage'
import IntroductionPage from './pages/IntroductionPage'
import TestPage from './pages/TestPage'
import ResultPage from './pages/ResultPage'
import AdminPage from './pages/AdminPage'

// 測驗數據上下文
import { TestProvider } from './contexts/TestContext'

function App() {
  return (
    <TestProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/introduction" element={<IntroductionPage />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/result" element={<ResultPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </TestProvider>
  )
}

export default App

