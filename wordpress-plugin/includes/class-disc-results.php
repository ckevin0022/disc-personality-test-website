<?php
/**
 * DISC結果處理類
 */

class DISC_Results {
    
    public function __construct() {
        // 初始化結果處理功能
    }
    
    /**
     * 保存測驗結果
     */
    public function save_result($data) {
        global $wpdb;
        $table_results = $wpdb->prefix . 'disc_results';
        
        $result = $wpdb->insert(
            $table_results,
            array(
                'user_id' => get_current_user_id(),
                'session_id' => session_id(),
                'd_score' => $data['d_score'],
                'i_score' => $data['i_score'],
                's_score' => $data['s_score'],
                'c_score' => $data['c_score'],
                'dominant_type' => $data['dominant_type'],
                'result_data' => json_encode($data['answers'])
            ),
            array('%d', '%s', '%d', '%d', '%d', '%d', '%s', '%s')
        );
        
        return $result ? $wpdb->insert_id : false;
    }
    
    /**
     * 獲取測驗結果
     */
    public function get_result($result_id) {
        global $wpdb;
        $table_results = $wpdb->prefix . 'disc_results';
        
        return $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_results WHERE id = %d",
            $result_id
        ));
    }
    
    /**
     * 獲取用戶的所有結果
     */
    public function get_user_results($user_id = null) {
        global $wpdb;
        $table_results = $wpdb->prefix . 'disc_results';
        
        if (!$user_id) {
            $user_id = get_current_user_id();
        }
        
        return $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $table_results WHERE user_id = %d ORDER BY created_at DESC",
            $user_id
        ));
    }
    
    /**
     * 獲取統計數據
     */
    public function get_statistics() {
        global $wpdb;
        $table_results = $wpdb->prefix . 'disc_results';
        
        $stats = array();
        
        // 總測驗次數
        $stats['total_results'] = $wpdb->get_var("SELECT COUNT(*) FROM $table_results");
        
        // 各類型統計
        $stats['d_count'] = $wpdb->get_var("SELECT COUNT(*) FROM $table_results WHERE dominant_type = 'D'");
        $stats['i_count'] = $wpdb->get_var("SELECT COUNT(*) FROM $table_results WHERE dominant_type = 'I'");
        $stats['s_count'] = $wpdb->get_var("SELECT COUNT(*) FROM $table_results WHERE dominant_type = 'S'");
        $stats['c_count'] = $wpdb->get_var("SELECT COUNT(*) FROM $table_results WHERE dominant_type = 'C'");
        
        // 計算百分比
        if ($stats['total_results'] > 0) {
            $stats['d_percentage'] = round(($stats['d_count'] / $stats['total_results']) * 100, 1);
            $stats['i_percentage'] = round(($stats['i_count'] / $stats['total_results']) * 100, 1);
            $stats['s_percentage'] = round(($stats['s_count'] / $stats['total_results']) * 100, 1);
            $stats['c_percentage'] = round(($stats['c_count'] / $stats['total_results']) * 100, 1);
        } else {
            $stats['d_percentage'] = $stats['i_percentage'] = $stats['s_percentage'] = $stats['c_percentage'] = 0;
        }
        
        return $stats;
    }
}
