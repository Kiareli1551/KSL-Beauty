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
    $query = "SELECT idMarca, nombreMarca FROM marca ORDER BY nombreMarca";
    $result = $conn->query($query);
    
    $marcas = [];
    while ($row = $result->fetch_assoc()) {
        $marcas[] = $row;
    }
    
    echo json_encode($marcas);
    
} catch (Exception $e) {
    echo json_encode(["error" => "Error al obtener marcas: " . $e->getMessage()]);
}

?>
