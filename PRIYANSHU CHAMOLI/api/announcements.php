<?php
require_once 'db.php';

header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $conn->prepare("SELECT * FROM announcements ORDER BY posted_at DESC");
    $stmt->execute();
    $announcements = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($announcements);
} 
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $title = $data['title'] ?? '';
    $message = $data['message'] ?? '';
    
    if (!empty($title) && !empty($message)) {
        $stmt = $conn->prepare("INSERT INTO announcements (title, message) VALUES (?, ?)");
        $stmt->execute([$title, $message]);
        echo json_encode(['id' => $conn->lastInsertId(), 'message' => 'Announcement posted']);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Title and message are required']);
    }
}
?>
