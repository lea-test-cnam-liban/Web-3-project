<?php
session_start();
require 'db.php';
header('Content-Type: application/json');

$uid = $_SESSION['user_id'] ?? 1;
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $stmt = $pdo->prepare(
            'SELECT id, amount_ml, created_at FROM water_logs
             WHERE user_id = ? AND log_date = CURDATE()
             ORDER BY id DESC'
        );
        $stmt->execute([$uid]);
        $logs = $stmt->fetchAll();
        $total = array_sum(array_column($logs, 'amount_ml'));

        $stmt = $pdo->prepare('SELECT goal_ml FROM water_goals WHERE user_id = ?');
        $stmt->execute([$uid]);
               $goal = (int) ($stmt->fetchColumn() ?: 2000);

        $stmt = $pdo->prepare(
            'SELECT log_date, SUM(amount_ml) AS total FROM water_logs
             WHERE user_id = ? AND log_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
             GROUP BY log_date'
        );
        $stmt->execute([$uid]);
        $week = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

        echo json_encode(['total' => $total, 'goal' => $goal, 'logs' => $logs, 'week' => $week]);

    } elseif ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true) ?? [];

        if (isset($data['goal_ml'])) {
            $goal = (int) $data['goal_ml'];
            if ($goal < 500 || $goal > 6000) {
                http_response_code(422);
                echo json_encode(['error' => 'Goal must be between 500 and 6000 ml']);
                exit;
            }
            $stmt = $pdo->prepare(
                'INSERT INTO water_goals (user_id, goal_ml) VALUES (?, ?)
                 ON DUPLICATE KEY UPDATE goal_ml = VALUES(goal_ml)'
            );
            $stmt->execute([$uid, $goal]);
            echo json_encode(['ok' => true]);
            exit;
        }

      
        $amount = (int) ($data['amount_ml'] ?? 0);
        if ($amount < 1 || $amount > 2000) {
            http_response_code(422);
            echo json_encode(['error' => 'Invalid amount']);
            exit;
        }
        $stmt = $pdo->prepare(
            'INSERT INTO water_logs (user_id, amount_ml, log_date)
             VALUES (?, ?, CURDATE())'
        );
        $stmt->execute([$uid, $amount]);
        echo json_encode(['ok' => true]);

    } elseif ($method === 'DELETE') {
        $id = (int) ($_GET['id'] ?? 0);
        $stmt = $pdo->prepare('DELETE FROM water_logs WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $uid]);
        echo json_encode(['ok' => true]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}