CREATE TABLE clientes (

    id VARCHAR(20) PRIMARY KEY,   -- NIT

    cliente VARCHAR(200) NOT NULL,
    direccion VARCHAR(250),
    telefono VARCHAR(50),

    -- 🔴 TEXTO (IMPORTACIÓN CSV)
    ciudad VARCHAR(120),
    departamento VARCHAR(120),

    -- 🟢 IDS (FUTURO NORMALIZADO)
    ciudad_id VARCHAR(10) NULL,
    departamento_id INT NULL,

    email VARCHAR(150),
	
    sector varchar(150),
    
    sector_id INT NULL,

    contacto VARCHAR(150),
    tel_contacto VARCHAR(50),

    asesor VARCHAR(150),

    maneja_sucursales ENUM('SI','NO') DEFAULT 'NO',

    estado ENUM('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);