document.addEventListener("DOMContentLoaded", function () {
    window.fechaActiva = new Date().toISOString().split("T")[0];

    const calendarEl =
        document.getElementById("calendar");

    // =========================================
    // GENERAR FESTIVOS COLOMBIA
    // =========================================
    function generarFestivosColombia(
        yearStart,
        yearEnd
    ) {

        let festivos = [];

        // =====================================
        // FORMAT DATE
        // =====================================
        function formatDate(date) {

            const y = date.getFullYear();

            const m =
                String(date.getMonth() + 1)
                    .padStart(2, "0");

            const d =
                String(date.getDate())
                    .padStart(2, "0");

            return `${y}-${m}-${d}`;
        }

        // =========================================
        // FESTIVOS
        // =========================================
        const festivos =
            generarFestivosColombia(
                2000,
                2050
            );

        // =====================================
        // ADD HOLIDAY
        // =====================================
        function addHoliday(title, date) {

            festivos.push({

                title: title,

                start: formatDate(date),

                allDay: true,

                color: "#b91c1c"
            });
        }

        // =====================================
        // NEXT MONDAY
        // =====================================
        function nextMonday(date) {

            const day = date.getDay();

            if (day !== 1) {

                const diff =
                    (8 - day) % 7;

                date.setDate(
                    date.getDate() + diff
                );
            }

            return date;
        }

        // =====================================
        // EASTER
        // =====================================
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
                L + 28 -
                31 * f(month / 4);

            return new Date(year, month - 1, day);
        }

        // =====================================
        // YEARS
        // =====================================
        for (let year = yearStart; year <= yearEnd; year++) {

            // FIJOS
            addHoliday(
                "Año Nuevo",
                new Date(year, 0, 1)
            );

            addHoliday(
                "Día del Trabajo",
                new Date(year, 4, 1)
            );

            addHoliday(
                "20 de Julio",
                new Date(year, 6, 20)
            );

            addHoliday(
                "Batalla de Boyacá",
                new Date(year, 7, 7)
            );

            addHoliday(
                "Inmaculada Concepción",
                new Date(year, 11, 8)
            );

            addHoliday(
                "Navidad",
                new Date(year, 11, 25)
            );

            // EMILIANI
            addHoliday(
                "Reyes Magos",
                nextMonday(
                    new Date(year, 0, 6)
                )
            );

            addHoliday(
                "San José",
                nextMonday(
                    new Date(year, 2, 19)
                )
            );

            addHoliday(
                "San Pedro y San Pablo",
                nextMonday(
                    new Date(year, 5, 29)
                )
            );

            addHoliday(
                "Asunción",
                nextMonday(
                    new Date(year, 7, 15)
                )
            );

            addHoliday(
                "Día de la Raza",
                nextMonday(
                    new Date(year, 9, 12)
                )
            );

            addHoliday(
                "Todos los Santos",
                nextMonday(
                    new Date(year, 10, 1)
                )
            );

            addHoliday(
                "Independencia Cartagena",
                nextMonday(
                    new Date(year, 10, 11)
                )
            );

            // PASCUA
            const easter =
                easterDate(year);

            const juevesSanto =
                new Date(easter);

            juevesSanto.setDate(
                easter.getDate() - 3
            );

            const viernesSanto =
                new Date(easter);

            viernesSanto.setDate(
                easter.getDate() - 2
            );

            addHoliday(
                "Jueves Santo",
                juevesSanto
            );

            addHoliday(
                "Viernes Santo",
                viernesSanto
            );

            // ASCENSION
            const ascension =
                new Date(easter);

            ascension.setDate(
                easter.getDate() + 43
            );

            addHoliday(
                "Ascensión",
                nextMonday(ascension)
            );

            // CORPUS
            const corpus =
                new Date(easter);

            corpus.setDate(
                easter.getDate() + 64
            );

            addHoliday(
                "Corpus Christi",
                nextMonday(corpus)
            );

            // CORAZON
            const corazon =
                new Date(easter);

            corazon.setDate(
                easter.getDate() + 71
            );

            addHoliday(
                "Sagrado Corazón",
                nextMonday(corazon)
            );
        }

        return festivos;
    }

    // =========================================
    // CALENDAR
    // =========================================
    const calendar =
        new FullCalendar.Calendar(calendarEl, {

            locale: "es",

            initialView: "dayGridMonth",

            // =====================================
            // ALTURA RESPONSIVE REAL
            // =====================================
            height: "100%",

            contentHeight: "100%",

            expandRows: true,

            stickyHeaderDates: true,

            handleWindowResize: true,

            // =====================================
            // SCROLL
            // =====================================
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

            // =====================================
            // TEXTOS
            // =====================================
            allDayText: "Todo el Día",

            // =====================================
            // EVENTS
            // =====================================
            events: function (fetchInfo, successCallback) {

                const eventos = [...festivos];

                // =================================
                // VALIDACIÓN SEGURA
                // =================================
                if (
                    !window.tareasCalendario ||
                    typeof window.tareasCalendario !== "object"
                ) {
                    successCallback(eventos);
                    return;
                }

                // =================================
                // TAREAS CRM
                // =================================
                Object.keys(window.tareasCalendario).forEach(fecha => {

                    const dataDia =
                        window.tareasCalendario[fecha];

                    if (
                        !dataDia ||
                        typeof dataDia !== "object"
                    ) {
                        return;
                    }

                    const total =
                        Number(dataDia.total) || 0;

                    // =========================
                    // SOLO SI HAY PENDIENTES
                    // =========================
                    if (total <= 0) {
                        return;
                    }

                    // =========================
                    // COLOR SEGUN CANTIDAD
                    // =========================
                    let color = "#2563eb";

                    if (total >= 10) {
                        color = "#dc2626";
                    } else if (total >= 5) {
                        color = "#d97706";
                    }

                    // =========================
                    // EVENTO
                    // =========================
                    eventos.push({

                        title: `📌 ${total} pendientes`,
                        start: fecha,
                        allDay: true,
                        color: color
                    });
                });

                successCallback(eventos);
            },

            // =====================================
            // CLICK FECHA
            // =====================================
            dateClick: function (info) {

                const fecha = info.dateStr;

                // =================================
                // GUARDAR FECHA GLOBAL
                // =================================
                window.fechaActiva = fecha;

                // =================================
                // TAREAS DEL DÍA
                // =================================
                if (typeof cargarTareasPorFecha === "function") {
                    cargarTareasPorFecha(fecha);
                }

                // =================================
                // KPI (forzar sincronización)
                // =================================
                if (typeof cargarKPIs === "function") {
                    cargarKPIs(fecha);
                }

                // =================================
                // FORZAR CONSISTENCIA VISUAL (IMPORTANTE)
                // =================================
                const calendar = window.crmCalendar;

                if (calendar) {
                    calendar.gotoDate(fecha);
                }
            },

            // =====================================
            // EVENTOS CRM
            // =====================================
            eventDidMount: function (info) {

                // FESTIVOS
                if (info.event.backgroundColor === "#b91c1c") {

                    info.el.style.fontSize = "10px";

                    return;
                }

                // =================================
                // EVENTOS CRM
                // =================================
                info.el.style.border = "none";

                info.el.style.padding = "2px 4px";

                info.el.style.fontSize = "11px";

                info.el.style.fontWeight = "600";

                info.el.style.borderRadius = "6px";
            },

            // =====================================
            // HEADER
            // =====================================
            headerToolbar: {

                left:
                    "prev,next today customYearPicker",

                center: "title",

                right:
                    "dayGridMonth,timeGridDay"
            },

            // =====================================
            // BUTTONS
            // =====================================
            buttonText: {

                today: "Hoy",

                month: "Mes",

                day: "Día"
            },

            // =====================================
            // YEAR PICKER
            // =====================================
            customButtons: {

                customYearPicker: {

                    text: "Año",

                    click: function () {

                        const year =
                            prompt(
                                "Ingrese el año:",
                                new Date().getFullYear()
                            );

                        if (year) {

                            calendar.gotoDate(
                                year + "-01-01"
                            );
                        }
                    }
                }
            },

            // =====================================
            // MES COLORES
            // =====================================
             // =====================================
            // MES COLORES
            // =====================================
            dayCellDidMount: function (info) {

                if (
                    calendar.view.type !==
                    "dayGridMonth"
                ) {
                    return;
                }

                const date =
                    info.date;

                const day =
                    date.getDay();

                const today =
                    new Date();

                const dateStr =
                    date.toISOString()
                        .split("T")[0];

                const isHoliday =
                    festivos.some(
                        f => f.start === dateStr
                    );

                // DOMINGO
                if (day === 0) {

                    info.el.style.background =
                        "#7f1d1d";

                    info.el.style.color =
                        "#fff";
                }

                // SABADO
                if (day === 6) {

                    info.el.style.background =
                        "#1e3a8a";

                    info.el.style.color =
                        "#fff";
                }

                // FESTIVO
                if (isHoliday) {

                    info.el.style.background =
                        "#b91c1c";

                    info.el.style.color =
                        "#fff";
                }

                // HOY
                if (
                    date.toDateString() ===
                    today.toDateString()
                ) {

                    info.el.style.background =
                        "#facc15";

                    info.el.style.color =
                        "#000";
                }
            },

            // =====================================
            // VISTAS
            // =====================================
            datesSet: function () {

                setTimeout(() => {

                    // HEADERS
                    document.querySelectorAll(
                        ".fc-col-header-cell"
                    ).forEach(header => {

                        header.style.background =
                            "white";

                        header.style.color =
                            "#111827";

                        header.style.fontWeight =
                            "600";
                    });

                    // =================================
                    // SCROLL INTERNO REAL
                    // =================================
                    document.querySelectorAll(
                        ".fc-scroller"
                    ).forEach(scroller => {

                        scroller.style.overflowY =
                            "auto";

                        scroller.style.overflowX =
                            "hidden";

                        scroller.style.maxHeight =
                            "100%";
                    });

                    // =================================
                    // DIA
                    // =================================
                    if (

                        calendar.view.type ===
                        "timeGridDay"
                    ) {

                        document.querySelectorAll(
                            ".fc-col-header-cell"
                        ).forEach(header => {

                            if (
                                header.classList.contains(
                                    "fc-day-today"
                                )
                            ) {

                                header.style.background =
                                    "#facc15";

                                header.style.color =
                                    "#000";
                            }

                        });
                    }

                }, 50);

            }

        });

    // =========================================
    // GLOBAL
    // =========================================
    window.crmCalendar = calendar;

    // =========================================
    // RENDER
    // =========================================
    calendar.render();

    const hoy = new Date().toISOString().split("T")[0];

    window.fechaActiva = hoy;

    calendar.changeView("timeGridDay");

    cargarTareasPorFecha(hoy);

    // =========================================
    // RESIZE
    // =========================================
    window.addEventListener(
        "resize",
        () => {

            calendar.updateSize();
        }
    );

});
