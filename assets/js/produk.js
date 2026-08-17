/* =========================================================
PLAZA DAYEUHLUHUR
ETALASE PRODUK UMKM
produk.js — FINAL V1
========================================================= */

"use strict";

/* =========================================================
KONFIGURASI
========================================================= */

const PRODUK_API_URL =
"/api/produk";

const PRODUK_JSON_URL =
"data/produk.json";

const DEFAULT_IMAGE =
"assets/images/umkm/default.jpg";

/* =========================================================
DATA
========================================================= */

let semuaProduk = [];

let produkAktif = [];

/* =========================================================
INITIALIZE
========================================================= */

document.addEventListener(
"DOMContentLoaded",
initProduk
);

async function initProduk() {

```
console.log(
    "===================================="
);

console.log(
    "PLAZA DAYEUHLUHUR"
);

console.log(
    "ETALASE PRODUK UMKM"
);

console.log(
    "Inisialisasi halaman..."
);

console.log(
    "===================================="
);


setCurrentYear();


try {

    await loadProduk();

    populateFilters();

    updateStatistics();

    renderProduk();

    bindProdukEvents();

}

catch (error) {

    console.error(
        "PRODUK: Gagal inisialisasi:",
        error
    );

    showProdukError();

}
```

}

/* =========================================================
LOAD DATA
========================================================= */

async function loadProduk() {

```
let apiBerhasil =
    false;


/* =====================================================
   COBA API TERLEBIH DAHULU
====================================================== */

try {

    console.log(
        "PRODUK: Membaca data dari API..."
    );


    const response =
        await fetch(
            PRODUK_API_URL,
            {
                method: "GET",

                headers: {
                    "Accept":
                        "application/json"
                },

                cache:
                    "no-store"
            }
        );


    if (response.ok) {

        const data =
            await response.json();


        if (Array.isArray(data)) {

            semuaProduk =
                normalizeProdukData(data);

            apiBerhasil =
                true;


            console.log(
                "PRODUK: Data berhasil dimuat dari API:",
                semuaProduk
            );

        }

    }

    else {

        console.warn(
            "PRODUK: API merespons status:",
            response.status
        );

    }

}

catch (error) {

    console.warn(
        "PRODUK: API tidak dapat diakses:",
        error
    );

}


/* =====================================================
   FALLBACK KE JSON
====================================================== */

if (!apiBerhasil) {

    try {

        console.log(
            "PRODUK: Menggunakan fallback produk.json..."
        );


        const response =
            await fetch(
                PRODUK_JSON_URL,
                {
                    cache:
                        "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "produk.json tidak ditemukan."
            );

        }


        const data =
            await response.json();


        if (!Array.isArray(data)) {

            throw new Error(
                "Format produk.json bukan array."
            );

        }


        semuaProduk =
            normalizeProdukData(data);


        console.log(
            "PRODUK: Data berhasil dimuat dari produk.json:",
            semuaProduk
        );

    }

    catch (error) {

        console.error(
            "PRODUK: Gagal membaca API dan JSON:",
            error
        );

        throw error;

    }

}


/* =====================================================
   FILTER STATUS
====================================================== */

produkAktif =
    semuaProduk.filter(
        item =>
            isProdukAktif(item)
    );


console.log(
    "PRODUK: Total data:",
    semuaProduk.length
);


console.log(
    "PRODUK: Produk aktif:",
    produkAktif.length
);
```

}

/* =========================================================
NORMALIZE DATA
========================================================= */

function normalizeProdukData(
data
) {

```
return data.map(
    (item, index) => {

        const produk =
            item.produk ||
            item.nama ||
            item.nama_produk ||
            "Produk Lokal";


        const nama =
            item.nama ||
            item.produk ||
            item.nama_produk ||
            "Produk Lokal";


        const kategori =
            item.kategori ||
            item.category ||
            "UMKM";


        const umkm =
            item.umkm ||
            item.nama_umkm ||
            item.pemilik ||
            "UMKM Lokal";


        const desa =
            item.desa ||
            item.desa_kelurahan ||
            "Dayeuhluhur";


        const deskripsi =
            item.deskripsi ||
            item.description ||
            "Produk unggulan masyarakat Dayeuhluhur.";


        const harga =
            item.harga ||
            item.price ||
            "Hubungi Penjual";


        const gambar =
            item.gambar ||
            item.image ||
            item.foto ||
            DEFAULT_IMAGE;


        const whatsapp =
            normalizeWhatsApp(
                item.whatsapp ||
                item.wa ||
                item.telepon ||
                item.nohp ||
                ""
            );


        const status =
            item.status ||
            "aktif";


        return {

            ...item,

            id:
                item.id ??
                index + 1,

            produk:
                produk,

            nama:
                nama,

            kategori:
                kategori,

            umkm:
                umkm,

            desa:
                desa,

            deskripsi:
                deskripsi,

            harga:
                harga,

            gambar:
                gambar,

            whatsapp:
                whatsapp,

            status:
                status

        };

    }
);
```

}

/* =========================================================
STATUS PRODUK
========================================================= */

function isProdukAktif(
item
) {

```
const status =
    String(
        item.status ||
        "aktif"
    )
    .trim()
    .toLowerCase();


return (

    status === "aktif" ||

    status === "active" ||

    status === "tersedia" ||

    status === "publish" ||

    status === "published"

);
```

}

/* =========================================================
FILTER EVENTS
========================================================= */

function bindProdukEvents() {

```
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

    search.addEventListener(
        "input",
        renderProduk
    );

}


if (kategori) {

    kategori.addEventListener(
        "change",
        renderProduk
    );

}


if (desa) {

    desa.addEventListener(
        "change",
        renderProduk
    );

}
```

}

/* =========================================================
POPULATE FILTER
========================================================= */

function populateFilters() {

```
const kategoriSelect =
    document.getElementById(
        "filterKategori"
    );


const desaSelect =
    document.getElementById(
        "filterDesa"
    );


/* =====================================================
   KATEGORI
====================================================== */

if (kategoriSelect) {

    const kategoriSet =
        new Set();


    produkAktif.forEach(
        item => {

            const kategori =
                String(
                    item.kategori ||
                    ""
                ).trim();


            if (kategori) {

                kategoriSet.add(
                    kategori
                );

            }

        }
    );


    const kategoriList =
        Array.from(
            kategoriSet
        ).sort(
            (a, b) =>
                a.localeCompare(
                    b,
                    "id"
                )
        );


    kategoriSelect.innerHTML = `

        <option value="">
            Semua Kategori
        </option>

        ${
            kategoriList
                .map(
                    kategori => `

                        <option
                            value="${escapeHTML(kategori)}"
                        >

                            ${escapeHTML(kategori)}

                        </option>

                    `
                )
                .join("")
        }

    `;

}


/* =====================================================
   DESA
====================================================== */

if (desaSelect) {

    const desaSet =
        new Set();


    produkAktif.forEach(
        item => {

            const desa =
                String(
                    item.desa ||
                    ""
                ).trim();


            if (desa) {

                desaSet.add(
                    desa
                );

            }

        }
    );


    const desaList =
        Array.from(
            desaSet
        ).sort(
            (a, b) =>
                a.localeCompare(
                    b,
                    "id"
                )
        );


    desaSelect.innerHTML = `

        <option value="">
            Semua Desa
        </option>

        ${
            desaList
                .map(
                    desa => `

                        <option
                            value="${escapeHTML(desa)}"
                        >

                            ${escapeHTML(desa)}

                        </option>

                    `
                )
                .join("")
        }

    `;

}
```

}

/* =========================================================
GET FILTERED DATA
========================================================= */

function getFilteredProduk() {

```
const searchElement =
    document.getElementById(
        "searchProduk"
    );


const kategoriElement =
    document.getElementById(
        "filterKategori"
    );


const desaElement =
    document.getElementById(
        "filterDesa"
    );


const search =
    searchElement
        ? searchElement.value
            .trim()
            .toLowerCase()
        : "";


const kategori =
    kategoriElement
        ? kategoriElement.value
            .trim()
            .toLowerCase()
        : "";


const desa =
    desaElement
        ? desaElement.value
            .trim()
            .toLowerCase()
        : "";


return produkAktif.filter(
    item => {

        const nama =
            String(
                item.produk ||
                item.nama ||
                ""
            )
            .toLowerCase();


        const umkm =
            String(
                item.umkm ||
                ""
            )
            .toLowerCase();


        const itemDesa =
            String(
                item.desa ||
                ""
            )
            .toLowerCase();


        const itemKategori =
            String(
                item.kategori ||
                ""
            )
            .toLowerCase();


        const cocokSearch =

            !search ||

            nama.includes(search) ||

            umkm.includes(search) ||

            itemDesa.includes(search) ||

            itemKategori.includes(search);


        const cocokKategori =

            !kategori ||

            itemKategori === kategori;


        const cocokDesa =

            !desa ||

            itemDesa === desa;


        return (

            cocokSearch &&

            cocokKategori &&

            cocokDesa

        );

    }
);
```

}

/* =========================================================
RENDER PRODUK
========================================================= */

function renderProduk() {

```
const container =
    document.getElementById(
        "produkContainer"
    );


const loading =
    document.getElementById(
        "produkLoading"
    );


const empty =
    document.getElementById(
        "produkEmpty"
    );


if (!container) {

    console.warn(
        "PRODUK: produkContainer tidak ditemukan."
    );

    return;

}


if (loading) {

    loading.style.display =
        "none";

}


if (empty) {

    empty.style.display =
        "none";

}


const data =
    getFilteredProduk();


if (
    !data.length
) {

    container.innerHTML =
        "";


    if (empty) {

        empty.style.display =
            "block";

    }


    return;

}


container.innerHTML =
    data
        .map(
            item =>
                createProdukCard(
                    item
                )
        )
        .join("");
```

}

/* =========================================================
CREATE PRODUCT CARD
========================================================= */

function createProdukCard(
item
) {

```
const nama =
    item.produk ||
    item.nama ||
    "Produk Lokal";


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
    "Produk unggulan masyarakat Dayeuhluhur.";


const harga =
    item.harga ||
    "Hubungi Penjual";


const gambar =
    item.gambar ||
    DEFAULT_IMAGE;


const whatsapp =
    normalizeWhatsApp(
        item.whatsapp ||
        item.wa ||
        ""
    );


const hasWhatsApp =
    Boolean(
        whatsapp
    );


const image =
    escapeHTML(
        gambar
    );


const safeNama =
    escapeHTML(
        nama
    );


const safeKategori =
    escapeHTML(
        kategori
    );


const safeUMKM =
    escapeHTML(
        umkm
    );


const safeDesa =
    escapeHTML(
        desa
    );


const safeDeskripsi =
    escapeHTML(
        deskripsi
    );


const safeHarga =
    escapeHTML(
        formatHarga(
            harga
        )
    );


let whatsappButton;


if (hasWhatsApp) {

    const pesan =
        encodeURIComponent(
            `Halo ${nama}, saya tertarik dengan produk "${nama}". Saya ingin mengetahui informasi harga dan ketersediaannya.`
        );


    whatsappButton = `

        <a
            href="https://wa.me/${whatsapp}?text=${pesan}"
            target="_blank"
            rel="noopener noreferrer"
            class="produk-wa"
        >

            <i class="fa-brands fa-whatsapp"></i>

            Beli via WhatsApp

        </a>

    `;

}

else {

    whatsappButton = `

        <span
            class="produk-wa disabled"
        >

            <i class="fa-solid fa-phone-slash"></i>

            WhatsApp Belum Tersedia

        </span>

    `;

}


return `

    <article
        class="produk-card"
        data-id="${escapeHTML(item.id)}"
    >


        <!-- IMAGE -->

        <div class="produk-card-image">

            <img
                src="${image}"
                alt="${safeNama}"
                loading="lazy"
                onerror="
                    this.onerror=null;
                    this.src='${DEFAULT_IMAGE}';
                "
            >


            <span
                class="produk-category-badge"
            >

                ${safeKategori}

            </span>

        </div>



        <!-- BODY -->

        <div class="produk-card-body">


            <h3
                class="produk-card-title"
            >

                ${safeNama}

            </h3>


            <p
                class="produk-card-description"
            >

                ${safeDeskripsi}

            </p>



            <!-- META -->

            <div
                class="produk-card-meta"
            >

                <div
                    class="produk-meta-item"
                >

                    <i
                        class="fa-solid fa-store"
                    ></i>

                    <span>

                        <strong>
                            UMKM:
                        </strong>

                        ${safeUMKM}

                    </span>

                </div>


                <div
                    class="produk-meta-item"
                >

                    <i
                        class="fa-solid fa-location-dot"
                    ></i>

                    <span>

                        <strong>
                            Desa:
                        </strong>

                        ${safeDesa}

                    </span>

                </div>

            </div>



            <!-- BOTTOM -->

            <div
                class="produk-card-bottom"
            >

                <div
                    class="produk-price"
                >

                    ${safeHarga}

                </div>


                ${whatsappButton}

            </div>


        </div>

    </article>

`;
```

}

/* =========================================================
STATISTICS
========================================================= */

function updateStatistics() {

```
const totalProdukElement =
    document.getElementById(
        "totalProduk"
    );


const totalUMKMElement =
    document.getElementById(
        "totalUMKM"
    );


const totalDesaElement =
    document.getElementById(
        "totalDesa"
    );


const totalProduk =
    produkAktif.length;


const umkmSet =
    new Set();


const desaSet =
    new Set();


produkAktif.forEach(
    item => {

        const umkm =
            String(
                item.umkm ||
                ""
            ).trim().toLowerCase();


        const desa =
            String(
                item.desa ||
                ""
            ).trim().toLowerCase();


        if (umkm) {

            umkmSet.add(
                umkm
            );

        }


        if (desa) {

            desaSet.add(
                desa
            );

        }

    }
);


if (totalProdukElement) {

    totalProdukElement.textContent =
        totalProduk;

}


if (totalUMKMElement) {

    totalUMKMElement.textContent =
        umkmSet.size;

}


if (totalDesaElement) {

    totalDesaElement.textContent =
        desaSet.size;

}


console.log(
    "PRODUK STATISTIK:",
    {
        produk:
            totalProduk,

        umkm:
            umkmSet.size,

        desa:
            desaSet.size
    }
);
```

}

/* =========================================================
FORMAT HARGA
========================================================= */

function formatHarga(
harga
) {

```
if (
    harga === null ||
    harga === undefined ||
    harga === ""
) {

    return "Hubungi Penjual";

}


const value =
    String(
        harga
    ).trim();


if (!value) {

    return "Hubungi Penjual";

}


/*
 * Jika sudah mengandung Rp,
 * jangan diformat ulang.
 */

if (
    /rp/i.test(
        value
    )
) {

    return value;

}


/*
 * Jika berupa angka,
 * format otomatis menjadi Rupiah.
 */

const numeric =
    Number(
        value.replace(
            /[^\d]/g,
            ""
        )
    );


if (
    !Number.isNaN(numeric) &&
    numeric > 0
) {

    return (
        "Rp" +
        new Intl.NumberFormat(
            "id-ID"
        ).format(
            numeric
        )
    );

}


return value;
```

}

/* =========================================================
NORMALIZE WHATSAPP
========================================================= */

function normalizeWhatsApp(
number
) {

```
if (!number) {

    return "";

}


let wa =
    String(number)
        .trim()
        .replace(
            /\s+/g,
            ""
        )
        .replace(
            /-/g,
            ""
        )
        .replace(
            /[^\d+]/g,
            ""
        );


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
```

}

/* =========================================================
SHOW ERROR
========================================================= */

function showProdukError() {

```
const loading =
    document.getElementById(
        "produkLoading"
    );


const container =
    document.getElementById(
        "produkContainer"
    );


const error =
    document.getElementById(
        "produkError"
    );


if (loading) {

    loading.style.display =
        "none";

}


if (container) {

    container.innerHTML =
        "";

}


if (error) {

    error.style.display =
        "block";

}
```

}

/* =========================================================
CURRENT YEAR
========================================================= */

function setCurrentYear() {

```
const year =
    document.getElementById(
        "tahunSekarang"
    );


if (year) {

    year.textContent =
        new Date()
            .getFullYear();

}
```

}

/* =========================================================
ESCAPE HTML
========================================================= */

function escapeHTML(
value
) {

```
return String(
    value
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
```

}

/* =========================================================
DEBUG HELPER
========================================================= */

window.getProdukData =
function () {

```
    console.log(
        "SEMUA PRODUK:",
        semuaProduk
    );


    console.log(
        "PRODUK AKTIF:",
        produkAktif
    );


    return {

        semuaProduk:
            semuaProduk,

        produkAktif:
            produkAktif

    };

};
```

/* =========================================================
END
========================================================= */
