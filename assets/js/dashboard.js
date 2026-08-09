/* =====================================================
   PLAZA DAYEUHLUHUR
   DASHBOARD DATA ENGINE V1
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("Dashboard Plaza Dayeuhluhur aktif.");

    loadDashboardData();
    setupMobileMenu();

});


/* =====================================================
   LOAD SEMUA DATA
===================================================== */

async function loadDashboardData() {

    const files = {

        desa: "data/desa.json",

        bumdes: "data/bumdes.json",

        umkm: "data/umkm.json",

        bisnis: "data/bisnis.json",

        bursa: "data/bursa.json",

        wisata: "data/wisata.json",

        berita: "data/berita.json",

        agenda: "data/agenda.json"

    };


    try {

        const results = await Promise.all(

            Object.entries(files).map(
                async ([key, url]) => {

                    const response = await fetch(url);

                    if (!response.ok) {

                        throw new Error(
                            `Gagal mengambil ${url}`
                        );

                    }

                    const data = await response.json();

                    return [key, data];

                }
            )

        );


        const data = Object.fromEntries(results);


        console.log("Data dashboard berhasil dimuat:", data);


        /* Statistik */

        updateStatistics(data);


        /* Aktivitas */

        updateActivities(data);


    }

    catch (error) {

        console.error(
            "Gagal memuat data dashboard:",
            error
        );

        showDataError();

    }

}


/* =====================================================
   UPDATE STATISTIK
===================================================== */

function updateStatistics(data) {

    setValue(
        "statDesa",
        data.desa.length
    );


    setValue(
        "statBumdes",
        data.bumdes.length
    );


    setValue(
        "statUmkm",
        data.umkm.length
    );


    setValue(
        "statBisnis",
        data.bisnis.length
    );


    setValue(
        "statBursa",
        data.bursa.length
    );


    setValue(
        "statWisata",
        data.wisata.length
    );


    setValue(
        "statBerita",
        data.berita.length
    );


    setValue(
        "statAgenda",
        data.agenda.length
    );

}


/* =====================================================
   HELPER SET VALUE
===================================================== */

function setValue(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent = value;

    }

}


/* =====================================================
   AKTIVITAS TERBARU
===================================================== */

function updateActivities(data) {

    const container =
        document.getElementById(
            "activityList"
        );


    if (!container) return;


    const activities = [];


    /* Berita */

    data.berita
        .slice(0, 3)
        .forEach(item => {

            activities.push({

                icon: "fa-newspaper",

                title: item.judul,

                info:
                    `${item.kategori || "Berita"} • ${item.tanggal || ""}`

            });

        });


    /* Agenda */

    data.agenda
        .slice(0, 3)
        .forEach(item => {

            activities.push({

                icon: "fa-calendar-days",

                title: item.judul,

                info:
                    `${item.kategori || "Agenda"} • ${item.tanggal || ""}`

            });

        });


    /* UMKM */

    data.umkm
        .slice(0, 2)
        .forEach(item => {

            activities.push({

                icon: "fa-store",

                title:
                    `${item.nama} terdaftar sebagai UMKM`,

                info:
                    `${item.kategori || "UMKM"} • ${item.desa || ""}`

            });

        });


    /* Maksimal 7 aktivitas */

    const latest =
        activities.slice(0, 7);


    if (!latest.length) {

        container.innerHTML = `

            <div class="loading-state">

                Belum ada aktivitas.

            </div>

        `;

        return;

    }


    container.innerHTML =
        latest.map(item => `

            <div class="activity-item">

                <div class="activity-icon">

                    <i class="fa-solid ${item.icon}"></i>

                </div>

                <div class="activity-content">

                    <strong>
                        ${escapeHtml(item.title)}
                    </strong>

                    <span>
                        ${escapeHtml(item.info)}
                    </span>

                </div>

            </div>

        `).join("");

}


/* =====================================================
   ERROR DATA
===================================================== */

function showDataError() {

    const container =
        document.getElementById(
            "activityList"
        );


    if (!container) return;


    container.innerHTML = `

        <div class="loading-state">

            <i class="fa-solid fa-triangle-exclamation"></i>

            Data belum dapat dimuat.

        </div>

    `;

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(value) {

    return String(value ?? "")

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =====================================================
   MOBILE SIDEBAR
===================================================== */

function setupMobileMenu() {

    const button =
        document.getElementById(
            "mobileMenuBtn"
        );


    const sidebar =
        document.getElementById(
            "sidebar"
        );


    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );


    if (
        !button ||
        !sidebar ||
        !overlay
    ) {

        return;

    }


    button.addEventListener(
        "click",
        () => {

            sidebar.classList.add("show");

            overlay.classList.add("show");

        }
    );


    overlay.addEventListener(
        "click",
        () => {

            sidebar.classList.remove("show");

            overlay.classList.remove("show");

        }
    );


    document
        .querySelectorAll(".menu-item")
        .forEach(item => {

            item.addEventListener(
                "click",
                () => {

                    sidebar.classList.remove("show");

                    overlay.classList.remove("show");

                }
            );

        });

}