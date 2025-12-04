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

$data = json_decode(file_get_contents("php://input"), true);

$nombreUsuario = $data["nombreUsuario"] ?? "";
$password = $data["contraseña"] ?? "";

require __DIR__ . '/../conexion.php';

$stmt = $conn->prepare("
    SELECT idUsuario, nombreUsuario, emailUsuario, passwordUsuario, tipoUsuario
    FROM usuario 
    WHERE nombreUsuario = ?
");
$stmt->bind_param("s", $nombreUsuario);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["ok" => false, "mensaje" => "Usuario no encontrado"]);
    exit;
}

$usuario = $result->fetch_assoc();

if (hash("sha256", $password) !== $usuario["passwordUsuario"]) {
    echo json_encode(["ok" => false, "mensaje" => "Contraseña incorrecta"]);
    exit;
}

$_SESSION["usuario"] = [
    "id" => $usuario["idUsuario"],
    "nombre" => $usuario["nombreUsuario"],
    "email" => $usuario["emailUsuario"],
    "tipo" => $usuario["tipoUsuario"]
];

echo json_encode([
    "ok" => true,
    "mensaje" => "Login exitoso",
    "usuario" => $_SESSION["usuario"]
]);

