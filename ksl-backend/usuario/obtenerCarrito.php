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

if (!isset($_SESSION["usuario"]["id"])) {
    echo json_encode(["ok" => false, "productos" => [], "mensaje" => "Debes iniciar sesión"]);
    exit;
}

$idUsuario = $_SESSION["usuario"]["id"];

// conexión
require __DIR__ . '/../conexion.php';

$query = $conn->prepare("
    SELECT 
        up.idProducto,
        up.cantidadUsuarioProducto,
        p.nombreProducto,
        p.precioProducto,
        p.imagenProducto
    FROM usuario_producto up
    INNER JOIN producto p ON p.idProducto = up.idProducto
    WHERE up.idUsuario = ?
");

$query->bind_param("i", $idUsuario);
$query->execute();
$result = $query->get_result();

$productos = [];
while ($row = $result->fetch_assoc()) {
    $productos[] = $row;
}

echo json_encode(["ok" => true, "productos" => $productos]);
?>
