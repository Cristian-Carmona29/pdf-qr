<?php
// Verificar si el archivo PDF ha sido enviado correctamente
if ($_FILES['pdf']['error'] == UPLOAD_ERR_OK) {
    $uploadDir = 'uploads/';  // Carpeta donde se guardarán los PDFs
    $fileName = basename($_FILES['pdf']['name']);
    $uploadFilePath = $uploadDir . $fileName;

    // Crear la carpeta 'uploads' si no existe
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Mover el archivo a la carpeta 'uploads'
    if (move_uploaded_file($_FILES['pdf']['tmp_name'], $uploadFilePath)) {
        // Devolver la URL del archivo en formato JSON
        $response = array('url' => $uploadFilePath);
        echo json_encode($response);
    } else {
        http_response_code(500);
        echo json_encode(array('error' => 'Error al mover el archivo.'));
    }
} else {
    http_response_code(400);
    echo json_encode(array('error' => 'Error al subir el archivo.'));
}
?>
