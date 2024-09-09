document.getElementById('pdfForm').addEventListener('submit', function (e) {
    e.preventDefault();

    var pdfFile = document.getElementById('pdfFile').files[0];
    if (!pdfFile) {
        alert("Por favor selecciona un archivo PDF.");
        return;
    }

    var formData = new FormData();
    formData.append('pdf', pdfFile);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'upload.php', true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var pdfUrl = response.url;

            var qrcode = new QRCode(document.getElementById("qrcode"), {
                text: pdfUrl,
                width: 128,
                height: 128
            });

            alert('PDF subido exitosamente, código QR generado.');
        } else {
            alert('Error al subir el archivo.');
        }
    };

    xhr.send(formData);
});

// Función para descargar el QR en varios formatos
document.getElementById('downloadQR').addEventListener('click', function() {
    var format = document.getElementById('format').value;
    var qrCanvas = document.querySelector('#qrcode canvas');

    if (!qrCanvas) {
        alert('Por favor genera un código QR primero.');
        return;
    }

    if (format === 'png') {
        // Descargar como PNG
        var pngUrl = qrCanvas.toDataURL('image/png');
        var link = document.createElement('a');
        link.href = pngUrl;
        link.download = 'qr_code.png';
        link.click();
    } else if (format === 'svg') {
        // Descargar como SVG
        var qrSVG = document.querySelector('#qrcode svg');
        if (qrSVG) {
            var svgData = new XMLSerializer().serializeToString(qrSVG);
            var svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            var svgUrl = URL.createObjectURL(svgBlob);
            var link = document.createElement('a');
            link.href = svgUrl;
            link.download = 'qr_code.svg';
            link.click();
        } else {
            alert('El QR en formato SVG no está disponible.');
        }
    } else if (format === 'pdf') {
        // Descargar como PDF usando jsPDF
        var { jsPDF } = window.jspdf;
        var doc = new jsPDF();

        // Agregar la imagen del QR al PDF
        var pngUrl = qrCanvas.toDataURL('image/png');
        doc.addImage(pngUrl, 'PNG', 10, 10, 50, 50);

        // Descargar el archivo PDF
        doc.save('qr_code.pdf');
    }
});
