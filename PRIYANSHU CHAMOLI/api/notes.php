<?php
require_once 'db.php';

header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $conn->prepare("SELECT * FROM notes ORDER BY uploaded_at DESC");
    $stmt->execute();
    $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($notes);
} 
elseif ($method === 'POST') {
    $year = $_POST['year'] ?? '';
    $semester = $_POST['semester'] ?? '';
    $subject = $_POST['subject'] ?? '';
    $document_type = $_POST['document_type'] ?? 'Note';
    
    if (isset($_FILES['notePdf']) && $_FILES['notePdf']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        
        $originalName = $_FILES['notePdf']['name'];
        $fileName = time() . '_' . basename($originalName);
        $uploadFile = $uploadDir . $fileName;
        
        if (move_uploaded_file($_FILES['notePdf']['tmp_name'], $uploadFile)) {
            $stmt = $conn->prepare("INSERT INTO notes (year, semester, subject, document_type, filename, originalname) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$year, $semester, $subject, $document_type, $fileName, $originalName]);
            echo json_encode(['id' => $conn->lastInsertId(), 'message' => 'Note uploaded']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to move uploaded file']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'No file uploaded or upload error']);
    }
}
elseif ($method === 'DELETE') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    // Get filename to delete the file
    $stmt = $conn->prepare("SELECT filename FROM notes WHERE id = ?");
    $stmt->execute([$id]);
    $note = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($note) {
        $filePath = '../uploads/' . $note['filename'];
        if (file_exists($filePath)) {
            unlink($filePath);
        }
        $delStmt = $conn->prepare("DELETE FROM notes WHERE id = ?");
        $delStmt->execute([$id]);
        echo json_encode(['message' => 'Deleted successfully']);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Note not found']);
    }
}
?>
