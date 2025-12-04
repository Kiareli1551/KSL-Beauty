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

if (!isset($_SESSION["usuario"]["id"])) {
    echo json_encode(["ok" => false, "mensaje" => "Debes iniciar sesión"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$idUsuario = $_SESSION["usuario"]["id"];
$idProducto = $data["idProducto"] ?? 0;
$cantidad = $data["cantidad"] ?? 0;

if ($idProducto <= 0 || $cantidad <= 0) {
    echo json_encode(["ok" => false, "mensaje" => "Datos inválidos"]);
    exit;
}

require __DIR__ . '/../conexion.php';

$update = $conn->prepare("
    UPDATE usuario_producto 
    SET cantidadUsuarioProducto = ?
    WHERE idUsuario = ? AND idProducto = ?
");

$update->bind_param("iii", $cantidad, $idUsuario, $idProducto);
$update->execute();

echo json_encode(["ok" => true, "mensaje" => "Cantidad actualizada"]);
?>
