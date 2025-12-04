<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

session_start();

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if (!isset($_SESSION["usuario"]["tipo"]) || $_SESSION["usuario"]["tipo"] !== "administrador") {
    echo json_encode(["ok" => false, "mensaje" => "Acceso no autorizado"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$idProducto = $data["idProducto"] ?? 0;

if ($idProducto <= 0) {
    echo json_encode(["ok" => false, "mensaje" => "ID de producto inválido"]);
    exit;
}

require __DIR__ . '/../conexion.php';

try {
    $conn->begin_transaction();
    
    $stmtEliminarCarritos = $conn->prepare("DELETE FROM usuario_producto WHERE idProducto = ?");
    $stmtEliminarCarritos->bind_param("i", $idProducto);
    
    if (!$stmtEliminarCarritos->execute()) {
        throw new Exception("Error al eliminar producto de los carritos");
    }
    
    $stmtEliminarCarritos->close();
    
    $stmtEliminarProducto = $conn->prepare("DELETE FROM producto WHERE idProducto = ?");
    $stmtEliminarProducto->bind_param("i", $idProducto);
    
    if (!$stmtEliminarProducto->execute()) {
        throw new Exception("Error al eliminar el producto");
    }
    
    if ($stmtEliminarProducto->affected_rows === 0) {
        throw new Exception("El producto no existe");
    }
    
    $stmtEliminarProducto->close();
    
    $conn->commit();
    
    echo json_encode([
        "ok" => true, 
        "mensaje" => "Producto eliminado correctamente"
    ]);
    
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["ok" => false, "mensaje" => $e->getMessage()]);
}

?>
