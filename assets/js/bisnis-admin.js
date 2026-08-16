/* =====================================================
   PLAZA DAYEUHLUHUR
   BISNIS ADMIN FINAL
   Kelola Direktori Bisnis Lokal
===================================================== */

"use strict";

/* =====================================================
   KONFIGURASI
===================================================== */

const BISNIS_DATA_URL = "data/bisnis.json";
const BISNIS_STORAGE_KEY = "plaza_dayeuhluhur_bisnis";

let dataBisnis = [];
let editMode = false;


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("====================================");
    console.log("BISNIS ADMIN FINAL");
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


    /* =================================================
       PRIORITAS 1
       LOCAL STORAGE
    ================================================== */

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
                "localStorage bisnis tidak valid."
            );

        }

    }


    /* =================================================
       PRIORITAS 2
       BISNIS.JSON
    ================================================== */

    const response =
        await fetch(
            BISNIS_DATA_URL,
            {
                cache: "no-store"
            }
        );


    if (!response.ok) {

        throw new Error(
            "Gagal membaca bisnis.json. Status: " +
            response.status
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


    localStorage.setItem(
        BISNIS_STORAGE_KEY,
        JSON.stringify(dataBisnis)
    );


    console.log(
        "Data bisnis dimuat dari bisnis.json:",
        dataBisnis
    );

}


/* =====================================================
   BIND EVENTS
===================================================== */

function bindEvents() {

    const form =
        document.getElementById("bisnisForm");

    if (form) {

        form.addEventListener(
            "submit",
            simpanBisnis
        );

    }


    const resetButton =
        document.getElementById("btnReset");

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetForm
        );

    }


    const refreshButton =
        document.getElementById("btnRefresh");

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            async () => {

                await refreshData();

            }
        );

    }


    const search =
        document.getElementById("searchBisnis");

    if (search) {

        search.addEventListener(
            "input",
            renderTable
        );

    }


    const filterKategori =
        document.getElementById("filterKategori");

    if (filterKategori) {

        filterKategori.addEventListener(
            "change",
            renderTable
        );

    }


    const filterStatus =
        document.getElementById("filterStatus");

    if (filterStatus) {

        filterStatus.addEventListener(
            "change",
            renderTable
        );

    }


    /* =================================================
       EXPORT JSON
    ================================================== */

    const exportButton =
        document.getElementById("btnExportJSON");

    if (exportButton) {

        exportButton.addEventListener(
            "click",
            exportBisnisJSON
        );

    }

}


/* =====================================================
   SIMPAN BISNIS
===================================================== */

function simpanBisnis(event) {

    event.preventDefault();


    const idElement =
        document.getElementById("bisnisId");

    const namaElement =
        document.getElementById("nama");

    const kategoriElement =
        document.getElementById("kategori");

    const desaElement =
        document.getElementById("desa");

    const pemilikElement =
        document.getElementById("pemilik");

    const produkElement =
        document.getElementById("produk");

    const whatsappElement =
        document.getElementById("whatsapp");

    const alamatElement =
        document.getElementById("alamat");

    const deskripsiElement =
        document.getElementById("deskripsi");

    const gambarElement =
        document.getElementById("gambar");

    const statusElement =
        document.getElementById("status");


    const nama =
        namaElement
            ? namaElement.value.trim()
            : "";


    const kategori =
        kategoriElement
            ? kategoriElement.value.trim()
            : "";


    const desa =
        desaElement
            ? desaElement.value.trim()
            : "";


    const pemilik =
        pemilikElement
            ? pemilikElement.value.trim()
            : "";


    const produk =
        produkElement
            ? produkElement.value.trim()
            : "";


    const whatsapp =
        normalizeWhatsApp(
            whatsappElement
                ? whatsappElement.value
                : ""
        );


    const alamat =
        alamatElement
            ? alamatElement.value.trim()
            : "";


    const deskripsi =
        deskripsiElement
            ? deskripsiElement.value.trim()
            : "";


    const gambar =
        gambarElement
            ? gambarElement.value.trim()
            : "";


    const status =
        statusElement
            ? statusElement.value
            : "aktif";


    /* =================================================
       VALIDASI
    ================================================== */

    if (!nama) {

        alert(
            "Nama bisnis wajib diisi."
        );

        if (namaElement) {
            namaElement.focus();
        }

        return;

    }


    if (!kategori) {

        alert(
            "Kategori bisnis wajib dipilih."
        );

        if (kategoriElement) {
            kategoriElement.focus();
        }

        return;

    }


    if (!desa) {

        alert(
            "Desa wajib dipilih."
        );

        if (desaElement) {
            desaElement.focus();
        }

        return;

    }


    if (!produk) {

        alert(
            "Produk / jasa wajib diisi."
        );

        if (produkElement) {
            produkElement.focus();
        }

        return;

    }


    /* =================================================
       ID
    ================================================== */

    const idValue =
        idElement
            ? idElement.value
            : "";


    /* =================================================
       MODE EDIT
    ================================================== */

    if (
        editMode &&
        idValue
    ) {

        const index =
            dataBisnis.findIndex(
                item =>
                    Number(item.id) ===
                    Number(idValue)
            );


        if (index !== -1) {

            const oldData =
                dataBisnis[index];


            dataBisnis[index] =
                buildBisnisObject(
                    Number(idValue),
                    nama,
                    kategori,
                    desa,
                    pemilik,
                    produk,
                    whatsapp,
                    alamat,
                    deskripsi,
                    gambar,
                    status,
                    oldData
                );


            saveToLocalStorage();


            showNotification(
                "Data bisnis berhasil diperbarui."
            );

        }


    } else {

        /* =============================================
           TAMBAH DATA BARU
        ============================================== */

        const newId =
            getNextId();


        const newBisnis =
            buildBisnisObject(
                newId,
                nama,
                kategori,
                desa,
                pemilik,
                produk,
                whatsapp,
                alamat,
                deskripsi,
                gambar,
                status,
                null
            );


        dataBisnis.push(
            newBisnis
        );


        saveToLocalStorage();


        showNotification(
            "Bisnis baru berhasil disimpan."
        );

    }


    /* =================================================
       REFRESH TAMPILAN
    ================================================== */

    updateStatistics();

    renderTable();

    resetForm();


    console.log(
        "Data bisnis terbaru:",
        dataBisnis
    );

}


/* =====================================================
   BUILD OBJECT
===================================================== */

function buildBisnisObject(
    id,
    nama,
    kategori,
    desa,
    pemilik,
    produk,
    whatsapp,
    alamat,
    deskripsi,
    gambar,
    status,
    oldData
) {

    const pesan =
        oldData &&
        oldData.pesan
            ? oldData.pesan
            : (
                "Halo " +
                nama +
                ", saya ingin mendapatkan informasi mengenai " +
                produk +
                "."
            );


    const cta =
        oldData &&
        oldData.cta
            ? oldData.cta
            : (
                whatsapp
                    ? "Hubungi via WhatsApp"
                    : "Hubungi Bisnis"
            );


    const verified =
        oldData &&
        typeof oldData.verified === "boolean"
            ? oldData.verified
            : false;


    return {

        id: id,

        nama: nama,

        kategori: kategori,

        desa: desa,

        pemilik: pemilik,

        produk: produk,

        alamat: alamat,

        deskripsi: deskripsi,

        gambar:
            gambar ||
            "assets/images/bisnis/default.jpg",

        wa: whatsapp,

        cta: cta,

        pesan: pesan,

        status: status,

        verified: verified

    };

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
            .map(
                item =>
                    Number(item.id)
            )
            .filter(
                id =>
                    !Number.isNaN(id)
            );


    return (
        Math.max(...ids) + 1
    );

}


/* =====================================================
   SAVE LOCAL STORAGE
===================================================== */

function saveToLocalStorage() {

    try {

        localStorage.setItem(
            BISNIS_STORAGE_KEY,
            JSON.stringify(
                dataBisnis
            )
        );


        console.log(
            "BISNIS ADMIN: Data berhasil disimpan ke localStorage."
        );


    } catch (error) {

        console.error(
            "BISNIS ADMIN: Gagal menyimpan localStorage.",
            error
        );


        alert(
            "Data gagal disimpan ke browser."
        );

    }

}


/* =====================================================
   UPDATE STATISTICS
===================================================== */

function updateStatistics() {

    const totalElement =
        document.getElementById(
            "totalBisnis"
        );


    const aktifElement =
        document.getElementById(
            "bisnisAktif"
        );


    const desaElement =
        document.getElementById(
            "totalDesa"
        );


    const total =
        dataBisnis.length;


    const aktif =
        dataBisnis.filter(
            item =>
                String(
                    item.status ||
                    "aktif"
                ).toLowerCase() ===
                "aktif"
        ).length;


    const desaUnik =
        new Set(
            dataBisnis
                .map(
                    item =>
                        item.desa
                )
                .filter(Boolean)
        ).size;


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (aktifElement) {

        aktifElement.textContent =
            aktif;

    }


    if (desaElement) {

        desaElement.textContent =
            desaUnik;

    }


    console.log(
        "STATISTIK BISNIS:",
        {
            total,
            aktif,
            desa: desaUnik
        }
    );

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

        return;

    }


    const searchElement =
        document.getElementById(
            "searchBisnis"
        );


    const kategoriElement =
        document.getElementById(
            "filterKategori"
        );


    const statusElement =
        document.getElementById(
            "filterStatus"
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
            : "";


    const status =
        statusElement
            ? statusElement.value
            : "";


    const filtered =
        dataBisnis.filter(
            item => {

                const text =
                    (
                        (item.nama || "") +
                        " " +
                        (item.kategori || "") +
                        " " +
                        (item.desa || "") +
                        " " +
                        (item.pemilik || "") +
                        " " +
                        (item.produk || "")
                    ).toLowerCase();


                const matchSearch =
                    !search ||
                    text.includes(search);


                const matchKategori =
                    !kategori ||
                    item.kategori ===
                    kategori;


                const itemStatus =
                    String(
                        item.status ||
                        "aktif"
                    ).toLowerCase();


                const matchStatus =
                    !status ||
                    itemStatus ===
                    status;


                return (
                    matchSearch &&
                    matchKategori &&
                    matchStatus
                );

            }
        );


    if (filtered.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="text-center py-5 text-muted"
                >

                    <i class="fa-solid
                              fa-database
                              fa-2x
                              mb-3">
                    </i>

                    <div>
                        Belum ada data bisnis.
                    </div>

                </td>

            </tr>

        `;

        return;

    }


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
   TABLE ROW
===================================================== */

function createTableRow(
    item,
    index
) {

    const status =
        String(
            item.status ||
            "aktif"
        ).toLowerCase();


    const statusBadge =
        status === "aktif"
            ?
            `
                <span class="badge bg-success">
                    Aktif
                </span>
            `
            :
            `
                <span class="badge bg-secondary">
                    Nonaktif
                </span>
            `;


    const verifiedBadge =
        item.verified
            ?
            `
                <i
                    class="fa-solid
                           fa-circle-check
                           text-primary ms-1"
                    title="Verified"
                ></i>
            `
            :
            "";


    return `

        <tr>

            <td>
                ${index + 1}
            </td>


            <td>

                <div class="fw-semibold">

                    ${escapeHTML(
                        item.nama ||
                        "-"
                    )}

                    ${verifiedBadge}

                </div>

                <small class="text-muted">

                    ${escapeHTML(
                        item.produk ||
                        "-"
                    )}

                </small>

            </td>


            <td>

                <span class="badge bg-primary">

                    ${escapeHTML(
                        item.kategori ||
                        "-"
                    )}

                </span>

            </td>


            <td>

                <i class="fa-solid
                          fa-location-dot
                          text-danger me-1">
                </i>

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
                    item.wa
                    ?
                    escapeHTML(
                        item.wa
                    )
                    :
                    '<span class="text-muted">-</span>'
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
                        title="Lihat Detail"
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
   DETAIL
===================================================== */

function lihatDetailBisnis(id) {

    const bisnis =
        dataBisnis.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!bisnis) {

        return;

    }


    const content =
        document.getElementById(
            "detailBisnisContent"
        );


    if (!content) {

        return;

    }


    content.innerHTML = `

        <div class="row g-4">


            <div class="col-md-5">

                <img
                    src="${
                        escapeHTML(
                            bisnis.gambar ||
                            "assets/images/bisnis/default.jpg"
                        )
                    }"
                    class="img-fluid rounded shadow-sm"
                    alt="${escapeHTML(
                        bisnis.nama ||
                        "Bisnis"
                    )}"
                    onerror="this.onerror=null;this.src='assets/images/bisnis/default.jpg';"
                >

            </div>


            <div class="col-md-7">

                <span class="badge bg-primary mb-2">

                    ${escapeHTML(
                        bisnis.kategori ||
                        "-"
                    )}

                </span>


                <h4 class="fw-bold">

                    ${escapeHTML(
                        bisnis.nama ||
                        "-"
                    )}

                </h4>


                <p class="mb-2">

                    <strong>Desa:</strong>
                    ${escapeHTML(
                        bisnis.desa ||
                        "-"
                    )}

                </p>


                <p class="mb-2">

                    <strong>Pemilik:</strong>
                    ${escapeHTML(
                        bisnis.pemilik ||
                        "-"
                    )}

                </p>


                <p class="mb-2">

                    <strong>Produk / Jasa:</strong>
                    ${escapeHTML(
                        bisnis.produk ||
                        "-"
                    )}

                </p>


                <p class="mb-2">

                    <strong>Alamat:</strong>
                    ${escapeHTML(
                        bisnis.alamat ||
                        "-"
                    )}

                </p>


                <p class="mb-3">

                    <strong>Status:</strong>

                    ${
                        String(
                            bisnis.status ||
                            "aktif"
                        ).toLowerCase() === "aktif"

                        ?
                        '<span class="badge bg-success ms-1">Aktif</span>'

                        :
                        '<span class="badge bg-secondary ms-1">Nonaktif</span>'
                    }

                </p>


                <div class="border-top pt-3">

                    <strong>
                        Deskripsi
                    </strong>

                    <p class="text-muted mt-2">

                        ${escapeHTML(
                            bisnis.deskripsi ||
                            "-"
                        )}

                    </p>

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
        bisnis.wa
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
        bisnis.status ||
        "aktif"
    );


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


    console.log(
        "Mode edit bisnis:",
        bisnis
    );

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


    const konfirmasi =
        confirm(
            "Hapus bisnis \"" +
            bisnis.nama +
            "\"?"
        );


    if (!konfirmasi) {

        return;

    }


    dataBisnis =
        dataBisnis.filter(
            item =>
                Number(item.id) !==
                Number(id)
        );


    saveToLocalStorage();


    updateStatistics();

    renderTable();


    showNotification(
        "Bisnis berhasil dihapus."
    );


    console.log(
        "Bisnis dihapus:",
        bisnis
    );

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


    setValue(
        "status",
        "aktif"
    );


    editMode = false;


    console.log(
        "Form bisnis direset."
    );

}


/* =====================================================
   REFRESH
===================================================== */

async function refreshData() {

    const button =
        document.getElementById(
            "btnRefresh"
        );


    if (button) {

        button.disabled = true;

    }


    try {

        const response =
            await fetch(
                BISNIS_DATA_URL,
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "HTTP " +
                response.status
            );

        }


        const json =
            await response.json();


        if (!Array.isArray(json)) {

            throw new Error(
                "Format JSON tidak valid."
            );

        }


        /*
         * Jangan menimpa localStorage
         * secara otomatis jika sudah ada
         * data hasil input Dashboard.
         */

        if (
            dataBisnis.length >
            json.length
        ) {

            console.warn(
                "Data localStorage lebih banyak daripada bisnis.json."
            );

            showNotification(
                "Data Dashboard masih memiliki data lokal yang belum diekspor."
            );

        } else {

            dataBisnis = json;

            saveToLocalStorage();

            updateStatistics();

            renderTable();

            showNotification(
                "Data bisnis berhasil diperbarui."
            );

        }


    } catch (error) {

        console.error(
            "Refresh bisnis gagal:",
            error
        );


        showNotification(
            "Data bisnis gagal dimuat."
        );

    }


    if (button) {

        button.disabled = false;

    }

}


/* =====================================================
   EXPORT BISNIS.JSON
===================================================== */

function exportBisnisJSON() {

    if (
        !Array.isArray(dataBisnis)
    ) {

        alert(
            "Data bisnis tidak tersedia."
        );

        return;

    }


    const json =
        JSON.stringify(
            dataBisnis,
            null,
            2
        );


    const blob =
        new Blob(
            [json],
            {
                type:
                    "application/json;charset=utf-8"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href = url;

    link.download =
        "bisnis.json";


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );


    showNotification(
        "bisnis.json berhasil dibuat."
    );


    console.log(
        "JSON berhasil diekspor:",
        dataBisnis
    );

}


/* =====================================================
   SHOW NOTIFICATION
===================================================== */

function showNotification(message) {

    const old =
        document.getElementById(
            "bisnisAdminNotification"
        );


    if (old) {

        old.remove();

    }


    const notification =
        document.createElement(
            "div"
        );


    notification.id =
        "bisnisAdminNotification";


    notification.className =
        "position-fixed top-0 end-0 m-3 alert alert-success shadow";


    notification.style.zIndex =
        "99999";


    notification.innerHTML = `

        <i class="fa-solid
                  fa-circle-check
                  me-2">
        </i>

        ${escapeHTML(message)}

    `;


    document.body.appendChild(
        notification
    );


    setTimeout(
        () => {

            notification.remove();

        },
        3000
    );

}


/* =====================================================
   TABLE MESSAGE
===================================================== */

function showTableMessage(
    message,
    type = "info"
) {

    const tbody =
        document.getElementById(
            "bisnisTableBody"
        );


    if (!tbody) {

        return;

    }


    tbody.innerHTML = `

        <tr>

            <td
                colspan="8"
                class="text-center py-5"
            >

                <div class="alert alert-${type} mb-0">

                    ${escapeHTML(message)}

                </div>

            </td>

        </tr>

    `;

}


/* =====================================================
   SET VALUE
===================================================== */

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
            value ?? "";

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
            .trim()
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


/* =====================================================
   GLOBAL ACCESS
===================================================== */

window.editBisnis =
    editBisnis;

window.hapusBisnis =
    hapusBisnis;

window.lihatDetailBisnis =
    lihatDetailBisnis;

window.exportBisnisJSON =
    exportBisnisJSON;