<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $servername = "localhost";
    $username = "hadrel_upload_file";
    $password = "admin";
    $database = "hadrel_upload_file";
    $conn = new mysqli($servername, $username, $password, $database);

    //Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    //Get data
    $title = $_POST['title'];
    $description = $_POST['description'];

    //File upload
    $file_name = $_FILES['file']['name'];
    $file_temp = $_FILES['file']['tmp_name'];
    $file_type = $_FILES['file']['type'];

    $allowed_types = array('application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint');

    if (in_array($file_type, $allowed_types)) {
        if (is_uploaded_file($file_temp)) {
            $file_info = pathinfo($file_name);
            $file_extension = $file_info['extension'];

            $unique_filename = uniqid() . '.' . $file_extension;

            $sql = $conn->prepare("INSERT INTO files (title, description, file_name) VALUES (?, ?, ?)");
            $sql->bind_param("sss", $title, $description, $unique_filename);

            if ($sql->execute()) {
                $upload_folder = 'uploads/';
                $upload_path = $upload_folder . $unique_filename;

                if (move_uploaded_file($file_temp, $upload_path)) {
                    header('Location: ' . $_SERVER['HTTP_REFERER']);
                    exit();
                } else {
                    echo "Error moving file to the upload folder.";
                }
            } else {
                echo "Error inserting data into the database: " . $sql->error;
            }
        } else {
            echo "Error: File not uploaded successfully.";
        }
    } else {
        echo "Only PDF, TXT, DOCX, or PPT files are allowed.";
    }

    $sql->close();
    $conn->close();
}
?>
s