<?php
if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['fileId'])) {
    $servername = "localhost";
    $username = "hadrel_upload_file";
    $password = "admin";
    $database = "hadrel_upload_file";
    
    $conn = new mysqli($servername, $username, $password, $database);

    //Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $fileId = $_GET['fileId'];
    $sql = "SELECT file_name FROM files WHERE id = ?";
    
    //Use prepared statement to prevent SQL injection
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $fileId);

    if ($stmt->execute()) {
        $stmt->bind_result($fileName);
        $stmt->fetch();

        //Check if a file name was retrieved
        if ($fileName) {
            //Set appropriate headers for file download
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename="' . $fileName . '"');
            
            //Path to theuploaded files folder
            $upload_folder = 'uploads/';
            $file_path = $upload_folder . $fileName;

            //Output the file content
            readfile($file_path);
        } else {
            echo "File not found.";
        }
    } else {
        echo "Error: " . $stmt->error;
    }

    //Close prepared statement
    $stmt->close();

    //Close database connection
    $conn->close();
} else {
    echo "Invalid file request.";
}
?>
