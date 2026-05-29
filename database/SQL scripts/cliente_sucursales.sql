CREATE TABLE cliente_sucursales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id VARCHAR(50) NOT NULL,

    nombre VARCHAR(150) NOT NULL,
    ciudad VARCHAR(100),
    direccion VARCHAR(255),
    telefono VARCHAR(50),
    contacto VARCHAR(100),

    estado ENUM('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',

    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);