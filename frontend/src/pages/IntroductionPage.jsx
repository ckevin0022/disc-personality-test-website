import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Briefcase, TrendingUp } from 'lucide-react'

export default function IntroductionPage() {
  const personalityTypes = [
    {
      type: 'D',
      name: '掌控型 (Dominance)',
      animal: '老虎',
      color: 'from-orange-500 to-red-500',
      icon: '🐅',
      description: '具有自信、果斷和目標導向的特質。喜歡掌控局勢，追求成就和成功。',
      characteristics: [
        '決斷力強，能快速做出決策',
        '自信心強，相信自己的能力',
        '目標導向，專注於達成目標',
        '具有領導能力，能引導他人',
        '勇於面對挑戰和困難'
      ],
      strengths: [
        '決斷力', '自信', '目標導向', '領導能力', '勇於挑戰'
      ],
      challenges: [
        '過於競爭', '不善於妥協', '過於直接', '過度控制', '忽視細節'
      ],
      careers: [
        '管理職位', '企業家', '項目經理', '銷售主管', '執行長'
      ],
      workStyle: '快速決策，追求效率，喜歡挑戰性工作，傾向於掌控全局'
    },
    {
      type: 'I',
      name: '影響型 (Influence)',
      animal: '孔雀',
      color: 'from-blue-500 to-cyan-500',
      icon: '🦚',
      description: '心胸開放，強調人與人之間的關係互動，重視去影響或說服他人。',
      characteristics: [
        '社交能力強，善於與人交往',
        '外向開朗，充滿活力',
        '溝通能力佳，表達清晰',
        '樂觀主義，看事情正面',
        '創意靈活，思維活躍'
      ],
      strengths: [
        '社交能力強', '外向', '溝通能力', '樂觀主義', '創意靈活'
      ],
      challenges: [
        '過度重視社交', '缺乏細節', '過度樂觀', '分散注意力', '依賴他人'
      ],
      careers: [
        '公關專員', '銷售代表', '培訓師', '市場營銷', '客戶服務'
      ],
      workStyle: '重視創意，喜歡變化，善於團隊協作，注重人際關係'
    },
    {
      type: 'S',
      name: '穩定型 (Steadiness)',
      animal: '無尾熊',
      color: 'from-green-500 to-emerald-500',
      icon: '🐨',
      description: '給人可靠的印象，溝通時強調合作和真誠。',
      characteristics: [
        '可靠穩定，值得信賴',
        '耐心細心，不急躁',
        '團隊合作，重視和諧',
        '忠誠度高，對組織忠誠',
        '善於傾聽，理解他人'
      ],
      strengths: [
        '可靠穩定', '耐心', '團隊合作', '忠誠度高', '善於傾聽'
      ],
      challenges: [
        '抗拒變化', '決策緩慢', '避免衝突', '缺乏主動性', '過於保守'
      ],
      careers: [
        '人力資源', '客戶服務', '行政助理', '教師', '護理師'
      ],
      workStyle: '按部就班，穩定執行，重視團隊和諧，喜歡穩定的環境'
    },
    {
      type: 'C',
      name: '分析型 (Conscientiousness)',
      animal: '貓頭鷹',
      color: 'from-purple-500 to-violet-500',
      icon: '🦉',
      description: '精確，有條理，注重細節。追求完美和準確性。',
      characteristics: [
        '注重細節，一絲不苟',
        '分析能力強，邏輯清晰',
        '追求完美，標準很高',
        '邏輯思維，理性分析',
        '專業性強，技能精湛'
      ],
      strengths: [
        '注重細節', '分析能力', '追求完美', '邏輯思維', '專業性強'
      ],
      challenges: [
        '過於謹慎', '完美主義', '決策緩慢', '抗拒變化', '缺乏靈活性'
      ],
      careers: [
        '會計師', '工程師', '研究員', '質量控制', '數據分析師'
      ],
      workStyle: '注重細節，追求完美，喜歡有序的工作環境，重視準確性'
    }
  ]

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.section 
        className="text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold neon-text">
            DISC四型人格理論
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            DISC是一套人格特質分析工具，將人格分為四種主要類型：
            掌控型(D)、影響型(I)、穩定型(S)、分析型(C)。
            了解這些類型有助於改善溝通、提升團隊效率，並找到最適合的職業發展方向。
          </p>
        </div>
      </motion.section>

      {/* Personality Types */}
      <div className="space-y-12">
        {personalityTypes.map((type, index) => (
          <motion.div
            key={type.type}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          >
            <Card className="glass-morphism glow-effect">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${type.color} flex items-center justify-center text-3xl`}>
                    {type.icon}
                  </div>
                  <div>
                    <CardTitle className="text-2xl neon-text">{type.name}</CardTitle>
                    <p className="text-muted-foreground">{type.animal}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg">{type.description}</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 特徵 */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-accent" />
                      主要特徵
                    </h4>
                    <ul className="space-y-2">
                      {type.characteristics.map((char, i) => (
                        <li key={i} className="flex items-start">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0" />
                          <span className="text-sm">{char}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* 優勢與挑戰 */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold flex items-center mb-3">
                        <TrendingUp className="w-5 h-5 mr-2 text-accent" />
                        優勢
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {type.strengths.map((strength, i) => (
                          <Badge key={i} variant="secondary" className="bg-accent/20 text-accent">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold flex items-center mb-3">
                        <AlertCircle className="w-5 h-5 mr-2 text-destructive" />
                        需要注意
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {type.challenges.map((challenge, i) => (
                          <Badge key={i} variant="outline" className="border-destructive/50 text-destructive">
                            {challenge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 職業建議 */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-primary" />
                    適合職業
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {type.careers.map((career, i) => (
                      <Badge key={i} variant="default" className="bg-primary/20 text-primary">
                        {career}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>工作風格：</strong>{type.workStyle}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <motion.section 
        className="text-center space-y-6 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <Card className="glass-morphism glow-effect max-w-4xl mx-auto">
          <CardContent className="p-8 space-y-4">
            <h3 className="text-2xl font-bold neon-text">重要提醒</h3>
            <div className="text-left space-y-3">
              <p>• <strong>沒有好壞之分：</strong>每種人格類型都有其獨特的價值和貢獻</p>
              <p>• <strong>動態變化：</strong>人格特質會隨著環境和經歷而有所調整</p>
              <p>• <strong>混合類型：</strong>大多數人都具有多種類型的特徵</p>
              <p>• <strong>發展潛力：</strong>了解自己的類型有助於個人成長和職業發展</p>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  )
}

