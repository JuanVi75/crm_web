CREATE TABLE sucursales (
    id INT AUTO_INCREMENT PRIMARY KEY,

    cliente_id INT NOT NULL,

    nombre VARCHAR(150),
    direccion TEXT,
    ciudad VARCHAR(100),

    telefono VARCHAR(30),
    email VARCHAR(150),

    encargado VARCHAR(150),

    estado ENUM('ACTIVA','INACTIVA') DEFAULT 'ACTIVA',

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (cliente_id)
    REFERENCES clientes(id)
    ON DELETE CASCADE
);