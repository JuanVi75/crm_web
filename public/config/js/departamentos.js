const API = "/config-api/departamentos";

document.addEventListener("DOMContentLoaded", () => {
    cargar();
});

async function cargar() {

    const res = await fetch(API);
    const data = await res.json();

    const tbody = document.getElementById("deptTableBody");

    tbody.innerHTML = data.data.map(d => `
        <tr>
            <td>${d.id}</td>
            <td>${d.depto}</td>
        </tr>
    `).join("");
}

async function crearDepartamento() {

    const id = document.getElementById("dep_id").value;
    const depto = document.getElementById("dep_name").value;

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, depto })
    });

    cargar();
}
