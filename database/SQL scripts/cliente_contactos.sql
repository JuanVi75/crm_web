CREATE TABLE cliente_contactos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id VARCHAR(50) NOT NULL,

    nombre VARCHAR(150) NOT NULL,
    cargo VARCHAR(100),
    telefono VARCHAR(50),
    email VARCHAR(100),

    tipo ENUM('COMPRADOR','ADMINISTRATIVO','OTRO') DEFAULT 'COMPRADOR',

    estado ENUM('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',

    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);