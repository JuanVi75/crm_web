const API = "/api/departamentos";

/* =========================
   CARGAR AL INICIAR
========================= */
document.addEventListener("DOMContentLoaded", () => {
    cargarDepartamentos();
});

/* =========================
   LISTAR
========================= */
async function cargarDepartamentos() {

    try {

        const res = await fetch(API);
        const data = await res.json();

        const rows = data.data || [];

        const tbody = document.getElementById("deptTableBody");

        if (!tbody) return;

        tbody.innerHTML = rows.map(d => `
            <tr>
                <td>${d.id || ""}</td>
                <td>${d.depto || ""}</td>
                <td>
                    <button onclick="eliminarDepto('${d.id}')">Eliminar</button>
                </td>
            </tr>
        `).join("");

    } catch (err) {
        console.error("Error cargando departamentos:", err);
    }
}

/* =========================
   CREAR
========================= */
async function crearDepartamento() {

    const id = document.getElementById("dep_id").value;
    const depto = document.getElementById("dep_name").value;

    if (!id || !depto) {
        alert("Completa los campos");
        return;
    }

    try {

        const res = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id, depto })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Error");
            return;
        }

        document.getElementById("dep_id").value = "";
        document.getElementById("dep_name").value = "";

        cargarDepartamentos();

    } catch (err) {
        console.error("Error creando departamento:", err);
    }
}

/* =========================
   ELIMINAR (UI LISTO, BACKEND DESPUÉS)
========================= */
function eliminarDepto(id) {
    alert("Eliminar ID: " + id + " (pendiente backend DELETE)");
}
