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
    echo json_encode(["ok" => false, "mensaje" => "Debes iniciar sesión para añadir al carrito"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$idUsuario = $_SESSION["usuario"]["id"];
$idProducto = $data["idProducto"] ?? 0;
$cantidad = $data["cantidad"] ?? 1;

if ($idProducto <= 0 || $cantidad <= 0) {
    echo json_encode(["ok" => false, "mensaje" => "Datos inválidos"]);
    exit;
}

require __DIR__ . '/../conexion.php';

$check = $conn->prepare("
    SELECT cantidadUsuarioProducto 
    FROM usuario_producto 
    WHERE idUsuario = ? AND idProducto = ?
");
$check->bind_param("ii", $idUsuario, $idProducto);
$check->execute();
$r = $check->get_result();

if ($r->num_rows > 0) {
    $update = $conn->prepare("
        UPDATE usuario_producto 
        SET cantidadUsuarioProducto = ?
        WHERE idUsuario = ? AND idProducto = ?
    ");
    $update->bind_param("iii", $cantidad, $idUsuario, $idProducto);
    $update->execute();

    echo json_encode(["ok" => true, "mensaje" => "Cantidad actualizada"]);
    exit;
}

$insert = $conn->prepare("
    INSERT INTO usuario_producto (idUsuario, idProducto, cantidadUsuarioProducto)
    VALUES (?, ?, ?)
");
$insert->bind_param("iii", $idUsuario, $idProducto, $cantidad);
$insert->execute();

echo json_encode(["ok" => true, "mensaje" => "Producto añadido al carrito"]);
?>
