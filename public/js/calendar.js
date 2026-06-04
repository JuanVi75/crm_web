document.addEventListener("DOMContentLoaded", function () {

    window.fechaActiva = new Date().toISOString().split("T")[0];

    const calendarEl = document.getElementById("calendar");

    // =========================================
    // GENERAR FESTIVOS COLOMBIA
    // =========================================
    function generarFestivosColombia(yearStart, yearEnd) {

        const festivos = [];

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

            const month = 3 + f((L + 40) / 44);
            const day = L + 28 - 31 * f(month / 4);

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

    // 🔥 GLOBAL FESTIVOS
    const festivos = generarFestivosColombia(2000, 2050);

    // =========================================
    // CALENDAR
    // =========================================
    const calendar = new FullCalendar.Calendar(calendarEl, {

        locale: "es",
        initialView: "dayGridMonth",
        height: "100%",
        contentHeight: "100%",
        expandRows: true,
        stickyHeaderDates: true,
        handleWindowResize: true,

        allDayText: "Todo el Día",

        // =========================================
        // EVENTS
        // =========================================
        events: function (fetchInfo, successCallback) {

            const eventos = [...festivos];

            const data = window.tareasCalendario || {};

            Object.keys(data).forEach(fecha => {

                const dia = data[fecha];
                if (!dia) return;

                const total = Number(dia.total) || 0;

                let color = "#2563eb";
                if (total >= 10) color = "#dc2626";
                else if (total >= 5) color = "#d97706";

                eventos.push({
                    title: total > 0 ? `📌 ${total} pendientes` : `✔ Sin tareas`,
                    start: fecha,
                    allDay: true,
                    color: total > 0 ? color : "#6b7280"
                });
            });

            successCallback(eventos);
        },

        // =========================================
        // CLICK
        // =========================================
        dateClick: function (info) {

            const fecha = info.dateStr;
            window.fechaActiva = fecha;

            if (typeof cargarTareasPorFecha === "function") {
                cargarTareasPorFecha(fecha);
            }

            if (typeof cargarKPIs === "function") {
                cargarKPIs(fecha);
            }

            if (window.crmCalendar) {
                window.crmCalendar.gotoDate(fecha);
            }
        },

        // =========================================
        // HEADER
        // =========================================
        headerToolbar: {
            left: "prev,next today customYearPicker",
            center: "title",
            right: "dayGridMonth,timeGridDay"
        },

        buttonText: {
            today: "Hoy",
            month: "Mes",
            day: "Día"
        },

        customButtons: {
            customYearPicker: {
                text: "Año",
                click: function () {
                    const year = prompt("Ingrese el año:", new Date().getFullYear());
                    if (year) calendar.gotoDate(year + "-01-01");
                }
            }
        },

        // =========================================
        // VISUAL FIX
        // =========================================
        eventDidMount: function (info) {

            if (info.event.backgroundColor === "#b91c1c") {
                info.el.style.fontSize = "10px";
                return;
            }

            info.el.style.border = "none";
            info.el.style.padding = "2px 4px";
            info.el.style.fontSize = "11px";
            info.el.style.fontWeight = "600";
            info.el.style.borderRadius = "6px";
        },

        // =========================================
        // DAYS STYLE
        // =========================================
        dayCellDidMount: function (info) {

            const dateStr = info.date.toISOString().split("T")[0];
            const isHoliday = festivos.some(f => f.start === dateStr);

            if (info.date.getDay() === 0) info.el.style.background = "#7f1d1d";
            if (info.date.getDay() === 6) info.el.style.background = "#1e3a8a";
            if (isHoliday) info.el.style.background = "#b91c1c";

            if (info.date.toDateString() === new Date().toDateString()) {
                info.el.style.background = "#facc15";
                info.el.style.color = "#000";
            }
        }
    });

    window.crmCalendar = calendar;

    calendar.render();

    const hoy = new Date().toISOString().split("T")[0];

    window.fechaActiva = hoy;

    calendar.changeView("timeGridDay");

    if (typeof cargarTareasPorFecha === "function") {
        cargarTareasPorFecha(hoy);
    }

    window.addEventListener("resize", () => calendar.updateSize());
});
