<?php
/**
 * DISC測驗核心類
 */

class DISC_Test {
    
    public function __construct() {
        // 初始化測驗功能
    }
    
    /**
     * 獲取測驗問題
     */
    public function get_questions() {
        return array(
            array(
                'id' => 1,
                'question' => '在團隊中，我傾向於：',
                'options' => array(
                    '直接領導並做出決策',
                    '激勵他人並建立關係',
                    '支持團隊並保持和諧',
                    '分析問題並確保品質'
                )
            ),
            // ... 更多問題已在主文件中定義
        );
    }
    
    /**
     * 計算DISC分數
     */
    public function calculate_scores($answers) {
        $d_score = 0;
        $i_score = 0;
        $s_score = 0;
        $c_score = 0;
        
        foreach ($answers as $answer) {
            switch ($answer) {
                case 0: // D型
                    $d_score += 1;
                    break;
                case 1: // I型
                    $i_score += 1;
                    break;
                case 2: // S型
                    $s_score += 1;
                    break;
                case 3: // C型
                    $c_score += 1;
                    break;
            }
        }
        
        return array(
            'd_score' => $d_score,
            'i_score' => $i_score,
            's_score' => $s_score,
            'c_score' => $c_score
        );
    }
    
    /**
     * 確定主導類型
     */
    public function determine_dominant_type($scores) {
        $max_score = max($scores);
        $dominant_types = array_keys($scores, $max_score);
        
        // 如果有多個相同分數，返回第一個
        return $dominant_types[0];
    }
}
