<?php
require_once __DIR__ . '/../includes/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_response(['error' => 'POST only'], 405);

$in    = input();
$name  = trim($in['full_name'] ?? '');
$email = strtolower(trim($in['email'] ?? ''));
$pass  = $in['password'] ?? '';

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($pass) < 8) {
    json_response(['error' => 'Enter a name, a valid email, and a password of at least 8 characters.'], 422);
}

$pdo = db();
$check = $pdo->prepare('SELECT 1 FROM users WHERE email = ?');
$check->execute([$email]);
if ($check->fetch()) json_response(['error' => 'Email already registered.'], 409);

$pdo->prepare('INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)')
    ->execute([$name, $email, password_hash($pass, PASSWORD_DEFAULT)]);
$id = (int)$pdo->lastInsertId();

$pdo->prepare('INSERT INTO streak (user_id) VALUES (?)')->execute([$id]);

session_regenerate_id(true);
$_SESSION['user_id'] = $id;
json_response(['ok' => true, 'user' => ['user_id' => $id, 'full_name' => $name, 'email' => $email]], 201);