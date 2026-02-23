<?php
// Test MySQL connection
$conn = mysqli_connect("127.0.0.1", "root", "", "laravel_react_balderz");

if (mysqli_connect_error()) {
    echo "Connection failed: " . mysqli_connect_error();
    exit;
}

echo "Connected successfully!";
mysqli_close($conn);
?>