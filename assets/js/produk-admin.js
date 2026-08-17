/* =====================================================
   PLAZA DAYEUHLUHUR
   PRODUK ADMIN V1
   Kelola Etalase Produk UMKM
===================================================== */

"use strict";


/* =====================================================
   KONFIGURASI
===================================================== */

const PRODUK_STORAGE_KEY =
    "plaza_dayeuhluhur_produk";


const PRODUK_JSON_URL =
    "data/produk.json";


/* =====================================================
   DATA
===================================================== */

let produkData = [];

let produkEditId = null;


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initProdukAdmin
);


async function initProdukAdmin() {

    console.log(
        "===================================="
    );

    console.log(
        "PRODUK ADMIN V1"
    );

    console.log(
        "Inisialisasi halaman..."
    );

    console.log(
        "===================================="
    );


    await loadProdukData();

    updateStatistics();

    renderProdukTable();

    bindProdukEvents();

    updateImagePreview();

}


/* =====================================================
   LOAD DATA
===================================================== */

async function loadProdukData() {

    try {

        const localData =
            localStorage.getItem(
                PRODUK_STORAGE_KEY
            );


        if (localData) {

            const parsed =
                JSON.parse(localData);


            if (Array.isArray(parsed)) {

                produkData = parsed;

                console.log(
                    "Produk dimuat dari localStorage:",
                    produkData
                );

                return;

            }

        }


        /*
         * Jika belum ada localStorage,
         * coba membaca produk.json
         */

        const response =
            await fetch(
                PRODUK_JSON_URL,
                {
                    cache: "no-store"
                }
            );


        if (response.ok) {

            const data =
                await response.json();


            if (Array.isArray(data)) {

                produkData = data;

                saveLocalData();

                console.log(
                    "Produk dimuat dari produk.json:",
                    produkData
                );

                return;

            }

        }


        produkData = [];

    }

    catch (error) {

        console.error(
            "Gagal membaca data produk:",
            error
        );

        produkData = [];

    }

}


/* =====================================================
   SAVE LOCAL DATA
===================================================== */

function saveLocalData() {

    localStorage.setItem(
        PRODUK_STORAGE_KEY,
        JSON.stringify(
            produkData
        )
    );

}


/* =====================================================
   BIND EVENTS
===================================================== */

function bindProdukEvents() {

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
        handleProdukSubmit
    );


    const resetButton =
        document.getElementById(
            "resetProduk"
        );


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetProdukForm
        );

    }


    const imageInput =
        document.getElementById(
            "gambarProduk"
        );


    if (imageInput) {

        imageInput.addEventListener(
            "input",
            updateImagePreview
        );

    }

}


/* =====================================================
   SUBMIT
===================================================== */

function handleProdukSubmit(event) {

    event.preventDefault();


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
        normalizeWhatsApp(
            getValue(
                "whatsappProduk"
            )
        );

    const gambar =
        getValue(
            "gambarProduk"
        );

    const status =
        getValue(
            "statusProduk"
        );


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

        alert(
            "Mohon lengkapi seluruh data wajib."
        );

        return;

    }


    /*
     * MODE EDIT
     */

    if (produkEditId !== null) {

        updateProduk({

            nama,
            kategori,
            umkm,
            desa,
            deskripsi,
            harga,
            whatsapp,
            gambar,
            status

        });

        return;

    }


    /*
     * MODE TAMBAH
     */

    const nextId =
        getNextId();


    const produkBaru = {

        id: nextId,

        produk: nama,

        nama: nama,

        kategori: kategori,

        umkm: umkm,

        desa: desa,

        deskripsi: deskripsi,

        harga: harga,

        whatsapp: whatsapp,

        gambar: gambar,

        status: status || "aktif"

    };


    produkData.push(
        produkBaru
    );


    saveLocalData();

    updateStatistics();

    renderProdukTable();

    resetProdukForm();


    alert(
        "Produk berhasil ditambahkan."
    );


    console.log(
        "Produk baru:",
        produkBaru
    );

}


/* =====================================================
   UPDATE
===================================================== */

function updateProduk(data) {

    const index =
        produkData.findIndex(
            item =>
                String(item.id) ===
                String(produkEditId)
        );


    if (index === -1) {

        alert(
            "Produk yang akan diperbarui tidak ditemukan."
        );

        resetProdukForm();

        return;

    }


    produkData[index] = {

        ...produkData[index],

        produk: data.nama,

        nama: data.nama,

        kategori: data.kategori,

        umkm: data.umkm,

        desa: data.desa,

        deskripsi: data.deskripsi,

        harga: data.harga,

        whatsapp: data.whatsapp,

        gambar: data.gambar,

        status: data.status

    };


    saveLocalData();

    updateStatistics();

    renderProdukTable();

    resetProdukForm();


    alert(
        "Data produk berhasil diperbarui."
    );

}


/* =====================================================
   EDIT
===================================================== */

function editProduk(id) {

    const item =
        produkData.find(
            produk =>
                String(produk.id) ===
                String(id)
        );


    if (!item) {

        alert(
            "Data produk tidak ditemukan."
        );

        return;

    }


    produkEditId =
        item.id;


    setValue(
        "namaProduk",
        item.produk ||
        item.nama ||
        ""
    );


    setValue(
        "kategoriProduk",
        item.kategori ||
        ""
    );


    setValue(
        "umkmProduk",
        item.umkm ||
        ""
    );


    setValue(
        "desaProduk",
        item.desa ||
        ""
    );


    setValue(
        "deskripsiProduk",
        item.deskripsi ||
        ""
    );


    setValue(
        "hargaProduk",
        item.harga ||
        ""
    );


    setValue(
        "whatsappProduk",
        item.whatsapp ||
        ""
    );


    setValue(
        "gambarProduk",
        item.gambar ||
        ""
    );


    setValue(
        "statusProduk",
        item.status ||
        "aktif"
    );


    const submitButton =
        document.querySelector(
            '#produkForm button[type="submit"]'
        );


    if (submitButton) {

        submitButton.innerHTML =
            '<i class="fa-solid fa-pen-to-square"></i>' +
            ' Update Produk';

    }


    updateImagePreview();


    const form =
        document.getElementById(
            "produkForm"
        );


    if (form) {

        form.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }

}


/* =====================================================
   DELETE
===================================================== */

function deleteProduk(id) {

    const item =
        produkData.find(
            produk =>
                String(produk.id) ===
                String(id)
        );


    if (!item) {

        alert(
            "Data produk tidak ditemukan."
        );

        return;

    }


    const yakin =
        confirm(
            `Hapus produk "${item.produk || item.nama}"?`
        );


    if (!yakin) {

        return;

    }


    produkData =
        produkData.filter(
            produk =>
                String(produk.id) !==
                String(id)
        );


    saveLocalData();

    updateStatistics();

    renderProdukTable();

    resetProdukForm();


    alert(
        "Produk berhasil dihapus."
    );

}


/* =====================================================
   RENDER TABLE
===================================================== */

function renderProdukTable() {

    const container =
        document.getElementById(
            "produkTableContainer"
        );


    if (!container) {

        return;

    }


    if (
        !Array.isArray(produkData) ||
        produkData.length === 0
    ) {

        container.innerHTML = `

            <div class="loading-state">

                <i class="fa-solid fa-box-open"></i>

                Belum ada produk.

            </div>

        `;

        return;

    }


    const rows =
        produkData
            .map(
                item =>
                    createProdukRow(item)
            )
            .join("");


    container.innerHTML = `

        <table class="produk-table">

            <thead>

                <tr>

                    <th>Foto</th>

                    <th>Produk</th>

                    <th>UMKM</th>

                    <th>Desa</th>

                    <th>Harga</th>

                    <th>Status</th>

                    <th>Aksi</th>

                </tr>

            </thead>

            <tbody>

                ${rows}

            </tbody>

        </table>

    `;

}


/* =====================================================
   CREATE TABLE ROW
===================================================== */

function createProdukRow(item) {

    const nama =
        item.produk ||
        item.nama ||
        "Produk UMKM";


    const gambar =
        item.gambar ||
        "assets/images/umkm/default.jpg";


    const umkm =
        item.umkm ||
        "UMKM Lokal";


    const desa =
        item.desa ||
        "Dayeuhluhur";


    const harga =
        item.harga ||
        "Hubungi Penjual";


    const status =
        item.status ||
        "aktif";


    return `

        <tr>

            <td>

                <img
                    src="${escapeHTML(gambar)}"
                    class="produk-thumb"
                    alt="${escapeHTML(nama)}"
                    onerror="
                        this.onerror=null;
                        this.src='assets/images/umkm/default.jpg';
                    "
                >

            </td>


            <td>

                <strong>
                    ${escapeHTML(nama)}
                </strong>

                <br>

                <small class="text-muted">
                    ${escapeHTML(item.kategori || "UMKM")}
                </small>

            </td>


            <td>
                ${escapeHTML(umkm)}
            </td>


            <td>
                ${escapeHTML(desa)}
            </td>


            <td>
                ${escapeHTML(harga)}
            </td>


            <td>

                <span
                    class="
                        status-badge
                        ${
                            status === "aktif"
                            ?
                            "status-aktif"
                            :
                            "status-nonaktif"
                        }
                    "
                >

                    ${
                        status === "aktif"
                        ?
                        "AKTIF"
                        :
                        "NONAKTIF"
                    }

                </span>

            </td>


            <td>

                <button
                    type="button"
                    class="table-action table-edit"
                    onclick="editProduk(${Number(item.id)})"
                    title="Edit Produk"
                >

                    <i class="fa-solid fa-pen"></i>

                </button>


                <button
                    type="button"
                    class="table-action table-delete"
                    onclick="deleteProduk(${Number(item.id)})"
                    title="Hapus Produk"
                >

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

    `;

}


/* =====================================================
   STATISTICS
===================================================== */

function updateStatistics() {

    const total =
        produkData.length;


    const aktif =
        produkData.filter(
            item =>
                String(
                    item.status ||
                    "aktif"
                ).toLowerCase() ===
                "aktif"
        ).length;


    const daftarUMKM =
        produkData
            .map(
                item =>
                    String(
                        item.umkm ||
                        ""
                    )
                    .trim()
                    .toLowerCase()
            )
            .filter(Boolean);


    const umkmUnik =
        new Set(
            daftarUMKM
        ).size;


    const totalElement =
        document.getElementById(
            "totalProduk"
        );


    const aktifElement =
        document.getElementById(
            "produkAktif"
        );


    const umkmElement =
        document.getElementById(
            "umkmTerlibat"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (aktifElement) {

        aktifElement.textContent =
            aktif;

    }


    if (umkmElement) {

        umkmElement.textContent =
            umkmUnik;

    }

}


/* =====================================================
   RESET
===================================================== */

function resetProdukForm() {

    produkEditId = null;


    const form =
        document.getElementById(
            "produkForm"
        );


    if (form) {

        form.reset();

    }


    const submitButton =
        document.querySelector(
            '#produkForm button[type="submit"]'
        );


    if (submitButton) {

        submitButton.innerHTML =
            '<i class="fa-solid fa-floppy-disk"></i>' +
            ' Simpan Produk';

    }


    const preview =
        document.getElementById(
            "produkPreview"
        );


    if (preview) {

        preview.style.display =
            "none";

    }

}


/* =====================================================
   IMAGE PREVIEW
===================================================== */

function updateImagePreview() {

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


    const url =
        input.value.trim();


    if (!url) {

        preview.style.display =
            "none";

        return;

    }


    image.src = url;


    image.onload =
        () => {

            preview.style.display =
                "block";

        };


    image.onerror =
        () => {

            preview.style.display =
                "none";

        };

}


/* =====================================================
   GET NEXT ID
===================================================== */

function getNextId() {

    if (
        !produkData.length
    ) {

        return 1;

    }


    return (
        Math.max(
            ...produkData.map(
                item =>
                    Number(item.id) || 0
            )
        ) + 1
    );

}


/* =====================================================
   GET VALUE
===================================================== */

function getValue(id) {

    const element =
        document.getElementById(id);


    return element
        ? element.value.trim()
        : "";

}


/* =====================================================
   SET VALUE
===================================================== */

function setValue(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.value =
            value;

    }

}


/* =====================================================
   NORMALIZE WHATSAPP
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