CREATE TABLE pedidos (
    doc VARCHAR(30) PRIMARY KEY,
    fecha DATE NOT NULL,
    id_cliente VARCHAR(20) NOT NULL,
    cliente VARCHAR(255),
    cot_no VARCHAR(30),
    vta_bruta DECIMAL(15,2) DEFAULT 0,
    dcto DECIMAL(10,2) DEFAULT 0,
    venta_neta DECIMAL(15,2) DEFAULT 0,
    iva DECIMAL(15,2) DEFAULT 0,
    otros_imp DECIMAL(15,2) DEFAULT 0,
    total DECIMAL(15,2) DEFAULT 0,
    asesor VARCHAR(100),

    INDEX (id_cliente),
    INDEX (cot_no),
    INDEX (fecha)
);