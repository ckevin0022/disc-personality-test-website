<?php
/**
 * DISC管理員功能類
 */

class DISC_Admin {
    
    public function __construct() {
        // 初始化管理員功能
    }
    
    /**
     * 獲取管理員設置
     */
    public function get_setting($key, $default = '') {
        global $wpdb;
        $table_settings = $wpdb->prefix . 'disc_settings';
        
        $value = $wpdb->get_var($wpdb->prepare(
            "SELECT setting_value FROM $table_settings WHERE setting_key = %s",
            $key
        ));
        
        return $value !== null ? $value : $default;
    }
    
    /**
     * 更新管理員設置
     */
    public function update_setting($key, $value) {
        global $wpdb;
        $table_settings = $wpdb->prefix . 'disc_settings';
        
        return $wpdb->replace(
            $table_settings,
            array(
                'setting_key' => $key,
                'setting_value' => $value
            ),
            array('%s', '%s')
        );
    }
    
    /**
     * 驗證管理員密碼
     */
    public function verify_admin_password($password) {
        $admin_password = $this->get_setting('admin_password', 'admin123');
        return $password === $admin_password;
    }
    
    /**
     * 更改管理員密碼
     */
    public function change_admin_password($new_password) {
        return $this->update_setting('admin_password', $new_password);
    }
    
    /**
     * 獲取最近的測驗結果
     */
    public function get_recent_results($limit = 10) {
        global $wpdb;
        $table_results = $wpdb->prefix . 'disc_results';
        
        return $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $table_results ORDER BY created_at DESC LIMIT %d",
            $limit
        ));
    }
    
    /**
     * 刪除測驗結果
     */
    public function delete_result($result_id) {
        global $wpdb;
        $table_results = $wpdb->prefix . 'disc_results';
        
        return $wpdb->delete(
            $table_results,
            array('id' => $result_id),
            array('%d')
        );
    }
    
    /**
     * 導出測驗結果
     */
    public function export_results($format = 'csv') {
        global $wpdb;
        $table_results = $wpdb->prefix . 'disc_results';
        
        $results = $wpdb->get_results("SELECT * FROM $table_results ORDER BY created_at DESC");
        
        if ($format === 'csv') {
            return $this->export_to_csv($results);
        } elseif ($format === 'json') {
            return json_encode($results, JSON_PRETTY_PRINT);
        }
        
        return false;
    }
    
    /**
     * 導出為CSV格式
     */
    private function export_to_csv($results) {
        $filename = 'disc_results_' . date('Y-m-d_H-i-s') . '.csv';
        
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        
        $output = fopen('php://output', 'w');
        
        // 添加BOM以支持中文
        fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
        
        // 寫入標題行
        fputcsv($output, array(
            'ID',
            '用戶ID',
            'D分數',
            'I分數',
            'S分數',
            'C分數',
            '主導類型',
            '完成時間'
        ));
        
        // 寫入數據行
        foreach ($results as $result) {
            fputcsv($output, array(
                $result->id,
                $result->user_id,
                $result->d_score,
                $result->i_score,
                $result->s_score,
                $result->c_score,
                $result->dominant_type,
                $result->created_at
            ));
        }
        
        fclose($output);
        exit;
    }
    
    /**
     * 獲取詳細統計報告
     */
    public function get_detailed_statistics() {
        global $wpdb;
        $table_results = $wpdb->prefix . 'disc_results';
        
        $stats = array();
        
        // 基本統計
        $stats['total_results'] = $wpdb->get_var("SELECT COUNT(*) FROM $table_results");
        $stats['unique_users'] = $wpdb->get_var("SELECT COUNT(DISTINCT user_id) FROM $table_results");
        
        // 各類型統計
        $stats['d_count'] = $wpdb->get_var("SELECT COUNT(*) FROM $table_results WHERE dominant_type = 'D'");
        $stats['i_count'] = $wpdb->get_var("SELECT COUNT(*) FROM $table_results WHERE dominant_type = 'I'");
        $stats['s_count'] = $wpdb->get_var("SELECT COUNT(*) FROM $table_results WHERE dominant_type = 'S'");
        $stats['c_count'] = $wpdb->get_var("SELECT COUNT(*) FROM $table_results WHERE dominant_type = 'C'");
        
        // 平均分數
        $stats['avg_d_score'] = $wpdb->get_var("SELECT AVG(d_score) FROM $table_results");
        $stats['avg_i_score'] = $wpdb->get_var("SELECT AVG(i_score) FROM $table_results");
        $stats['avg_s_score'] = $wpdb->get_var("SELECT AVG(s_score) FROM $table_results");
        $stats['avg_c_score'] = $wpdb->get_var("SELECT AVG(c_score) FROM $table_results");
        
        // 每日統計（最近30天）
        $stats['daily_stats'] = $wpdb->get_results("
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as count,
                AVG(d_score) as avg_d,
                AVG(i_score) as avg_i,
                AVG(s_score) as avg_s,
                AVG(c_score) as avg_c
            FROM $table_results 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        ");
        
        return $stats;
    }
}
