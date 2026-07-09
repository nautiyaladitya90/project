<?php
require_once 'db.php';

header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $conn->prepare("SELECT * FROM subjects ORDER BY added_at DESC");
    $stmt->execute();
    $subjects = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($subjects);
} 
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $title = $data['title'] ?? '';
    $year_sem = $data['year_sem'] ?? '';
    
    if (!empty($title)) {
        $stmt = $conn->prepare("INSERT INTO subjects (title, year_sem) VALUES (?, ?)");
        $stmt->execute([$title, $year_sem]);
        echo json_encode(['id' => $conn->lastInsertId(), 'message' => 'Subject added']);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Title is required']);
    }
}
?>
