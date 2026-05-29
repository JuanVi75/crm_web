window.token = localStorage.getItem("token");
window.rol = localStorage.getItem("rol");
window.user = localStorage.getItem("user");

const API = "/api/clientes";

let clientes = [];

let ciudadSeleccionada = {
    id: null,
    departamento_id: null
};

let sectorSeleccionado = {
    id: null
};

// =========================================
// INIT
// =========================================
window.onload = () => {

    validarSesion();

    configurarVistaPorRol();

    cargarClientes();

    eventosFiltros();

    eventosAutocomplete();
};

// =========================================
// VALIDAR LOGIN
// =========================================
function validarSesion(){

    if(!token){

        window.location.href = "index.html";
        return;
    }

    document.getElementById("userInfo").innerHTML =
    `
        Bienvenido<br>
        ${user}<br>
        ${rol}
    `;
}

// =========================================
// VISTA POR ROL
// =========================================
function configurarVistaPorRol(){

    if(rol === "ASESOR"){

        document
        .getElementById("asesorFieldWrap")
        .style.display = "none";

        document
        .getElementById("asesorFilterWrap")
        .style.display = "none";
    }
}

// =========================================
// HEADERS
// =========================================
function authHeaders(){

    return {
        "Content-Type":"application/json",
        "Authorization":"Bearer " + token
    };
}

// =========================================
// CARGAR CLIENTES
// =========================================
let page = 1;
const limit = 100;

function cargarClientes(){

    fetch(`${API}?page=${page}&limit=${limit}`, {
        headers: authHeaders()
    })

    .then(r => r.json())

    .then(data => {

        clientes = data || [];

        renderTabla(clientes);

        actualizarPaginaUI();
    })

    .catch(err => {

        console.error(err);

        alert("Error cargando clientes");
    });
}

window.cambiarPagina = function(valor){

    page += valor;

    if(page < 1) page = 1;

    cargarClientes();
}

function actualizarPaginaUI(){

    const el = document.getElementById("pageInfo");

    if(el){
        el.innerText = "Página " + page;
    }
}


// =========================================
// RENDER TABLA
// =========================================
function renderTabla(data){

    const tbody =
    document.getElementById("clientesBody");

    tbody.innerHTML = "";

    if(!data.length){

        tbody.innerHTML =
        `
            <tr>
                <td colspan="7">
                    No hay clientes para mostrar
                </td>
            </tr>
        `;

        return;
    }

    data.forEach(cliente => {

        const tr = document.createElement("tr");

        tr.innerHTML =
        `
            <td>${cliente.id || ""}</td>
            <td>${cliente.cliente || ""}</td>
            <td>${cliente.ciudad || ""}</td>
            <td>${cliente.email || ""}</td>
            <td>${cliente.sector || ""}</td>
            <td>${cliente.contacto || ""}</td>
            <td>${cliente.tel_contacto || ""}</td>
        `;

        tr.onclick = () => toggleDetail(cliente.id);

        tbody.appendChild(tr);

        // DETAIL ROW
        const detail = document.createElement("tr");

        detail.id = "detail-" + cliente.id;

        detail.className = "detail-row";

        detail.innerHTML =
        `
            <td colspan="7">

                <div class="detail-box">

                    <div class="detail-item">
                        <div class="detail-label">
                            Dirección
                        </div>

                        <div class="detail-value">
                            ${cliente.direccion || ""}
                        </div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-label">
                            Teléfono
                        </div>

                        <div class="detail-value">
                            ${cliente.telefono || ""}
                        </div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-label">
                            Departamento
                        </div>

                        <div class="detail-value">
                            ${cliente.departamento || ""}
                        </div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-label">
                            Asesor
                        </div>

                        <div class="detail-value">
                            ${cliente.asesor || ""}
                        </div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-label">
                            Maneja Sucursales
                        </div>

                        <div class="detail-value">
                            ${cliente.maneja_sucursales || ""}
                        </div>
                    </div>

                    <div class="detail-item">

                        <button
                            class="load-btn"
                            onclick='cargarFormulario(${JSON.stringify(cliente)})'
                        >
                            CARGAR
                        </button>

                    </div>

                </div>

            </td>
        `;

        tbody.appendChild(detail);
    });
}

// =========================================
// TOGGLE DETAIL
// =========================================
function toggleDetail(id){

    const row =
    document.getElementById("detail-" + id);

    if(row.style.display === "table-row"){

        row.style.display = "none";

    }else{

        row.style.display = "table-row";
    }
}

// =========================================
// CARGAR FORM
// =========================================
function cargarFormulario(c){

    document.getElementById("id").value = c.id || "";
    document.getElementById("cliente").value = c.cliente || "";
    document.getElementById("direccion").value = c.direccion || "";
    document.getElementById("telefono").value = c.telefono || "";
    document.getElementById("ciudad").value = c.ciudad || "";
    document.getElementById("departamento").value = c.departamento || "";
    document.getElementById("email").value = c.email || "";
    document.getElementById("sector").value = c.sector || "";
    document.getElementById("contacto").value = c.contacto || "";
    document.getElementById("tel_contacto").value = c.tel_contacto || "";

    if(document.getElementById("asesor")){
        document.getElementById("asesor").value = c.asesor || "";
    }

    document.getElementById("maneja_sucursales").value =
    c.maneja_sucursales || "NO";
}

// =========================================
// GUARDAR
// =========================================
function guardarCliente(){

    const body = construirBody();

    fetch(API, {

        method:"POST",

        headers: authHeaders(),

        body: JSON.stringify(body)
    })

    .then(r => r.json())

    .then(data => {

        alert(data.message);

        limpiarFormulario();

        cargarClientes();
    })

    .catch(err => {

        console.error(err);

        alert("Error guardando");
    });
}

// =========================================
// MODIFICAR
// =========================================
function modificarCliente(){

    const id =
    document.getElementById("id").value;

    if(!id){

        alert("Seleccione cliente");
        return;
    }

    fetch(API + "/" + id, {

        method:"PUT",

        headers: authHeaders(),

        body: JSON.stringify(construirBody())
    })

    .then(r => r.json())

    .then(data => {

        alert(data.message);

        cargarClientes();
    })

    .catch(err => {

        console.error(err);

        alert("Error modificando");
    });
}

// =========================================
// ELIMINAR
// =========================================
function eliminarCliente(){

    const id =
    document.getElementById("id").value;

    if(!id){

        alert("Seleccione cliente");
        return;
    }

    if(!confirm("Eliminar cliente?")) return;

    fetch(API + "/" + id, {

        method:"DELETE",

        headers: authHeaders()
    })

    .then(r => r.json())

    .then(data => {

        alert(data.message);

        limpiarFormulario();

        cargarClientes();
    })

    .catch(err => {

        console.error(err);

        alert("Error eliminando");
    });
}

// =========================================
// BODY
// =========================================
function construirBody(){

    return {

        id:
        document.getElementById("id").value,

        cliente:
        document.getElementById("cliente").value,

        direccion:
        document.getElementById("direccion").value,

        telefono:
        document.getElementById("telefono").value,

        ciudad:
        document.getElementById("ciudad").value,

        departamento:
        document.getElementById("departamento").value,

        ciudad_id:
        ciudadSeleccionada.id,

        departamento_id:
        ciudadSeleccionada.departamento_id,

        email:
        document.getElementById("email").value,

        sector:
        document.getElementById("sector").value,

        sector_id:
        sectorSeleccionado.id,

        contacto:
        document.getElementById("contacto").value,

        tel_contacto:
        document.getElementById("tel_contacto").value,

        asesor:
        rol === "ASESOR"
            ? user
            : document.getElementById("asesor").value,

        maneja_sucursales:
        document.getElementById("maneja_sucursales").value
    };
}

// =========================================
// LIMPIAR
// =========================================
function limpiarFormulario(){

    document
    .querySelectorAll("input")
    .forEach(i => i.value = "");

    ciudadSeleccionada = {
        id:null,
        departamento_id:null
    };

    sectorSeleccionado = {
        id:null
    };
}

// =========================================
// AUTOCOMPLETE
// =========================================
function eventosAutocomplete(){

    const ciudadInput =
    document.getElementById("ciudad");

    const ciudadList =
    document.getElementById("ciudadList");

    ciudadInput.addEventListener("keyup", async () => {

        const q = ciudadInput.value;

        if(q.length < 1){

            ciudadList.style.display = "none";
            return;
        }

        const r =
        await fetch(
            "/api/catalogo/ciudades?q=" + q
        );

        const data = await r.json();

        ciudadList.innerHTML = "";

        data.forEach(c => {

            const item =
            document.createElement("div");

            item.className =
            "autocomplete-item";

            item.innerHTML =
            `${c.municipio} - ${c.depto}`;

            item.onclick = () => {

                ciudadInput.value =
                c.municipio;

                document
                .getElementById("departamento")
                .value = c.depto;

                ciudadSeleccionada = {

                    id:c.id,

                    departamento_id:c.id_depto
                };

                ciudadList.style.display = "none";
            };

            ciudadList.appendChild(item);
        });

        ciudadList.style.display = "block";
    });

    // =====================================
    // SECTOR
    // =====================================
    const sectorInput =
    document.getElementById("sector");

    const sectorList =
    document.getElementById("sectorList");

    sectorInput.addEventListener("keyup", async () => {

        const q = sectorInput.value;

        if(q.length < 1){

            sectorList.style.display = "none";
            return;
        }

        const r =
        await fetch(
            "/api/catalogo/sectores?q=" + q
        );

        const data = await r.json();

        sectorList.innerHTML = "";

        data.forEach(s => {

            const item =
            document.createElement("div");

            item.className =
            "autocomplete-item";

            item.innerHTML =
            `${s.subcategoria}`;

            item.onclick = () => {

                sectorInput.value =
                s.subcategoria;

                sectorSeleccionado = {
                    id:s.id
                };

                sectorList.style.display = "none";
            };

            sectorList.appendChild(item);
        });

        sectorList.style.display = "block";
    });
}

// =========================================
// FILTROS
// =========================================
function eventosFiltros(){

    [
        "filterCiudad",
        "filterSector",
        "filterAsesor",
        "filterCliente"
    ]

    .forEach(id => {

        const el =
        document.getElementById(id);

        if(!el) return;

        el.addEventListener("keyup", filtrar);
    });
}

// =========================================
// FILTRAR
// =========================================
function filtrar(){

    const ciudad =
    (document.getElementById("filterCiudad")?.value || "")
    .toLowerCase();

    const sector =
    (document.getElementById("filterSector")?.value || "")
    .toLowerCase();

    const asesor =
    (document.getElementById("filterAsesor")?.value || "")
    .toLowerCase();

    const cliente =
    (document.getElementById("filterCliente")?.value || "")
    .toLowerCase();

    const filtrados = clientes.filter(c => {

        return (c.ciudad || "")
        .toLowerCase()
        .includes(ciudad)

        && (c.sector || "")
        .toLowerCase()
        .includes(sector)

        && (c.asesor || "")
        .toLowerCase()
        .includes(asesor)

        && (c.cliente || "")
        .toLowerCase()
        .includes(cliente);
    });

    renderTabla(filtrados);
}