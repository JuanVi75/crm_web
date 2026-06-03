document.addEventListener("DOMContentLoaded", function () {

    window.fechaActiva = new Date().toISOString().split("T")[0];

    const calendarEl = document.getElementById("calendar");

    // =========================================
    // VALIDACIÓN CRÍTICA
    // =========================================
    if (!calendarEl) {
        console.error("❌ No existe #calendar en el DOM");
        return;
    }

    // =========================================
    // GENERAR FESTIVOS COLOMBIA
    // =========================================
    function generarFestivosColombia(yearStart, yearEnd) {

        let festivos = [];

        function formatDate(date) {

            const y = date.getFullYear();

            const m =
                String(date.getMonth() + 1).padStart(2, "0");

            const d =
                String(date.getDate()).padStart(2, "0");

            return `${y}-${m}-${d}`;
        }

        function addHoliday(title, date) {

            festivos.push({
                title: title,
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

            let juevesSanto = new Date(easter);
            juevesSanto.setDate(easter.getDate() - 3);

            let viernesSanto = new Date(easter);
            viernesSanto.setDate(easter.getDate() - 2);

            addHoliday("Jueves Santo", juevesSanto);
            addHoliday("Viernes Santo", viernesSanto);

            let ascension = new Date(easter);
            ascension.setDate(easter.getDate() + 43);
            addHoliday("Ascensión", nextMonday(ascension));

            let corpus = new Date(easter);
            corpus.setDate(easter.getDate() + 64);
            addHoliday("Corpus Christi", nextMonday(corpus));

            let corazon = new Date(easter);
            corazon.setDate(easter.getDate() + 71);
            addHoliday("Sagrado Corazón", nextMonday(corazon));
        }

        return festivos;
    }

    // =========================================
    // FESTIVOS GLOBAL
    // =========================================
    const festivos = generarFestivosColombia(2025, 2035);

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

        slotMinTime: "00:00:00",
        slotMaxTime: "24:00:00",
        scrollTime: "06:00:00",
        slotDuration: "00:30:00",

        slotLabelFormat: {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        },

        eventTimeFormat: {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        },

        nowIndicator: true,
        allDayText: "Todo el Día",

        // =========================================
        // EVENTS
        // =========================================
        events: function (fetchInfo, successCallback) {

            const eventos = [...festivos];

            if (
                !window.tareasCalendario ||
                typeof window.tareasCalendario !== "object"
            ) {
                successCallback(eventos);
                return;
            }

            Object.keys(window.tareasCalendario).forEach(fecha => {

                const dataDia = window.tareasCalendario[fecha];

                if (!dataDia || typeof dataDia !== "object") return;

                const total = Number(dataDia.total) || 0;

                if (total <= 0) return;

                let color = "#2563eb";

                if (total >= 10) color = "#dc2626";
                else if (total >= 5) color = "#d97706";

                eventos.push({
                    title: `📌 ${total} pendientes`,
                    start: fecha,
                    allDay: true,
                    color: color
                });
            });

            successCallback(eventos);
        },

        // =========================================
        // CLICK FECHA
        // =========================================
        dateClick: function (info) {

            const fecha = info.dateStr;

            window.fechaActiva = fecha;

            if (typeof cargarTareasPorFecha === "function") {
                cargarTareasPorFecha(fecha);
            }

            if (typeof cargarKPIs === "function") {
                cargarKPIs();
            }

            calendar.gotoDate(fecha);
        },

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

    window.addEventListener("resize", () => {
        calendar.updateSize();
    });

});
