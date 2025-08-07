/**
 * DISC人格測驗 JavaScript 功能
 */

class DISCTest {
    constructor() {
        this.currentQuestion = 0;
        this.answers = [];
        this.questions = [];
        this.isLoading = false;
        this.init();
    }
    
    async init() {
        try {
            await this.loadQuestions();
            this.renderQuestion();
            this.setupEventListeners();
        } catch (error) {
            console.error('初始化失敗:', error);
            this.showError('測驗初始化失敗，請刷新頁面重試');
        }
    }
    
    async loadQuestions() {
        this.showLoading();
        
        try {
            const response = await fetch(disc_ajax.ajax_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=disc_get_questions&nonce=${disc_ajax.nonce}`
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.questions = data.data;
                this.hideLoading();
            } else {
                throw new Error(data.data || '加載問題失敗');
            }
        } catch (error) {
            console.error('加載問題失敗:', error);
            this.hideLoading();
            this.showError('無法加載測驗問題，請檢查網絡連接');
        }
    }
    
    renderQuestion() {
        if (!this.questions.length) {
            this.showError('沒有可用的測驗問題');
            return;
        }
        
        const question = this.questions[this.currentQuestion];
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        
        // 更新進度條
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        
        // 更新問題容器
        const questionContainer = document.querySelector('.question-container');
        if (questionContainer) {
            questionContainer.innerHTML = `
                <div class="question-number">問題 ${this.currentQuestion + 1} / ${this.questions.length}</div>
                <h3>${question.question}</h3>
                <div class="options">
                    ${question.options.map((option, index) => `
                        <label class="option" data-value="${index}">
                            <input type="radio" name="answer" value="${index}">
                            <span class="option-text">${option}</span>
                        </label>
                    `).join('')}
                </div>
                <div class="navigation-buttons">
                    ${this.currentQuestion > 0 ? 
                        '<button class="prev-btn" onclick="discTest.prevQuestion()">上一題</button>' : 
                        '<div></div>'
                    }
                    <button class="next-btn" onclick="discTest.nextQuestion()" disabled>
                        ${this.currentQuestion === this.questions.length - 1 ? '完成測驗' : '下一題'}
                    </button>
                </div>
            `;
        }
        
        // 更新導航按鈕狀態
        this.updateNavigationButtons();
    }
    
    setupEventListeners() {
        // 監聽選項點擊
        document.addEventListener('click', (e) => {
            if (e.target.closest('.option')) {
                const option = e.target.closest('.option');
                this.selectOption(option);
            }
        });
        
        // 監聽鍵盤事件
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.isLoading) {
                this.nextQuestion();
            } else if (e.key >= '1' && e.key <= '4') {
                const optionIndex = parseInt(e.key) - 1;
                this.selectOptionByIndex(optionIndex);
            }
        });
    }
    
    selectOption(optionElement) {
        // 移除其他選項的選中狀態
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // 選中當前選項
        optionElement.classList.add('selected');
        
        // 更新單選框
        const radio = optionElement.querySelector('input[type="radio"]');
        if (radio) {
            radio.checked = true;
        }
        
        // 啟用下一題按鈕
        this.updateNavigationButtons();
    }
    
    selectOptionByIndex(index) {
        const options = document.querySelectorAll('.option');
        if (options[index]) {
            this.selectOption(options[index]);
        }
    }
    
    updateNavigationButtons() {
        const nextBtn = document.querySelector('.next-btn');
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        
        if (nextBtn) {
            nextBtn.disabled = !selectedOption;
        }
    }
    
    prevQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.renderQuestion();
            
            // 恢復之前的答案
            if (this.answers[this.currentQuestion] !== undefined) {
                const optionIndex = this.answers[this.currentQuestion];
                setTimeout(() => {
                    this.selectOptionByIndex(optionIndex);
                }, 100);
            }
        }
    }
    
    nextQuestion() {
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (!selectedAnswer) {
            this.showError('請選擇一個選項');
            return;
        }
        
        // 保存答案
        this.answers[this.currentQuestion] = parseInt(selectedAnswer.value);
        
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.renderQuestion();
        } else {
            this.submitTest();
        }
    }
    
    async submitTest() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading('正在提交測驗結果...');
        
        try {
            const response = await fetch(disc_ajax.ajax_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=disc_submit_test&nonce=${disc_ajax.nonce}&answers=${JSON.stringify(this.answers)}`
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showResults(data.data);
            } else {
                throw new Error(data.data || '提交失敗');
            }
        } catch (error) {
            console.error('提交測驗失敗:', error);
            this.hideLoading();
            this.showError('提交測驗失敗，請重試');
        } finally {
            this.isLoading = false;
        }
    }
    
    showResults(resultData) {
        this.hideLoading();
        
        const container = document.querySelector('.disc-test-container');
        if (container) {
            container.innerHTML = `
                <div class="results-container">
                    <div class="results-header">
                        <h2>測驗完成！</h2>
                        <p>您的DISC人格類型分析結果如下</p>
                    </div>
                    
                    <div class="dominant-type">
                        <h3>您的主導類型：${this.getTypeName(resultData.dominant_type)}</h3>
                        <p>${this.getTypeDescription(resultData.dominant_type)}</p>
                    </div>
                    
                    <div class="disc-scores">
                        <div class="score-card d-type">
                            <h3>D型 (支配型)</h3>
                            <div class="score-value">${resultData.d_score}</div>
                            <p>直接、果斷、結果導向</p>
                        </div>
                        <div class="score-card i-type">
                            <h3>I型 (影響型)</h3>
                            <div class="score-value">${resultData.i_score}</div>
                            <p>樂觀、社交、關係導向</p>
                        </div>
                        <div class="score-card s-type">
                            <h3>S型 (穩健型)</h3>
                            <div class="score-value">${resultData.s_score}</div>
                            <p>耐心、合作、穩定導向</p>
                        </div>
                        <div class="score-card c-type">
                            <h3>C型 (謹慎型)</h3>
                            <div class="score-value">${resultData.c_score}</div>
                            <p>準確、分析、品質導向</p>
                        </div>
                    </div>
                    
                    <div class="results-actions">
                        <button class="next-btn" onclick="discTest.restartTest()">重新測驗</button>
                        <button class="prev-btn" onclick="discTest.printResults()">打印結果</button>
                    </div>
                </div>
            `;
        }
    }
    
    getTypeName(type) {
        const typeNames = {
            'D': '支配型 (Dominance)',
            'I': '影響型 (Influence)',
            'S': '穩健型 (Steadiness)',
            'C': '謹慎型 (Conscientiousness)'
        };
        return typeNames[type] || type;
    }
    
    getTypeDescription(type) {
        const descriptions = {
            'D': '您是一個直接、果斷的人，喜歡挑戰和競爭。您注重結果，善於快速決策，是天生的領導者。',
            'I': '您是一個樂觀、熱情的人，善於與人交往。您喜歡激勵他人，創造積極的氛圍，是團隊的活力來源。',
            'S': '您是一個耐心、可靠的人，重視和諧與合作。您善於傾聽，願意支持他人，是團隊的穩定力量。',
            'C': '您是一個準確、分析性強的人，注重品質和細節。您善於規劃，追求完美，是團隊的品質保證。'
        };
        return descriptions[type] || '這是一個獨特的人格類型組合。';
    }
    
    restartTest() {
        this.currentQuestion = 0;
        this.answers = [];
        this.renderQuestion();
        
        // 清除完成標記
        document.cookie = 'disc_completed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    
    printResults() {
        window.print();
    }
    
    showLoading(message = '加載中...') {
        const container = document.querySelector('.disc-test-container');
        if (container) {
            container.innerHTML = `
                <div class="loading">
                    <div>
                        <div class="spinner"></div>
                        <p style="margin-top: 20px; text-align: center;">${message}</p>
                    </div>
                </div>
            `;
        }
    }
    
    hideLoading() {
        // 加載完成後會自動渲染問題
    }
    
    showError(message) {
        const container = document.querySelector('.disc-test-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h3>錯誤</h3>
                    <p>${message}</p>
                    <button class="next-btn" onclick="location.reload()">重新加載</button>
                </div>
            `;
        }
    }
}

// 初始化測驗
let discTest;

document.addEventListener('DOMContentLoaded', () => {
    // 檢查是否已經完成測驗
    const completedCookie = document.cookie.split('; ').find(row => row.startsWith('disc_completed='));
    
    if (completedCookie) {
        const resultId = completedCookie.split('=')[1];
        // 顯示已完成測驗的提示
        const container = document.querySelector('.disc-test-container');
        if (container) {
            container.innerHTML = `
                <div class="results-container">
                    <div class="results-header">
                        <h2>您已完成測驗</h2>
                        <p>您之前已經完成過DISC人格測驗</p>
                    </div>
                    <div class="results-actions">
                        <button class="next-btn" onclick="discTest.restartTest()">重新測驗</button>
                    </div>
                </div>
            `;
        }
    } else {
        // 初始化新測驗
        discTest = new DISCTest();
    }
});

// 全局函數供HTML調用
function nextQuestion() {
    if (discTest) {
        discTest.nextQuestion();
    }
}

function prevQuestion() {
    if (discTest) {
        discTest.prevQuestion();
    }
}

// 導出到全局作用域
window.discTest = discTest;
