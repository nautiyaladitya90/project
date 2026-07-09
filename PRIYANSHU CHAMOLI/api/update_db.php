<?php
require_once 'db.php';
try {
    $conn->exec("ALTER TABLE notes ADD COLUMN document_type VARCHAR(50) DEFAULT 'Note' AFTER subject");
    echo "Column added successfully";
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
