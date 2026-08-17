```javascript
/* =====================================================
   PLAZA DAYEUHLUHUR
   PRODUK UMKM
   JavaScript FINAL
===================================================== */

"use strict";


/* =====================================================
   KONFIGURASI
===================================================== */

const PRODUK_API_URL = "/api/produk";
const PRODUK_JSON_URL = "data/produk.json";


let produkData = [];
let filteredProduk = [];


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initProduk
);


async function initProduk() {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR - PRODUK");
    console.log("Inisialisasi halaman produk...");
    console.log("====================================");


    bindEvents();

    await loadProduk();

}


/* =====================================================
   LOAD PRODUK
===================================================== */

async function loadProduk() {

    showLoading();

    let berhasil = false;


    /* -------------------------------------------------
       1. COBA API
    ------------------------------------------------- */

    try {

        console.log(
            "Mencoba membaca produk dari:",
            PRODUK_API_URL
        );


        const response = await fetch(
            PRODUK_API_URL,
            {
                method: "GET",
                cache: "no-store"
            }
        );


        if (!response.ok) {

            throw new Error(
                `API HTTP ${response.status}`
            );

        }


        const result =
            await response.json();


        const data =
            extractProdukData(result);


        if (Array.isArray(data)) {

            produkData =
                normalizeProdukData(data);

            berhasil = true;


            console.log(
                "Produk berhasil dimuat dari API:",
                produkData
            );

        }

    }

    catch (error) {

        console.warn(
            "API produk tidak dapat digunakan. Menggunakan produk.json.",
            error
        );

    }


    /* -------------------------------------------------
       2. FALLBACK JSON
    ------------------------------------------------- */

    if (!berhasil) {

        try {

            console.log(
                "Membaca:",
                PRODUK_JSON_URL
            );


            const response =
                await fetch(
                    PRODUK_JSON_URL,
                    {
                        cache: "no-store"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `JSON HTTP ${response.status}`
                );

            }


            const data =
                await response.json();


            if (!Array.isArray(data)) {

                throw new Error(
                    "Format produk.json bukan array."
                );

            }


            produkData =
                normalizeProdukData(data);


            berhasil = true;


            console.log(
                "Produk berhasil dimuat dari produk.json:",
                produkData
            );

        }

        catch (error) {

            console.error(
                "Gagal membaca produk.json:",
                error
            );

            produkData = [];

        }

    }


    /* -------------------------------------------------
       RENDER
    ------------------------------------------------- */

    filteredProduk =
        produkData.filter(
            item =>
                getStatus(item) === "aktif"
        );


    updateStatistics();

    populateFilters();

    renderProduk();

}


/* =====================================================
   EXTRACT API DATA
===================================================== */

function extractProdukData(result) {

    if (Array.isArray(result)) {

        return result;

    }


    if (
        result &&
        Array.isArray(result.data)
    ) {

        return result.data;

    }


    if (
        result &&
        Array.isArray(result.produk)
    ) {

        return result.produk;

    }


    if (
        result &&
        Array.isArray(result.products)
    ) {

        return result.products;

    }


    return [];

}


/* =====================================================
   NORMALIZE DATA
===================================================== */

function normalizeProdukData(data) {

    return data.map(
        item => ({

            id:
                item.id ?? "",

            produk:
                item.produk ||
                item.nama ||
                "Produk UMKM",

            nama:
                item.nama ||
                item.produk ||
                "Produk UMKM",

            kategori:
                item.kategori ||
                "UMKM",

            umkm:
                item.umkm ||
                item.nama_umkm ||
                item.pemilik ||
                "UMKM Lokal",

            desa:
                item.desa ||
                "Dayeuhluhur",

            deskripsi:
                item.deskripsi ||
                "Produk lokal Dayeuhluhur.",

            harga:
                item.harga ||
                "Hubungi Penjual",

            whatsapp:
                normalizeWhatsApp(
                    item.whatsapp ||
                    item.wa ||
                    item.telepon ||
                    ""
                ),

            gambar:
                item.gambar ||
                item.image ||
                item.foto ||
                "assets/images/produk/default.jpg",

            status:
                item.status ||
                "aktif"

        })
    );

}


/* =====================================================
   BIND EVENTS
===================================================== */

function bindEvents() {

    const search =
        document.getElementById(
            "searchProduk"
        );


    const kategori =
        document.getElementById(
            "filterKategori"
        );


    const desa =
        document.getElementById(
            "filterDesa"
        );


    const reset =
        document.getElementById(
            "resetFilter"
        );


    if (search) {

        search.addEventListener(
            "input",
            applyFilters
        );

    }


    if (kategori) {

        kategori.addEventListener(
            "change",
            applyFilters
        );

    }


    if (desa) {

        desa.addEventListener(
            "change",
            applyFilters
        );

    }


    if (reset) {

        reset.addEventListener(
            "click",
            resetFilters
        );

    }

}


/* =====================================================
   FILTER
===================================================== */

function applyFilters() {

    const search =
        getElementValue(
            "searchProduk"
        ).toLowerCase();


    const kategori =
        getElementValue(
            "filterKategori"
        ).toLowerCase();


    const desa =
        getElementValue(
            "filterDesa"
        ).toLowerCase();


    filteredProduk =
        produkData.filter(
            item => {

                if (
                    getStatus(item) !==
                    "aktif"
                ) {

                    return false;

                }


                const text = (

                    getProdukName(item) +
                    " " +
                    item.kategori +
                    " " +
                    item.umkm +
                    " " +
                    item.desa +
                    " " +
                    item.deskripsi

                ).toLowerCase();


                const cocokSearch =
                    !search ||
                    text.includes(search);


                const cocokKategori =
                    !kategori ||
                    String(
                        item.kategori
                    ).toLowerCase() ===
                    kategori;


                const cocokDesa =
                    !desa ||
                    String(
                        item.desa
                    ).toLowerCase() ===
                    desa;


                return (
                    cocokSearch &&
                    cocokKategori &&
                    cocokDesa
                );

            }
        );


    renderProduk();

}


/* =====================================================
   RESET FILTER
===================================================== */

function resetFilters() {

    const search =
        document.getElementById(
            "searchProduk"
        );


    const kategori =
        document.getElementById(
            "filterKategori"
        );


    const desa =
        document.getElementById(
            "filterDesa"
        );


    if (search) {

        search.value = "";

    }


    if (kategori) {

        kategori.value = "";

    }


    if (desa) {

        desa.value = "";

    }


    applyFilters();

}


/* =====================================================
   POPULATE FILTER
===================================================== */

function populateFilters() {

    const kategori =
        document.getElementById(
            "filterKategori"
        );


    const desa =
        document.getElementById(
            "filterDesa"
        );


    if (!kategori || !desa) {

        return;

    }


    const kategoriList =
        produkData
            .filter(
                item =>
                    getStatus(item) ===
                    "aktif"
            )
            .map(
                item =>
                    String(
                        item.kategori ||
                        ""
                    ).trim()
            )
            .filter(Boolean);


    const desaList =
        produkData
            .filter(
                item =>
                    getStatus(item) ===
                    "aktif"
            )
            .map(
                item =>
                    String(
                        item.desa ||
                        ""
                    ).trim()
            )
            .filter(Boolean);


    const kategoriUnik =
        [...new Set(
            kategoriList
        )].sort();


    const desaUnik =
        [...new Set(
            desaList
        )].sort();


    kategori.innerHTML =
        '<option value="">Semua Kategori</option>' +
        kategoriUnik
            .map(
                item =>
                    `<option value="${escapeHTML(item)}">${escapeHTML(item)}</option>`
            )
            .join("");


    desa.innerHTML =
        '<option value="">Semua Desa</option>' +
        desaUnik
            .map(
                item =>
                    `<option value="${escapeHTML(item)}">${escapeHTML(item)}</option>`
            )
            .join("");

}


/* =====================================================
   RENDER PRODUK
===================================================== */

function renderProduk() {

    const container =
        document.getElementById(
            "produkContainer"
        );


    const empty =
        document.getElementById(
            "produkEmpty"
        );


    const count =
        document.getElementById(
            "produkCount"
        );


    if (!container) {

        console.error(
            "produkContainer tidak ditemukan."
        );

        return;

    }


    if (count) {

        count.textContent =
            `${filteredProduk.length} produk`;

    }


    if (
        !filteredProduk.length
    ) {

        container.innerHTML = "";

        if (empty) {

            empty.style.display =
                "block";

        }

        return;

    }


    if (empty) {

        empty.style.display =
            "none";

    }


    container.innerHTML =
        filteredProduk
            .map(
                createProdukCard
            )
            .join("");

}


/* =====================================================
   CREATE CARD
===================================================== */

function createProdukCard(item) {

    const nama =
        getProdukName(item);


    const kategori =
        item.kategori ||
        "UMKM";


    const umkm =
        item.umkm ||
        "UMKM Lokal";


    const desa =
        item.desa ||
        "Dayeuhluhur";


    const deskripsi =
        item.deskripsi ||
        "Produk lokal Dayeuhluhur.";


    const harga =
        item.harga ||
        "Hubungi Penjual";


    const gambar =
        item.gambar ||
        "assets/images/produk/default.jpg";


    const whatsapp =
        normalizeWhatsApp(
            item.whatsapp ||
            item.wa ||
            ""
        );


    let whatsappButton;


    if (whatsapp) {

        const pesan =
            encodeURIComponent(
                `Halo ${umkm}, saya tertarik dengan produk ${nama}. Mohon informasi lebih lanjut mengenai produk dan harganya.`
            );


        whatsappButton = `

            <a
                href="https://wa.me/${whatsapp}?text=${pesan}"
                target="_blank"
                rel="noopener noreferrer"
                class="produk-whatsapp"
            >
                <i class="fa-brands fa-whatsapp me-2"></i>
                Hubungi Penjual
            </a>

        `;

    }

    else {

        whatsappButton = `

            <span
                class="produk-whatsapp disabled"
            >
                <i class="fa-solid fa-phone-slash me-2"></i>
                Kontak Belum Tersedia
            </span>

        `;

    }


    return `

        <article class="produk-card">

            <div class="produk-image-wrapper">

                <img
                    src="${escapeHTML(gambar)}"
                    alt="${escapeHTML(nama)}"
                    loading="lazy"
                    onerror="
                        this.onerror=null;
                        this.src='assets/images/produk/default.jpg';
                    "
                >


                <span class="produk-category">

                    ${escapeHTML(kategori)}

                </span>


                <span class="produk-status">

                    AKTIF

                </span>

            </div>


            <div class="produk-card-body">

                <h3 class="produk-card-title">

                    ${escapeHTML(nama)}

                </h3>


                <div class="produk-umkm">

                    <i class="fa-solid fa-store me-1"></i>

                    ${escapeHTML(umkm)}

                </div>


                <div class="produk-location">

                    <i class="fa-solid fa-location-dot"></i>

                    ${escapeHTML(desa)}

                </div>


                <p class="produk-description">

                    ${escapeHTML(deskripsi)}

                </p>


                <div class="produk-price">

                    ${escapeHTML(harga)}

                </div>


                ${whatsappButton}

            </div>

        </article>

    `;

}


/* =====================================================
   STATISTICS
===================================================== */

function updateStatistics() {

    const aktif =
        produkData.filter(
            item =>
                getStatus(item) ===
                "aktif"
        );


    const kategori =
        new Set(
            aktif
                .map(
                    item =>
                        String(
                            item.kategori ||
                            ""
                        ).trim()
                )
                .filter(Boolean)
        );


    const desa =
        new Set(
            aktif
                .map(
                    item =>
                        String(
                            item.desa ||
                            ""
                        ).trim()
                )
                .filter(Boolean)
        );


    setText(
        "totalProduk",
        aktif.length
    );


    setText(
        "produkAktif",
        aktif.length
    );


    setText(
        "totalKategori",
        kategori.size
    );


    setText(
        "totalDesa",
        desa.size
    );

}


/* =====================================================
   LOADING
===================================================== */

function showLoading() {

    const container =
        document.getElementById(
            "produkContainer"
        );


    if (!container) {

        return;

    }


    container.innerHTML = `

        <div class="produk-loading">

            <div
                class="spinner-border text-primary"
                role="status"
            >
                <span class="visually-hidden">
                    Loading...
                </span>
            </div>

            <p>
                Memuat produk lokal...
            </p>

        </div>

    `;

}


/* =====================================================
   STATUS
===================================================== */

function getStatus(item) {

    return String(
        item.status ||
        "aktif"
    )
    .trim()
    .toLowerCase();

}


/* =====================================================
   NAME
===================================================== */

function getProdukName(item) {

    return (
        item.produk ||
        item.nama ||
        "Produk UMKM"
    );

}


/* =====================================================
   GET ELEMENT VALUE
===================================================== */

function getElementValue(id) {

    const element =
        document.getElementById(id);


    return element
        ? element.value.trim()
        : "";

}


/* =====================================================
   SET TEXT
===================================================== */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


/* =====================================================
   WHATSAPP
===================================================== */

function normalizeWhatsApp(
    number
) {

    if (!number) {

        return "";

    }


    let wa =
        String(number)
            .replace(/\s+/g, "")
            .replace(/-/g, "")
            .replace(/[^\d+]/g, "");


    if (
        wa.startsWith("0")
    ) {

        wa =
            "62" +
            wa.substring(1);

    }


    if (
        wa.startsWith("+62")
    ) {

        wa =
            wa.substring(1);

    }


    return wa;

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(
    value
) {

    return String(value)

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


/* =====================================================
   DEBUG
===================================================== */

console.log(
    "produk.js FINAL berhasil dimuat."
);
```
