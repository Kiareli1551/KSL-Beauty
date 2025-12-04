<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

session_start();

// CORS preflight
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// Verificar si es administrador
if (!isset($_SESSION["usuario"]["tipo"]) || $_SESSION["usuario"]["tipo"] !== "administrador") {
    echo json_encode(["error" => "Acceso no autorizado"]);
    exit;
}

// Conexión a la base de datos
require __DIR__ . '/../conexion.php';

try {
    // Obtener todas las categorías
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