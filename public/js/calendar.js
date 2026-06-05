document.addEventListener("DOMContentLoaded", function () {

    window.fechaActiva =
        new Date().toISOString().split("T")[0];

    const calendarEl =
        document.getElementById("calendar");

    // =========================================
    // TODO TU CÓDIGO DE FESTIVOS SE MANTIENE IGUAL
    // =========================================
    function generarFestivosColombia(yearStart, yearEnd) {

        let festivos = [];

        function formatDate(date) {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, "0");
            const d = String(date.getDate()).padStart(2, "0");
            return `${y}-${m}-${d}`;
        }

        function addHoliday(title, date) {
            festivos.push({
                title,
                start: formatDate(date),
                allDay: true,
                color: "#b91c1c"
            });
        }

        function nextMonday(date) {
            const day = date.getDay();
            if (day !== 1) {
                const diff = (8 - day) % 7;
                date.setDate(date.getDate() + diff);
            }
            return date;
        }

        function easterDate(year) {
            const f = Math.floor;
            const G = year % 19;
            const C = f(year / 100);
            const H =
                (C - f(C / 4) -
                    f((8 * C + 13) / 25) +
                    19 * G + 15) % 30;

            const I =
                H - f(H / 28) *
                (1 - f(29 / (H + 1)) *
                    f((21 - G) / 11));

            const J =
                (year + f(year / 4) +
                    I + 2 - C + f(C / 4)) % 7;

            const L = I - J;

            const month =
                3 + f((L + 40) / 44);

            const day =
                L + 28 - 31 * f(month / 4);

            return new Date(year, month - 1, day);
        }

        for (let year = yearStart; year <= yearEnd; year++) {

            addHoliday("Año Nuevo", new Date(year, 0, 1));
            addHoliday("Día del Trabajo", new Date(year, 4, 1));
            addHoliday("20 de Julio", new Date(year, 6, 20));
            addHoliday("Batalla de Boyacá", new Date(year, 7, 7));
            addHoliday("Inmaculada Concepción", new Date(year, 11, 8));
            addHoliday("Navidad", new Date(year, 11, 25));

            addHoliday("Reyes Magos", nextMonday(new Date(year, 0, 6)));
            addHoliday("San José", nextMonday(new Date(year, 2, 19)));
            addHoliday("San Pedro y San Pablo", nextMonday(new Date(year, 5, 29)));
            addHoliday("Asunción", nextMonday(new Date(year, 7, 15)));
            addHoliday("Día de la Raza", nextMonday(new Date(year, 9, 12)));
            addHoliday("Todos los Santos", nextMonday(new Date(year, 10, 1)));
            addHoliday("Independencia Cartagena", nextMonday(new Date(year, 10, 11)));

            const easter = easterDate(year);

            const juevesSanto = new Date(easter);
            juevesSanto.setDate(easter.getDate() - 3);

            const viernesSanto = new Date(easter);
            viernesSanto.setDate(easter.getDate() - 2);

            addHoliday("Jueves Santo", juevesSanto);
            addHoliday("Viernes Santo", viernesSanto);

            const ascension = new Date(easter);
            ascension.setDate(easter.getDate() + 43);
            addHoliday("Ascensión", nextMonday(ascension));

            const corpus = new Date(easter);
            corpus.setDate(easter.getDate() + 64);
            addHoliday("Corpus Christi", nextMonday(corpus));

            const corazon = new Date(easter);
            corazon.setDate(easter.getDate() + 71);
            addHoliday("Sagrado Corazón", nextMonday(corazon));
        }

        return festivos;
    }

    const festivos =
        generarFestivosColombia(2026, 2040);

    function esSabado(fecha) {
        return new Date(fecha).getDay() === 6;
    }

    function esDomingo(fecha) {
        return new Date(fecha).getDay() === 0;
    }

    function esFestivo(fecha) {
        return festivos.some(f => f.start === fecha);
    }

    // =========================================
    // KPIS
    // =========================================
    function obtenerKPIsCalendario(fecha) {

        const tareas =
            Object.values(window.tareasCalendario || {})
                .flatMap(d => d.tareas || []);

        const seguimientos =
            tareas.filter(t =>
                t.fecha &&
                String(t.fecha).substring(0, 10) === fecha
            ).length;

        const cotizaciones =
            tareas.filter(t =>
                t.tipo === "COTIZACION" &&
                String(t.fecha).substring(0, 10) === fecha
            ).length;

        const pedidos =
            tareas.filter(t =>
                t.tipo === "PEDIDO" &&
                String(t.fecha).substring(0, 10) === fecha
            ).length;

        const pendientes =
            tareas.filter(t =>
                t.estado === "ACTIVO" &&
                String(t.fecha_proxima).substring(0, 10) === fecha
            ).length;

        return { seguimientos, cotizaciones, pedidos, pendientes };
    }

    const calendar =
        new FullCalendar.Calendar(calendarEl, {

            locale: "es",
            initialView: "dayGridMonth",

            height: "100%",
            expandRows: true,

            nowIndicator: true,
            allDayText: "",

            events: function (fetchInfo, successCallback) {

                const eventos = [...festivos];

                Object.keys(window.tareasCalendario || {}).forEach(fecha => {

                    const dataDia = window.tareasCalendario[fecha];
                    const total = Number(dataDia?.total || 0);

                    if (esDomingo(fecha) || esFestivo(fecha)) return;

                    let color = "#2563eb";

                    if (total >= 10) color = "#dc2626";
                    else if (total >= 5) color = "#d97706";
                    else if (total <= 0) color = "#16a34a";

                    eventos.push({
                        title: total > 0 ? `📌 ${total} pendientes` : `✔ Buen Trabajo`,
                        start: fecha,
                        allDay: true,
                        color
                    });
                });

                successCallback(eventos);
            },

            // =========================================
            // 🔥 AQUÍ ESTÁ EL CAMBIO IMPORTANTE
            // =========================================
            eventDidMount: function (info) {

                if (calendar.view.type !== "timeGridDay") return;

                const fecha = window.fechaActiva;
                const kpis = obtenerKPIsCalendario(fecha);

                const allDay =
                    document.querySelector(".fc-timegrid-axis-cushion");

                if (!allDay) return;

                // DOMINGO
                if (esDomingo(fecha)) {
                    allDay.innerHTML = "";
                    return;
                }

                // FESTIVO
                if (esFestivo(fecha)) return;

                const esSab = esSabado(fecha);

                // =========================================
                // 🟦 ALL DAY NUEVO DISEÑO
                // =========================================
                allDay.innerHTML = `
                    <div style="display:flex;flex-direction:column;gap:6px;font-size:11px;font-weight:600;padding:6px;">

                        <div style="display:flex;gap:6px;flex-wrap:wrap;">
                            <div style="background:#eef2ff;padding:6px;border-radius:8px;">📊 Pend: ${kpis.pendientes}</div>
                            <div style="background:#ecfdf5;padding:6px;border-radius:8px;">📞 Seg: ${kpis.seguimientos}</div>
                            <div style="background:#eff6ff;padding:6px;border-radius:8px;">📄 Cot: ${kpis.cotizaciones}</div>
                            <div style="background:#fff7ed;padding:6px;border-radius:8px;">📦 Ped: ${kpis.pedidos}</div>
                        </div>

                        <div style="margin-top:6px;">
                            ${esSab ? "📘 PLANEACIÓN" : ""}
                        </div>

                        <div style="margin-top:4px;">
                            📅 Eventos del día
                        </div>

                    </div>
                `;
            },

            datesSet: function () {

                setTimeout(() => {

                    const fechaActual =
                        calendar.getDate().toISOString().split("T")[0];

                    window.fechaActiva = fechaActual;

                }, 50);
            }
        });

    window.crmCalendar = calendar;
    calendar.render();

    const hoy = new Date().toISOString().split("T")[0];
    window.fechaActiva = hoy;

    calendar.changeView("timeGridDay");

});
