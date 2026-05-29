CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
	usuario VARCHAR(80),
    nombre VARCHAR(150),
    email VARCHAR(150) UNIQUE,

    password VARCHAR(255),

    rol ENUM(
        'ADMIN',
        'ASESOR',
        'SUPERVISOR'
    ) DEFAULT 'ASESOR',

    estado ENUM(
        'ACTIVO',
        'INACTIVO'
    ) DEFAULT 'ACTIVO',

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);