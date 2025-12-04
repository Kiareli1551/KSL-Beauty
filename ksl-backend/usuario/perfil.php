<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");

session_start();

if (!isset($_SESSION["usuario"])) {
    echo json_encode(["ok" => false, "mensaje" => "No hay sesión activa"]);
    exit;
}

echo json_encode([
    "ok" => true,
    "usuario" => $_SESSION["usuario"]
]);
