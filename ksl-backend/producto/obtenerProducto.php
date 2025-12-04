<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

session_start();

// CORS preflight
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// Verificar si es administrador
if (!isset($_SESSION["usuario"]["tipo"]) || $_SESSION["usuario"]["tipo"] !== "administrador") {
    echo json_encode(["ok" => false, "mensaje" => "Acceso no autorizado"]);
    exit;
}

// Obtener datos del request
$data = json_decode(file_get_contents("php://input"), true);
$idProducto = $data["idProducto"] ?? 0;

if ($idProducto <= 0) {
    echo json_encode(["ok" => false, "mensaje" => "ID de producto inválido"]);
    exit;
}

// Conexión a la base de datos
require __DIR__ . '/../conexion.php';

try {
    // Obtener producto por ID
    $stmt = $conn->prepare("
        SELECT p.*, m.nombreMarca, c.nombreCategoria 
        FROM producto p
        LEFT JOIN marca m ON p.idMarca = m.idMarca
        LEFT JOIN categoria c ON p.idCategoria = c.idCategoria
        WHERE p.idProducto = ?
    ");
    $stmt->bind_param("i", $idProducto);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(["ok" => false, "mensaje" => "Producto no encontrado"]);
        exit;
    }
    
    $producto = $result->fetch_assoc();
    
    // Convertir tipos de datos
    $producto["precioProducto"] = floatval($producto["precioProducto"]);
    $producto["cantidadProducto"] = intval($producto["cantidadProducto"]);
    $producto["idMarca"] = intval($producto["idMarca"]);
    $producto["idCategoria"] = intval($producto["idCategoria"]);
    
    echo json_encode([
        "ok" => true,
        "producto" => $producto
    ]);
    
} catch (Exception $e) {
    echo json_encode(["ok" => false, "mensaje" => "Error al obtener producto: " . $e->getMessage()]);
}
?>