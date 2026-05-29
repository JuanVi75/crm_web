CREATE OR REPLACE VIEW vista_clientes AS

SELECT 
    c.id,
    c.cliente,
    c.direccion,
    c.telefono,

    c.email,
    c.contacto,
    c.tel_contacto,
    c.asesor,
    c.estado,
    c.maneja_sucursales,

    ci.municipio AS ciudad,
    d.depto AS departamento,
    s.sector AS sector

FROM clientes c

LEFT JOIN ciudades ci 
    ON ci.id = c.ciudad_id

LEFT JOIN departamentos d 
    ON d.id = c.departamento_id

LEFT JOIN sectores s 
    ON s.id = c.sector_id;