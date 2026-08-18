/* =========================================================
   PLAZA DAYEUHLUHUR
   PRODUK ADMIN
   PRODUK-ADMIN.JS V2 FINAL
   ---------------------------------------------------------
   Fitur:
   1. Membaca data/produk.json
   2. Membaca produk tambahan dari localStorage
   3. Statistik produk
   4. Tambah produk
   5. Preview gambar
   6. Daftar produk
   7. Hapus produk tambahan
   8. Aktivasi / nonaktif produk tambahan
   9. Notifikasi premium
   10. Aktivitas dashboard
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("PRODUK ADMIN V2 FINAL");
    console.log("====================================");

    initProduk();

});


/* =========================================================
   KONFIGURASI
========================================================= */

const PRODUK_JSON =
    "data/produk.json";

const PRODUK_STORAGE =
    "plazaProduk";


/* =========================================================
   INIT
========================================================= */

async function initProduk() {

    initFormSubmit();

    initPreview();

    initReset();

    await loadProduk();

}


/* =========================================================
   LOAD DATA PRODUK
========================================================= */

async function loadProduk() {

    let jsonProduk = [];

    try {

        const response =
            await fetch(
                PRODUK_JSON,
                {
                    cache: "no-store"
                }
            );


        if (response.ok) {

            const data =
                await response.json();


            if (Array.isArray(data)) {

                jsonProduk = data;

            }

        }

    }

    catch (error) {

        console.warn(
            "Data produk.json tidak dapat dibaca:",
            error
        );

    }


    /*
     * Produk tambahan dari localStorage
     */

    const localProduk =
        getStoredProduk();


    /*
     * Gabungkan
     */

    const semuaProduk = [

        ...jsonProduk,

        ...localProduk

    ];


    /*
     * Simpan ke window
     */

    window.plazaProdukData = {

        json: jsonProduk,

        local: localProduk,

        all: semuaProduk

    };


    /*
     * Statistik
     */

    updateProdukStatistics(
        semuaProduk
    );


    /*
     * Render tabel
     */

    renderProdukList(
        semuaProduk
    );


    console.log(
        "Produk berhasil dimuat:",
        semuaProduk
    );

}


/* =========================================================
   GET LOCAL STORAGE
========================================================= */

function getStoredProduk() {

    try {

        const stored =
            localStorage.getItem(
                PRODUK_STORAGE
            );


        if (!stored) {

            return [];

        }


        const parsed =
            JSON.parse(
                stored
            );


        return Array.isArray(parsed)
            ? parsed
            : [];

    }

    catch (error) {

        console.error(
            "Gagal membaca localStorage produk:",
            error
        );

        return [];

    }

}


/* =========================================================
   SAVE LOCAL STORAGE
========================================================= */

function saveStoredProduk(
    data
) {

    try {

        localStorage.setItem(
            PRODUK_STORAGE,
            JSON.stringify(data)
        );

        return true;

    }

    catch (error) {

        console.error(
            "Gagal menyimpan produk:",
            error
        );

        return false;

    }

}


/* =========================================================
   STATISTIK
========================================================= */

function updateProdukStatistics(
    produk
) {

    /*
     * TOTAL
     */

    setText(
        "totalProduk",
        produk.length
    );


    /*
     * PRODUK AKTIF
     */

    const aktif =
        produk.filter(
            function (item) {

                return (
                    String(
                        item.status || "aktif"
                    ).toLowerCase()
                    === "aktif"
                );

            }
        );


    setText(
        "produkAktif",
        aktif.length
    );


    /*
     * UMKM TERLIBAT
     */

    const umkmSet =
        new Set();


    produk.forEach(
        function (item) {

            const pemilik =
                item.umkm ||
                item.pemilik ||
                item.nama_umkm ||
                item.umkmPemilik ||
                "";


            if (
                String(pemilik).trim()
            ) {

                umkmSet.add(
                    String(
                        pemilik
                    ).trim()
                    .toLowerCase()
                );

            }

        }
    );


    setText(
        "umkmTerlibat",
        umkmSet.size
    );

}


/* =========================================================
   INIT FORM
========================================================= */

function initFormSubmit() {

    const form =
        document.getElementById(
            "produkForm"
        );


    if (!form) {

        console.warn(
            "Form produk tidak ditemukan."
        );

        return;

    }


    form.addEventListener(
        "submit",
        saveProduk
    );

}


/* =========================================================
   SIMPAN PRODUK
========================================================= */

function saveProduk(
    event
) {

    event.preventDefault();


    /*
     * AMBIL FORM
     */

    const nama =
        getValue(
            "namaProduk"
        );


    const kategori =
        getValue(
            "kategoriProduk"
        );


    const umkm =
        getValue(
            "umkmProduk"
        );


    const desa =
        getValue(
            "desaProduk"
        );


    const deskripsi =
        getValue(
            "deskripsiProduk"
        );


    const harga =
        getValue(
            "hargaProduk"
        );


    const whatsapp =
        getValue(
            "whatsappProduk"
        );


    const gambar =
        getValue(
            "gambarProduk"
        );


    const status =
        getValue(
            "statusProduk"
        ) || "aktif";


    /*
     * VALIDASI
     */

    if (
        !nama ||
        !kategori ||
        !umkm ||
        !desa ||
        !deskripsi ||
        !harga ||
        !whatsapp ||
        !gambar
    ) {

        showProdukAlert(
            "warning",
            "Mohon lengkapi seluruh field yang wajib diisi."
        );

        return;

    }


    /*
     * LOCAL DATA
     */

    const produkLokal =
        getStoredProduk();


    /*
     * ID
     */

    const allIds = [];


    produkLokal.forEach(
        function (item) {

            const id =
                Number(
                    item.id
                ) || 0;


            allIds.push(id);

        }
    );


    if (
        window.plazaProdukData &&
        Array.isArray(
            window.plazaProdukData.json
        )
    ) {

        window.plazaProdukData.json.forEach(
            function (item) {

                const id =
                    Number(
                        item.id
                    ) || 0;


                allIds.push(id);

            }
        );

    }


    const newId =
        allIds.length
            ? Math.max(...allIds) + 1
            : 1;


    /*
     * PRODUK BARU
     */

    const produkBaru = {

        id: newId,

        nama: nama,

        slug:
            createSlug(
                nama
            ),

        kategori: kategori,

        umkm: umkm,

        desa: desa,

        deskripsi: deskripsi,

        harga: harga,

        whatsapp:
            normalizeWhatsapp(
                whatsapp
            ),

        gambar: gambar,

        status: status,

        tanggal:
            new Date()
                .toISOString()
                .split("T")[0],

        sumber:
            "admin"

    };


    /*
     * TAMBAHKAN
     */

    produkLokal.push(
        produkBaru
    );


    /*
     * SIMPAN
     */

    const berhasil =
        saveStoredProduk(
            produkLokal
        );


    if (!berhasil) {

        showProdukAlert(
            "danger",
            "Produk gagal disimpan ke browser."
        );

        return;

    }


    /*
     * AKTIVITAS
     */

    saveProdukActivity(
        produkBaru
    );


    /*
     * RESET
     */

    resetProdukForm();


    /*
     * RELOAD DATA
     */

    loadProduk();


    /*
     * NOTIFIKASI
     */

    showProdukAlert(
        "success",
        "Produk <strong>" +
        escapeHTML(nama) +
        "</strong> berhasil ditambahkan."
    );


    console.log(
        "Produk baru:",
        produkBaru
    );

}


/* =========================================================
   RENDER DAFTAR PRODUK
========================================================= */

function renderProdukList(
    produk
) {

    const container =
        document.getElementById(
            "produkTableContainer"
        );


    if (!container) {

        return;

    }


    if (
        !Array.isArray(produk) ||
        produk.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">

                    <i class="fa-solid fa-box-open"></i>

                </div>

                <h3>
                    Belum Ada Produk
                </h3>

                <p>
                    Belum ada produk yang terdaftar
                    dalam sistem Plaza Dayeuhluhur.
                </p>

            </div>

        `;

        return;

    }


    let html = `

        <div class="produk-table-wrapper">

            <table class="produk-table">

                <thead>

                    <tr>

                        <th>
                            Produk
                        </th>

                        <th>
                            Kategori
                        </th>

                        <th>
                            UMKM
                        </th>

                        <th>
                            Desa
                        </th>

                        <th>
                            Harga
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Aksi
                        </th>

                    </tr>

                </thead>

                <tbody>

    `;


    produk.forEach(
        function (item, index) {

            const nama =
                item.nama ||
                item.judul ||
                "Produk Tanpa Nama";


            const kategori =
                item.kategori ||
                "-";


            const umkm =
                item.umkm ||
                item.pemilik ||
                item.nama_umkm ||
                "-";


            const desa =
                item.desa ||
                "-";


            const harga =
                item.harga ||
                "-";


            const status =
                String(
                    item.status ||
                    "aktif"
                ).toLowerCase();


            const gambar =
                item.gambar ||
                "assets/images/produk/default.jpg";


            const sumber =
                item.sumber ||
                "json";


            const badge =
                status === "aktif"

                    ? `
                        <span class="produk-status aktif">
                            <i class="fa-solid fa-circle-check"></i>
                            Aktif
                        </span>
                    `

                    : `
                        <span class="produk-status nonaktif">
                            <i class="fa-solid fa-circle-xmark"></i>
                            Nonaktif
                        </span>
                    `;


            html += `

                <tr>

                    <!-- PRODUK -->

                    <td>

                        <div class="produk-info">

                            <div class="produk-thumb">

                                <img
                                    src="${escapeHTML(gambar)}"
                                    alt="${escapeHTML(nama)}"
                                    onerror="this.src='assets/images/produk/default.jpg'"
                                >

                            </div>

                            <div>

                                <strong>
                                    ${escapeHTML(nama)}
                                </strong>

                                <small>
                                    ID #${escapeHTML(item.id ?? "-")}
                                </small>

                            </div>

                        </div>

                    </td>


                    <!-- KATEGORI -->

                    <td>

                        <span class="produk-category">

                            ${escapeHTML(kategori)}

                        </span>

                    </td>


                    <!-- UMKM -->

                    <td>

                        ${escapeHTML(umkm)}

                    </td>


                    <!-- DESA -->

                    <td>

                        <i class="fa-solid fa-location-dot"></i>

                        ${escapeHTML(desa)}

                    </td>


                    <!-- HARGA -->

                    <td>

                        <strong class="produk-price">

                            ${escapeHTML(harga)}

                        </strong>

                    </td>


                    <!-- STATUS -->

                    <td>

                        ${badge}

                    </td>


                    <!-- AKSI -->

                    <td>

                        <div class="produk-actions">

                            ${
                                sumber === "admin"

                                ? `

                                    <button
                                        type="button"
                                        class="btn-produk-toggle"
                                        onclick="toggleProdukStatus(${index})"
                                        title="Ubah Status">

                                        <i class="fa-solid fa-power-off"></i>

                                    </button>


                                    <button
                                        type="button"
                                        class="btn-produk-delete"
                                        onclick="deleteProduk(${index})"
                                        title="Hapus Produk">

                                        <i class="fa-solid fa-trash"></i>

                                    </button>

                                `

                                : `

                                    <span
                                        class="produk-source"
                                        title="Data berasal dari JSON">

                                        <i class="fa-solid fa-database"></i>

                                    </span>

                                `
                            }

                        </div>

                    </td>

                </tr>

            `;

        }
    );


    html += `

                </tbody>

            </table>

        </div>

    `;


    container.innerHTML =
        html;

}


/* =========================================================
   TOGGLE STATUS PRODUK
========================================================= */

function toggleProdukStatus(
    index
) {

    const produkLokal =
        getStoredProduk();


    if (
        !produkLokal[index]
    ) {

        return;

    }


    const produk =
        produkLokal[index];


    const current =
        String(
            produk.status ||
            "aktif"
        ).toLowerCase();


    produk.status =
        current === "aktif"
            ? "nonaktif"
            : "aktif";


    saveStoredProduk(
        produkLokal
    );


    loadProduk();


    showProdukAlert(
        "success",
        "Status produk <strong>" +
        escapeHTML(
            produk.nama
        ) +
        "</strong> diubah menjadi <strong>" +
        escapeHTML(
            produk.status
        ) +
        "</strong>."
    );

}


/* =========================================================
   DELETE PRODUK
========================================================= */

function deleteProduk(
    index
) {

    const produkLokal =
        getStoredProduk();


    if (
        !produkLokal[index]
    ) {

        return;

    }


    const produk =
        produkLokal[index];


    const yakin =
        confirm(
            "Hapus produk \"" +
            produk.nama +
            "\"?"
        );


    if (!yakin) {

        return;

    }


    produkLokal.splice(
        index,
        1
    );


    saveStoredProduk(
        produkLokal
    );


    loadProduk();


    showProdukAlert(
        "success",
        "Produk berhasil dihapus."
    );

}


/* =========================================================
   PREVIEW GAMBAR
========================================================= */

function initPreview() {

    const input =
        document.getElementById(
            "gambarProduk"
        );


    const preview =
        document.getElementById(
            "produkPreview"
        );


    const image =
        document.getElementById(
            "previewImage"
        );


    if (
        !input ||
        !preview ||
        !image
    ) {

        return;

    }


    input.addEventListener(
        "input",
        function () {

            const url =
                input.value.trim();


            if (!url) {

                preview.style.display =
                    "none";

                image.src = "";

                return;

            }


            image.onload =
                function () {

                    preview.style.display =
                        "block";

                };


            image.onerror =
                function () {

                    preview.style.display =
                        "block";

                    image.src =
                        "assets/images/produk/default.jpg";

                };


            image.src =
                url;

        }
    );

}


/* =========================================================
   RESET
========================================================= */

function initReset() {

    const button =
        document.getElementById(
            "resetProduk"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        function () {

            setTimeout(
                function () {

                    hidePreview();

                },
                50
            );

        }
    );

}


function resetProdukForm() {

    const form =
        document.getElementById(
            "produkForm"
        );


    if (form) {

        form.reset();

    }


    setValue(
        "statusProduk",
        "aktif"
    );


    hidePreview();

}


function hidePreview() {

    const preview =
        document.getElementById(
            "produkPreview"
        );


    const image =
        document.getElementById(
            "previewImage"
        );


    if (preview) {

        preview.style.display =
            "none";

    }


    if (image) {

        image.src = "";

    }

}


/* =========================================================
   AKTIVITAS DASHBOARD
========================================================= */

function saveProdukActivity(
    produk
) {

    let activities = [];


    try {

        const stored =
            localStorage.getItem(
                "plazaActivities"
            );


        if (stored) {

            activities =
                JSON.parse(
                    stored
                );

        }


        if (
            !Array.isArray(
                activities
            )
        ) {

            activities = [];

        }

    }

    catch (error) {

        activities = [];

    }


    activities.unshift({

        type:
            "produk",

        title:
            "Produk baru ditambahkan",

        description:
            produk.nama +
            " — " +
            produk.desa,

        icon:
            "fa-box-open",

        date:
            new Date().toISOString()

    });


    activities =
        activities.slice(
            0,
            10
        );


    try {

        localStorage.setItem(
            "plazaActivities",
            JSON.stringify(
                activities
            )
        );

    }

    catch (error) {

        console.error(
            "Gagal menyimpan aktivitas:",
            error
        );

    }

}


/* =========================================================
   ALERT / TOAST
========================================================= */

function showProdukAlert(
    type,
    message
) {

    const old =
        document.querySelector(
            ".produk-toast"
        );


    if (old) {

        old.remove();

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "produk-toast " +
        type;


    let icon =
        "fa-circle-info";


    if (type === "success") {

        icon =
            "fa-circle-check";

    }


    if (type === "warning") {

        icon =
            "fa-triangle-exclamation";

    }


    if (type === "danger") {

        icon =
            "fa-circle-xmark";

    }


    toast.innerHTML = `

        <div class="produk-toast-icon">

            <i class="fa-solid ${icon}"></i>

        </div>

        <div class="produk-toast-content">

            ${message}

        </div>

        <button
            type="button"
            class="produk-toast-close">

            <i class="fa-solid fa-xmark"></i>

        </button>

    `;


    document.body.appendChild(
        toast
    );


    setTimeout(
        function () {

            toast.classList.add(
                "show"
            );

        },
        50
    );


    const close =
        toast.querySelector(
            ".produk-toast-close"
        );


    if (close) {

        close.addEventListener(
            "click",
            function () {

                toast.remove();

            }
        );

    }


    setTimeout(
        function () {

            if (
                document.body.contains(
                    toast
                )
            ) {

                toast.classList.remove(
                    "show"
                );


                setTimeout(
                    function () {

                        toast.remove();

                    },
                    300
                );

            }

        },
        4000
    );

}


/* =========================================================
   GET VALUE
========================================================= */

function getValue(
    id
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return "";

    }


    return String(
        element.value || ""
    ).trim();

}


/* =========================================================
   SET VALUE
========================================================= */

function setValue(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.value =
            value;

    }

}


/* =========================================================
   SET TEXT
========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================================
   NORMALIZE WHATSAPP
========================================================= */

function normalizeWhatsapp(
    number
) {

    let value =
        String(
            number || ""
        )
        .replace(
            /\D/g,
            ""
        );


    if (
        value.startsWith(
            "0"
        )
    ) {

        value =
            "62" +
            value.substring(1);

    }


    if (
        value.startsWith(
            "8"
        )
    ) {

        value =
            "62" +
            value;

    }


    return value;

}


/* =========================================================
   SLUG
========================================================= */

function createSlug(
    text
) {

    return String(
        text || ""
    )

        .toLowerCase()

        .trim()

        .replace(
            /[^a-z0-9\s-]/g,
            ""
        )

        .replace(
            /\s+/g,
            "-"
        )

        .replace(
            /-+/g,
            "-"
        );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   GLOBAL FUNCTIONS
   Agar tombol HTML onclick dapat bekerja
========================================================= */

window.toggleProdukStatus =
    toggleProdukStatus;

window.deleteProduk =
    deleteProduk;


/* =========================================================
   END
========================================================= */

console.log(
    "produk-admin.js V2 FINAL siap."
);