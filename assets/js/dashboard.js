/* =====================================================
PLAZA DAYEUHLUHUR
DASHBOARD DATA ENGINE V2
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

```
console.log("====================================");
console.log("PLAZA DAYEUHLUHUR");
console.log("Dashboard Data Engine V2 aktif");
console.log("====================================");

loadAdminProfile();
loadDashboardData();
setupMobileMenu();
setupLogout();
```

});

/* =====================================================
LOAD SEMUA DATA
===================================================== */

async function loadDashboardData() {

```
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


const data = {};


console.log("Mulai membaca database JSON...");


/*
   LOAD DATA SATU PER SATU
*/

for (const [key, url] of Object.entries(files)) {

    try {

        console.log(`Membaca ${key}: ${url}`);


        const response = await fetch(
            url,
            {
                cache: "no-store"
            }
        );


        /*
           CEK HTTP
        */

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status} - ${response.statusText}`
            );

        }


        /*
           BACA SEBAGAI TEXT TERLEBIH DAHULU

           Ini sengaja dilakukan agar kita bisa
           mengetahui apabila server mengembalikan
           HTML/error page.
        */

        const text = await response.text();


        if (!text.trim()) {

            throw new Error(
                "File kosong"
            );

        }


        /*
           PARSE JSON
        */

        let json;

        try {

            json = JSON.parse(text);

        }

        catch (jsonError) {

            console.error(
                `Isi ${url} bukan JSON valid:`,
                text.substring(0, 200)
            );

            throw new Error(
                "Isi file bukan JSON valid"
            );

        }


        /*
           NORMALISASI DATA

           Mendukung:

           1. Array langsung
           2. Object { data: [] }
           3. Object { items: [] }
        */

        let arrayData;


        if (Array.isArray(json)) {

            arrayData = json;

        }

        else if (
            json &&
            Array.isArray(json.data)
        ) {

            arrayData = json.data;

        }

        else if (
            json &&
            Array.isArray(json.items)
        ) {

            arrayData = json.items;

        }

        else {

            throw new Error(
                "Format JSON tidak dikenali"
            );

        }


        data[key] = arrayData;


        console.log(
            `✓ ${key}: ${arrayData.length} data`
        );

    }


    catch (error) {

        console.error(
            `✗ GAGAL ${key}:`,
            error
        );


        /*
           Tetap gunakan array kosong
           supaya dashboard lainnya
           tetap berjalan.
        */

        data[key] = [];

    }

}


console.log("====================================");
console.log("HASIL DATA DASHBOARD");
console.log(data);
console.log("====================================");


/*
   UPDATE STATISTIK
*/

updateStatistics(data);


/*
   UPDATE AKTIVITAS
*/

updateActivities(data);


/*
   UPDATE STATUS DATA
*/

updateSystemStatus(data);
```

}

/* =====================================================
UPDATE STATISTIK
===================================================== */

function updateStatistics(data) {

```
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
```

}

/* =====================================================
HELPER SET VALUE
===================================================== */

function setValue(id, value) {

```
const element =
    document.getElementById(id);


if (element) {

    element.textContent = value;

}
```

}

/* =====================================================
UPDATE STATUS EKOSISTEM
===================================================== */

function updateSystemStatus(data) {

```
setValue(
    "statusDesa",
    `${data.desa.length} DATA`
);


setValue(
    "statusBumdes",
    `${data.bumdes.length} DATA`
);


setValue(
    "statusUmkm",
    `${data.umkm.length} DATA`
);


setValue(
    "statusBisnis",
    `${data.bisnis.length} DATA`
);


setValue(
    "statusBursa",
    `${data.bursa.length} DATA`
);


setValue(
    "statusWisata",
    `${data.wisata.length} DATA`
);


setValue(
    "statusBerita",
    `${data.berita.length} DATA`
);


setValue(
    "statusAgenda",
    `${data.agenda.length} DATA`
);
```

}

/* =====================================================
AKTIVITAS TERBARU
===================================================== */

function updateActivities(data) {

```
const container =
    document.getElementById(
        "activityList"
    );


if (!container) return;


const activities = [];


/*
   BERITA
*/

data.berita
    .slice(0, 3)
    .forEach(item => {

        activities.push({

            icon: "fa-newspaper",

            title:
                item.judul ||
                item.nama ||
                "Berita baru",

            info:
                `${item.kategori || "Berita"} • ${item.tanggal || ""}`

        });

    });


/*
   AGENDA
*/

data.agenda
    .slice(0, 3)
    .forEach(item => {

        activities.push({

            icon: "fa-calendar-days",

            title:
                item.judul ||
                item.nama ||
                "Agenda baru",

            info:
                `${item.kategori || "Agenda"} • ${item.tanggal || ""}`

        });

    });


/*
   UMKM
*/

data.umkm
    .slice(0, 2)
    .forEach(item => {

        activities.push({

            icon: "fa-store",

            title:
                `${item.nama || "UMKM baru"} terdaftar`,

            info:
                `${item.kategori || "UMKM"} • ${item.desa || ""}`

        });

    });


/*
   BUMDES
*/

data.bumdes
    .slice(0, 2)
    .forEach(item => {

        activities.push({

            icon: "fa-building",

            title:
                `${item.nama || "BUMDes baru"} terdaftar`,

            info:
                `BUMDes • ${item.desa || ""}`

        });

    });


/*
   DESA
*/

data.desa
    .slice(0, 2)
    .forEach(item => {

        activities.push({

            icon: "fa-house",

            title:
                item.nama ||
                item.nama_desa ||
                "Desa",

            info:
                "Data Desa"

        });

    });


/*
   MAKSIMAL 7 AKTIVITAS
*/

const latest =
    activities.slice(0, 7);


if (!latest.length) {

    container.innerHTML = `

        <div class="loading-state">

            <i class="fa-solid fa-circle-info"></i>

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
```

}

/* =====================================================
ESCAPE HTML
===================================================== */

function escapeHtml(value) {

```
return String(value ?? "")

    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;")

    .replace(/'/g, "&#039;");
```

}

/* =====================================================
LOAD ADMIN PROFILE
===================================================== */

function loadAdminProfile() {

```
const adminName =
    sessionStorage.getItem(
        "plazaAdminName"
    );


if (!adminName) return;


const profileName =
    document.querySelector(
        ".profile-info strong"
    );


if (profileName) {

    profileName.textContent =
        adminName;

}
```

}

/* =====================================================
MOBILE SIDEBAR
===================================================== */

function setupMobileMenu() {

```
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
```

}

/* =====================================================
LOGOUT ADMIN
===================================================== */

function setupLogout() {

```
const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (!logoutButton) return;


logoutButton.addEventListener(
    "click",
    (event) => {

        event.preventDefault();


        sessionStorage.removeItem(
            "plazaAdminLogin"
        );


        sessionStorage.removeItem(
            "plazaAdminName"
        );


        window.location.href =
            "login.html";

    }
);
```

}
