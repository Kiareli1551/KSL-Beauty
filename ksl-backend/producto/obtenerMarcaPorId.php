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
$idMarca = $data["idMarca"] ?? 0;

if ($idMarca <= 0) {
    echo json_encode(["ok" => false, "mensaje" => "ID de marca inválido"]);
    exit;
}

require __DIR__ . '/../conexion.php';

try {
    $stmt = $conn->prepare("SELECT nombreMarca FROM marca WHERE idMarca = ?");
    $stmt->bind_param("i", $idMarca);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(["ok" => false, "mensaje" => "Marca no encontrada"]);
        exit;
    }
    
    $row = $result->fetch_assoc();
    
    echo json_encode([
        "ok" => true,
        "nombreMarca" => $row["nombreMarca"]
    ]);
    
} catch (Exception $e) {
    echo json_encode(["ok" => false, "mensaje" => "Error al obtener marca: " . $e->getMessage()]);
}

?>
