<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require __DIR__ . '/../conexion.php';

try {
    $query = "SELECT idCategoria, nombreCategoria FROM categoria ORDER BY nombreCategoria";
    $result = $conn->query($query);
    
    $categorias = [];
    while ($row = $result->fetch_assoc()) {
        $categorias[] = $row;
    }
    
    echo json_encode($categorias);
    
} catch (Exception $e) {
    echo json_encode(["error" => "Error al obtener categorías: " . $e->getMessage()]);
}

?>
