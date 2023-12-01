<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    //Get data
    $name = $_POST["name"];
    $email = $_POST["email"];
    $subject = $_POST["subject"];
    $message = $_POST["message"];

    //Set email address
    $to = "hadrelandonn@gmail.com";

    $headers = "From: $name <$email>" . "\r\n";
    $headers .= "Reply-To: $email" . "\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8" . "\r\n";

    //Compose the email message
    $emailMessage = "
        <html>
        <head>
            <title>$subject</title>
        </head>
        <body>
            <p><b>Name:</b> $name</p>
            <p><b>Email:</b> $email</p>
            <p><b>Subject:</b> $subject</p>
            <p><b>Message:</b> $message</p>
        </body>
        </html>
    ";
    $success = mail($to, $subject, $emailMessage, $headers);

    if ($success) {
        echo "Thank you for contacting us! Your message has been sent.";
    } else {
        echo "Sorry, something went wrong and we couldn't send your message.";
    }
} else {
    echo "Form submission error.";
}
?>
