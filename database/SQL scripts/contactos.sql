CREATE TABLE clientes_contactos (

    id INT AUTO_INCREMENT PRIMARY KEY,

    cliente_id VARCHAR(30),

    tipo ENUM(
        'SUCURSAL',
        'CONTACTO'
    ) DEFAULT 'CONTACTO',

    nombre VARCHAR(200),

    direccion VARCHAR(250),

    telefono VARCHAR(50),

    ciudad VARCHAR(120),

    email VARCHAR(150),

    contacto VARCHAR(150),

    tel_contacto VARCHAR(50),

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (cliente_id)
    REFERENCES clientes(id)
    ON DELETE CASCADE

);