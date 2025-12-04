<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require '../conexion.php';

$porPagina = 48; 
$pagina = isset($_GET['pagina']) ? intval($_GET['pagina']) : 1;
$offset = ($pagina - 1) * $porPagina;

$sql = "SELECT 
            producto.idProducto,
            producto.nombreProducto,
            producto.descripcionProducto,
            producto.precioProducto,
            producto.imagenProducto,
            producto.cantidadProducto,
            marca.nombreMarca,
            categoria.nombreCategoria
        FROM producto
        INNER JOIN marca ON producto.idMarca = marca.idMarca
        INNER JOIN categoria ON producto.idCategoria = categoria.idCategoria
        LIMIT $porPagina OFFSET $offset";

$result = $conn->query($sql);

$productos = [];

while ($row = $result->fetch_assoc()) {
    $productos[] = $row;
}

$totalSql = "SELECT COUNT(*) as total FROM producto";
$totalResult = $conn->query($totalSql);
$total = $totalResult->fetch_assoc()['total'];

echo json_encode([
    "productos" => $productos,
    "total" => $total,
    "pagina" => $pagina,
    "porPagina" => $porPagina
]);
?>
