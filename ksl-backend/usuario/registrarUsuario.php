<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data["nombreUsuario"]) || empty($data["emailUsuario"]) || empty($data["contraseña"])) {
    echo json_encode([
        "ok" => false, 
        "mensaje" => "Todos los campos son obligatorios"
    ]);
    exit;
}

require __DIR__ . '/../conexion.php';

try {
    $stmtCheckUsuario = $conn->prepare("SELECT idUsuario FROM usuario WHERE nombreUsuario = ?");
    $stmtCheckUsuario->bind_param("s", $data["nombreUsuario"]);
    $stmtCheckUsuario->execute();
    $resultCheckUsuario = $stmtCheckUsuario->get_result();
    
    if ($resultCheckUsuario->num_rows > 0) {
        echo json_encode([
            "ok" => false, 
            "mensaje" => "El nombre de usuario ya está en uso",
            "campo" => "nombreUsuario"
        ]);
        exit;
    }
    $stmtCheckUsuario->close();
    
    $stmtCheckEmail = $conn->prepare("SELECT idUsuario FROM usuario WHERE emailUsuario = ?");
    $stmtCheckEmail->bind_param("s", $data["emailUsuario"]);
    $stmtCheckEmail->execute();
    $resultCheckEmail = $stmtCheckEmail->get_result();
    
    if ($resultCheckEmail->num_rows > 0) {
        echo json_encode([
            "ok" => false, 
            "mensaje" => "El correo electrónico ya está registrado",
            "campo" => "emailUsuario"
        ]);
        exit;
    }
    $stmtCheckEmail->close();
    
    $queryMaxUsuario = "SELECT MAX(idUsuario) as maxId FROM usuario";
    $resultMaxUsuario = $conn->query($queryMaxUsuario);
    $rowMaxUsuario = $resultMaxUsuario->fetch_assoc();
    $nuevoIdUsuario = ($rowMaxUsuario["maxId"] ?? 0) + 1;
    
    $passwordHash = hash('sha256', $data["contraseña"]);
    
    $tipoUsuario = "cliente";
    
    $stmtInsert = $conn->prepare("
        INSERT INTO usuario (
            idUsuario, 
            nombreUsuario, 
            emailUsuario, 
            passwordUsuario, 
            tipoUsuario
        ) VALUES (?, ?, ?, ?, ?)
    ");
    
    $stmtInsert->bind_param(
        "issss",
        $nuevoIdUsuario,
        $data["nombreUsuario"],
        $data["emailUsuario"],
        $passwordHash,
        $tipoUsuario
    );
    
    if ($stmtInsert->execute()) {
        echo json_encode([
            "ok" => true, 
            "mensaje" => "Usuario registrado exitosamente"
        ]);
    } else {
        throw new Exception("Error al registrar el usuario");
    }
    
    $stmtInsert->close();
    
} catch (Exception $e) {
    echo json_encode([
        "ok" => false, 
        "mensaje" => "Error en el servidor: " . $e->getMessage()
    ]);
}

?>
