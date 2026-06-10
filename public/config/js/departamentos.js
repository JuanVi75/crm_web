const API = "/departamentos";

async function cargar() {
    const res = await fetch(API);
    const data = await res.json();

    document.getElementById("tbody").innerHTML =
        data.map(d => `
            <tr>
                <td>${d.id}</td>
                <td>${d.depto}</td>
            </tr>
        `).join("");
}

async function guardar() {

    const id = document.getElementById("id").value;
    const depto = document.getElementById("depto").value;

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, depto })
    });

    document.getElementById("id").value = "";
    document.getElementById("depto").value = "";

    cargar();
}

cargar();
