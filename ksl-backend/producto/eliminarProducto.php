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
    // Iniciar transacción
    $conn->begin_transaction();
    
    // 1. Eliminar de los carritos de usuarios primero
    $stmtEliminarCarritos = $conn->prepare("DELETE FROM usuario_producto WHERE idProducto = ?");
    $stmtEliminarCarritos->bind_param("i", $idProducto);
    
    if (!$stmtEliminarCarritos->execute()) {
        throw new Exception("Error al eliminar producto de los carritos");
    }
    
    $stmtEliminarCarritos->close();
    
    // 2. Eliminar el producto
    $stmtEliminarProducto = $conn->prepare("DELETE FROM producto WHERE idProducto = ?");
    $stmtEliminarProducto->bind_param("i", $idProducto);
    
    if (!$stmtEliminarProducto->execute()) {
        throw new Exception("Error al eliminar el producto");
    }
    
    // Verificar si se eliminó alguna fila
    if ($stmtEliminarProducto->affected_rows === 0) {
        throw new Exception("El producto no existe");
    }
    
    $stmtEliminarProducto->close();
    
    // Confirmar transacción
    $conn->commit();
    
    echo json_encode([
        "ok" => true, 
        "mensaje" => "Producto eliminado correctamente"
    ]);
    
} catch (Exception $e) {
    // Revertir transacción en caso de error
    $conn->rollback();
    echo json_encode(["ok" => false, "mensaje" => $e->getMessage()]);
}
?>