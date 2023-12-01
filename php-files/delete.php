<?php
//Database connection details
$servername = "localhost";
$username = "hadrel_upload_file";
$password = "admin";
$database = "hadrel_upload_file";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//Retrieve the file ID from the request
$fileId = json_decode(file_get_contents('php://input'), true)['fileId'];

//Construct and execute a DELETE SQL query
$sql = "DELETE FROM files WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $fileId);

//Execute the query
$success = $stmt->execute();

$conn->close();

//Return a response to the client
header('Content-Type: application/json');
echo json_encode(['success' => $success]);
?>
