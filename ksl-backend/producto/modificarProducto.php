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

if (empty($data["idProducto"]) || empty($data["nombreProducto"]) || 
    empty($data["descripcionProducto"]) || empty($data["precioProducto"]) || 
    empty($data["cantidadProducto"]) || empty($data["idCategoria"])) {
    echo json_encode(["ok" => false, "mensaje" => "Faltan datos obligatorios"]);
    exit;
}

require __DIR__ . '/../conexion.php';

try {
    $conn->begin_transaction();
    
    $idMarca = null;
    
    if ($data["idMarca"] === "nueva") {
        $queryMaxMarca = "SELECT MAX(idMarca) as maxId FROM marca";
        $resultMaxMarca = $conn->query($queryMaxMarca);
        $rowMaxMarca = $resultMaxMarca->fetch_assoc();
        $nuevoIdMarca = ($rowMaxMarca["maxId"] ?? 0) + 1;
        
        $stmtMarca = $conn->prepare("INSERT INTO marca (idMarca, nombreMarca) VALUES (?, ?)");
        $stmtMarca->bind_param("is", $nuevoIdMarca, $data["nuevaMarca"]);
        
        if (!$stmtMarca->execute()) {
            throw new Exception("Error al crear la nueva marca");
        }
        
        $idMarca = $nuevoIdMarca;
        $stmtMarca->close();
        
    } else {
        $idMarca = intval($data["idMarca"]);
        
        $stmtCheckMarca = $conn->prepare("SELECT idMarca FROM marca WHERE idMarca = ?");
        $stmtCheckMarca->bind_param("i", $idMarca);
        $stmtCheckMarca->execute();
        $resultCheckMarca = $stmtCheckMarca->get_result();
        
        if ($resultCheckMarca->num_rows === 0) {
            throw new Exception("La marca seleccionada no existe");
        }
        
        $stmtCheckMarca->close();
    }
    
    $stmtCheckCat = $conn->prepare("SELECT idCategoria FROM categoria WHERE idCategoria = ?");
    $stmtCheckCat->bind_param("i", $data["idCategoria"]);
    $stmtCheckCat->execute();
    $resultCheckCat = $stmtCheckCat->get_result();
    
    if ($resultCheckCat->num_rows === 0) {
        throw new Exception("La categoría seleccionada no existe");
    }
    
    $stmtCheckCat->close();
    
    $stmtCheckProd = $conn->prepare("SELECT idProducto FROM producto WHERE idProducto = ?");
    $stmtCheckProd->bind_param("i", $data["idProducto"]);
    $stmtCheckProd->execute();
    $resultCheckProd = $stmtCheckProd->get_result();
    
    if ($resultCheckProd->num_rows === 0) {
        throw new Exception("El producto no existe");
    }
    
    $stmtCheckProd->close();
    
    $stmtProducto = $conn->prepare("
        UPDATE producto SET
            idMarca = ?,
            idCategoria = ?,
            nombreProducto = ?,
            descripcionProducto = ?,
            precioProducto = ?,
            imagenProducto = ?,
            cantidadProducto = ?
        WHERE idProducto = ?
    ");
    
    $imagen = !empty($data["imagenProducto"]) ? $data["imagenProducto"] : "/images/Imagen_no_disponible.png";

    $stmtProducto->bind_param(
        "iissdsii",
        $idMarca,
        $data["idCategoria"],
        $data["nombreProducto"],
        $data["descripcionProducto"],
        $data["precioProducto"],
        $imagen,
        $data["cantidadProducto"],
        $data["idProducto"]
    );
    
    if (!$stmtProducto->execute()) {
        throw new Exception("Error al actualizar el producto");
    }
    
    $stmtProducto->close();
    
    $conn->commit();
    
    echo json_encode([
        "ok" => true, 
        "mensaje" => "Producto actualizado correctamente"
    ]);
    
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["ok" => false, "mensaje" => $e->getMessage()]);
}

?>
