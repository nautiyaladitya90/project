<?php
require_once 'api/db.php';
try {
    $sql = file_get_contents('database.sql');
    $conn->exec($sql);
    echo "DB tables created successfully.\n";
    
    $seedSql = file_get_contents('subjects_seed.sql');
    $conn->exec($seedSql);
    echo "Seed executed successfully.\n";
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
