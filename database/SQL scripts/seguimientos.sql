CREATE TABLE seguimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,

    cliente_id VARCHAR(50) NOT NULL,

    tipo ENUM(
        'LLAMADA',
        'WHATSAPP',
        'VISITA',
        'EMAIL',
        'COTIZACION',
        'OTRO'
    ) NOT NULL,

    nota TEXT NOT NULL,

    proxima_accion VARCHAR(255),
    fecha_proxima DATE NULL,

    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

    asesor VARCHAR(100),

    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);