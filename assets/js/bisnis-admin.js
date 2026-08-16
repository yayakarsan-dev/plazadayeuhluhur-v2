/* =====================================================
   PLAZA DAYEUHLUHUR
   BISNIS ADMIN V1
   Kelola Direktori Bisnis Lokal
===================================================== */

"use strict";

/* =====================================================
   KONFIGURASI
===================================================== */

const BISNIS_DATA_URL = "data/bisnis.json";
const BISNIS_STORAGE_KEY = "plaza_dayeuhluhur_bisnis";

/* Data utama */
let dataBisnis = [];

/* Mode edit */
let editMode = false;


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("====================================");
    console.log("BISNIS ADMIN V1");
    console.log("Inisialisasi halaman...");
    console.log("====================================");

    initBisnisAdmin();

});


/* =====================================================
   INIT
===================================================== */

async function initBisnisAdmin() {

    try {

        await loadBisnisData();

        updateStatistics();

        renderTable();

        bindEvents();

        console.log(
            "BISNIS ADMIN: Inisialisasi berhasil."
        );

    } catch (error) {

        console.error(
            "BISNIS ADMIN: Gagal inisialisasi.",
            error
        );

        showTableMessage(
            "Data bisnis gagal dimuat.",
            "warning"
        );

    }

}


/* =====================================================
   LOAD DATA
===================================================== */

async function loadBisnisData() {

    console.log(
        "BISNIS ADMIN: Membaca data bisnis..."
    );

    /*
     * Prioritas pertama:
     * localStorage
     */
    const localData =
        localStorage.getItem(BISNIS_STORAGE_KEY);

    if (localData) {

        try {

            const parsed =
                JSON.parse(localData);

            if (Array.isArray(parsed)) {

                dataBisnis = parsed;

                console.log(
                    "Data bisnis dimuat dari localStorage:",
                    dataBisnis
                );

                return;

            }

        } catch (error) {

            console.warn(
                "localStorage bisnis rusak. Membaca JSON..."
            );

        }

    }


    /*
     * Jika localStorage belum tersedia,
     * baca data/bisnis.json
     */
    const response =
        await fetch(BISNIS_DATA_URL, {
            cache: "no-store"
        });

    if (!response.ok) {

        throw new Error(
            `bisnis.json gagal dimuat. Status: ${response.status}`
        );

    }

    const json =
        await response.json();

    if (!Array.isArray(json)) {

        throw new Error(
            "Format bisnis.json harus berupa Array."
        );

    }

    dataBisnis = json;

    /*
     * Simpan salinan awal ke localStorage
     */
    saveToLocalStorage();

    console.log(
        "Data bisnis berhasil dimuat dari JSON:",
        dataBisnis
    );

}


/* =====================================================
   SAVE LOCAL STORAGE
===================================================== */

function saveToLocalStorage() {

    localStorage.setItem(
        BISNIS_STORAGE_KEY,
        JSON.stringify(dataBisnis)
    );

}


/* =====================================================
   BIND EVENTS
===================================================== */

function bindEvents() {

    const form =
        document.getElementById("bisnisForm");

    const btnReset =
        document.getElementById("btnReset");

    const btnRefresh =
        document.getElementById("btnRefresh");

    const search =
        document.getElementById("searchBisnis");

    const filterKategori =
        document.getElementById("filterKategori");

    const filterStatus =
        document.getElementById("filterStatus");


    /* FORM */
    if (form) {

        form.addEventListener(
            "submit",
            handleSubmit
        );

    }


    /* RESET */
    if (btnReset) {

        btnReset.addEventListener(
            "click",
            resetForm
        );

    }


    /* REFRESH */
    if (btnRefresh) {

        btnRefresh.addEventListener(
            "click",
            async () => {

                await reloadFromJSON();

            }
        );

    }


    /* SEARCH */
    if (search) {

        search.addEventListener(
            "input",
            renderTable
        );

    }


    /* FILTER KATEGORI */
    if (filterKategori) {

        filterKategori.addEventListener(
            "change",
            renderTable
        );

    }


    /* FILTER STATUS */
    if (filterStatus) {

        filterStatus.addEventListener(
            "change",
            renderTable
        );

    }

}


/* =====================================================
   SUBMIT FORM
===================================================== */

function handleSubmit(event) {

    event.preventDefault();

    const bisnis =
        getFormData();

    if (!bisnis.nama) {

        alert(
            "Nama bisnis wajib diisi."
        );

        return;

    }

    if (!bisnis.kategori) {

        alert(
            "Kategori bisnis wajib dipilih."
        );

        return;

    }

    if (!bisnis.desa) {

        alert(
            "Desa wajib dipilih."
        );

        return;

    }

    if (!bisnis.produk) {

        alert(
            "Produk / jasa utama wajib diisi."
        );

        return;

    }


    /* ================================================
       MODE EDIT
    ================================================ */

    if (editMode) {

        const id =
            Number(
                document.getElementById(
                    "bisnisId"
                ).value
            );

        const index =
            dataBisnis.findIndex(
                item =>
                    Number(item.id) === id
            );

        if (index !== -1) {

            dataBisnis[index] = {
                ...dataBisnis[index],
                ...bisnis,
                id: id
            };

            alert(
                "Data bisnis berhasil diperbarui."
            );

        }

    }


    /* ================================================
       MODE TAMBAH
    ================================================ */

    else {

        const newId =
            getNextId();

        bisnis.id =
            newId;

        dataBisnis.push(
            bisnis
        );

        alert(
            "Bisnis berhasil ditambahkan."
        );

    }


    /* SAVE */
    saveToLocalStorage();

    /* UPDATE */
    updateStatistics();

    renderTable();

    resetForm();

}


/* =====================================================
   GET FORM DATA
===================================================== */

function getFormData() {

    return {

        nama:
            getValue("nama"),

        kategori:
            getValue("kategori"),

        desa:
            getValue("desa"),

        pemilik:
            getValue("pemilik"),

        produk:
            getValue("produk"),

        whatsapp:
            normalizeWhatsApp(
                getValue("whatsapp")
            ),

        alamat:
            getValue("alamat"),

        deskripsi:
            getValue("deskripsi"),

        gambar:
            getValue("gambar"),

        status:
            getValue("status") || "aktif"

    };

}


/* =====================================================
   GET VALUE
===================================================== */

function getValue(id) {

    const element =
        document.getElementById(id);

    if (!element) {
        return "";
    }

    return element.value.trim();

}


/* =====================================================
   NEXT ID
===================================================== */

function getNextId() {

    if (
        !Array.isArray(dataBisnis) ||
        dataBisnis.length === 0
    ) {

        return 1;

    }

    const ids =
        dataBisnis
            .map(item =>
                Number(item.id) || 0
            );

    return Math.max(...ids) + 1;

}


/* =====================================================
   RENDER TABLE
===================================================== */

function renderTable() {

    const tbody =
        document.getElementById(
            "bisnisTableBody"
        );

    if (!tbody) {

        console.warn(
            "BISNIS ADMIN: #bisnisTableBody tidak ditemukan."
        );

        return;

    }


    const search =
        (
            getValue("searchBisnis")
        ).toLowerCase();


    const kategori =
        getValue(
            "filterKategori"
        );


    const status =
        getValue(
            "filterStatus"
        );


    let filtered =
        [...dataBisnis];


    /* SEARCH */

    if (search) {

        filtered =
            filtered.filter(item => {

                const text = [

                    item.nama,

                    item.kategori,

                    item.desa,

                    item.pemilik,

                    item.produk

                ]
                    .join(" ")
                    .toLowerCase();

                return text.includes(
                    search
                );

            });

    }


    /* FILTER KATEGORI */

    if (kategori) {

        filtered =
            filtered.filter(
                item =>
                    String(
                        item.kategori || ""
                    ) === kategori
            );

    }


    /* FILTER STATUS */

    if (status) {

        filtered =
            filtered.filter(
                item =>
                    String(
                        item.status || "aktif"
                    ) === status
            );

    }


    /* EMPTY */

    if (filtered.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td colspan="8"
                    class="text-center py-5 text-muted">

                    <i class="fa-solid fa-store-slash fa-2x mb-3 d-block"></i>

                    Tidak ada data bisnis
                    yang sesuai.

                </td>

            </tr>

        `;

        return;

    }


    /* TABLE */

    tbody.innerHTML =
        filtered
            .map(
                (item, index) =>
                    createTableRow(
                        item,
                        index
                    )
            )
            .join("");

}


/* =====================================================
   CREATE TABLE ROW
===================================================== */

function createTableRow(
    item,
    index
) {

    const status =
        item.status || "aktif";


    const statusBadge =
        status === "aktif"

            ? `
                <span class="badge bg-success">
                    Aktif
                </span>
              `

            : `
                <span class="badge bg-secondary">
                    Nonaktif
                </span>
              `;


    const whatsapp =
        normalizeWhatsApp(
            item.whatsapp
        );


    const waButton =
        whatsapp

            ? `
                <a
                    href="https://wa.me/${whatsapp}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-sm btn-success"
                    title="WhatsApp"
                >
                    <i class="fa-brands fa-whatsapp"></i>
                </a>
              `

            : "";


    return `

        <tr>

            <td>
                ${index + 1}
            </td>


            <td>

                <div class="d-flex align-items-center">

                    ${
                        item.gambar

                        ? `
                            <img
                                src="${escapeHTML(
                                    item.gambar
                                )}"
                                alt="${escapeHTML(
                                    item.nama || "Bisnis"
                                )}"
                                class="bisnis-table-image"
                                onerror="
                                    this.onerror=null;
                                    this.style.display='none';
                                "
                            >
                          `

                        : `
                            <div class="bisnis-table-placeholder">
                                <i class="fa-solid fa-store"></i>
                            </div>
                          `
                    }


                    <div class="ms-2">

                        <strong>
                            ${escapeHTML(
                                item.nama ||
                                "-"
                            )}
                        </strong>

                        <small class="d-block text-muted">
                            ${escapeHTML(
                                item.produk ||
                                "-"
                            )}
                        </small>

                    </div>

                </div>

            </td>


            <td>
                <span class="badge bg-light text-dark">
                    ${escapeHTML(
                        item.kategori ||
                        "-"
                    )}
                </span>
            </td>


            <td>
                ${escapeHTML(
                    item.desa ||
                    "-"
                )}
            </td>


            <td>
                ${escapeHTML(
                    item.pemilik ||
                    "-"
                )}
            </td>


            <td>

                ${
                    whatsapp

                    ? `
                        <small>
                            ${escapeHTML(
                                item.whatsapp ||
                                ""
                            )}
                        </small>
                      `

                    : `
                        <span class="text-muted">
                            -
                        </span>
                      `
                }

            </td>


            <td>
                ${statusBadge}
            </td>


            <td class="text-end">

                <div class="btn-group">

                    <button
                        type="button"
                        class="btn btn-sm btn-outline-primary"
                        onclick="lihatDetailBisnis(${Number(item.id)})"
                        title="Detail"
                    >
                        <i class="fa-solid fa-eye"></i>
                    </button>


                    <button
                        type="button"
                        class="btn btn-sm btn-outline-warning"
                        onclick="editBisnis(${Number(item.id)})"
                        title="Edit"
                    >
                        <i class="fa-solid fa-pen"></i>
                    </button>


                    ${waButton}


                    <button
                        type="button"
                        class="btn btn-sm btn-outline-danger"
                        onclick="hapusBisnis(${Number(item.id)})"
                        title="Hapus"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>

            </td>

        </tr>

    `;

}


/* =====================================================
   EDIT BISNIS
===================================================== */

function editBisnis(id) {

    const bisnis =
        dataBisnis.find(
            item =>
                Number(item.id) ===
                Number(id)
        );

    if (!bisnis) {

        alert(
            "Data bisnis tidak ditemukan."
        );

        return;

    }


    editMode = true;


    setValue(
        "bisnisId",
        bisnis.id
    );

    setValue(
        "nama",
        bisnis.nama
    );

    setValue(
        "kategori",
        bisnis.kategori
    );

    setValue(
        "desa",
        bisnis.desa
    );

    setValue(
        "pemilik",
        bisnis.pemilik
    );

    setValue(
        "produk",
        bisnis.produk
    );

    setValue(
        "whatsapp",
        bisnis.whatsapp
    );

    setValue(
        "alamat",
        bisnis.alamat
    );

    setValue(
        "deskripsi",
        bisnis.deskripsi
    );

    setValue(
        "gambar",
        bisnis.gambar
    );

    setValue(
        "status",
        bisnis.status || "aktif"
    );


    const submitButton =
        document.querySelector(
            '#bisnisForm button[type="submit"]'
        );


    if (submitButton) {

        submitButton.innerHTML = `

            <i class="fa-solid fa-pen me-2"></i>

            Update Bisnis

        `;

    }


    /* Scroll ke form */

    const form =
        document.getElementById(
            "bisnisForm"
        );

    if (form) {

        form.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

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
            value ?? "";

    }

}


/* =====================================================
   RESET FORM
===================================================== */

function resetForm() {

    const form =
        document.getElementById(
            "bisnisForm"
        );

    if (form) {

        form.reset();

    }


    setValue(
        "bisnisId",
        ""
    );


    editMode = false;


    const submitButton =
        document.querySelector(
            '#bisnisForm button[type="submit"]'
        );


    if (submitButton) {

        submitButton.innerHTML = `

            <i class="fa-solid fa-floppy-disk me-2"></i>

            Simpan Bisnis

        `;

    }

}


/* =====================================================
   DETAIL BISNIS
===================================================== */

function lihatDetailBisnis(id) {

    const bisnis =
        dataBisnis.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!bisnis) {

        alert(
            "Data bisnis tidak ditemukan."
        );

        return;

    }


    const container =
        document.getElementById(
            "detailBisnisContent"
        );


    if (!container) {

        return;

    }


    const whatsapp =
        normalizeWhatsApp(
            bisnis.whatsapp
        );


    const waLink =
        whatsapp

            ? `
                <a
                    href="https://wa.me/${whatsapp}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-success"
                >
                    <i class="fa-brands fa-whatsapp me-2"></i>
                    Hubungi WhatsApp
                </a>
              `

            : "";


    container.innerHTML = `

        <div class="row g-4">

            <div class="col-md-5">

                ${
                    bisnis.gambar

                    ? `
                        <img
                            src="${escapeHTML(
                                bisnis.gambar
                            )}"
                            class="img-fluid rounded shadow-sm w-100"
                            alt="${escapeHTML(
                                bisnis.nama
                            )}"
                            onerror="
                                this.onerror=null;
                                this.src='assets/images/umkm/default.jpg';
                            "
                        >
                      `

                    : `
                        <div
                            class="bg-light rounded p-5 text-center"
                        >
                            <i class="fa-solid fa-store fa-4x text-muted"></i>
                        </div>
                      `
                }

            </div>


            <div class="col-md-7">

                <span class="badge bg-primary mb-2">

                    ${escapeHTML(
                        bisnis.kategori ||
                        "Bisnis"
                    )}

                </span>


                <h3 class="fw-bold">

                    ${escapeHTML(
                        bisnis.nama ||
                        "-"
                    )}

                </h3>


                <p class="text-muted">

                    ${escapeHTML(
                        bisnis.deskripsi ||
                        "Belum ada deskripsi."
                    )}

                </p>


                <hr>


                <p>
                    <strong>Produk / Jasa:</strong><br>
                    ${escapeHTML(
                        bisnis.produk ||
                        "-"
                    )}
                </p>


                <p>
                    <strong>Pemilik:</strong><br>
                    ${escapeHTML(
                        bisnis.pemilik ||
                        "-"
                    )}
                </p>


                <p>
                    <strong>Desa:</strong><br>
                    ${escapeHTML(
                        bisnis.desa ||
                        "-"
                    )}
                </p>


                <p>
                    <strong>Alamat:</strong><br>
                    ${escapeHTML(
                        bisnis.alamat ||
                        "-"
                    )}
                </p>


                <div class="mt-4">

                    ${waLink}

                </div>

            </div>

        </div>

    `;


    const modalElement =
        document.getElementById(
            "detailBisnisModal"
        );


    if (
        modalElement &&
        typeof bootstrap !== "undefined"
    ) {

        const modal =
            bootstrap.Modal.getOrCreateInstance(
                modalElement
            );

        modal.show();

    }

}


/* =====================================================
   HAPUS BISNIS
===================================================== */

function hapusBisnis(id) {

    const bisnis =
        dataBisnis.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!bisnis) {

        return;

    }


    const kon