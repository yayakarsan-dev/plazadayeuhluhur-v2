/* =====================================================
   PLAZA DAYEUHLUHUR
   BISNIS ADMIN V1
   Kelola Direktori Bisnis Lokal
===================================================== */

"use strict";

/* =====================================================
   KONFIGURASI
===================================================== */

const BISNIS_STORAGE_KEY = "plaza_dayeuhluhur_bisnis";
const BISNIS_JSON_URL = "data/bisnis.json";

let bisnisData = [];
let bisnisEditId = null;


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

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

        bindEvents();

        await loadBisnisData();

        updateStatistics();

        renderBisnisTable();

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
   EVENT
===================================================== */

function bindEvents() {

    /* FORM TAMBAH / EDIT */

    const form =
        document.getElementById("bisnisForm");

    if (form) {

        form.addEventListener(
            "submit",
            handleSubmit
        );

    }


    /* RESET */

    const resetButton =
        document.getElementById("btnReset");

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetForm
        );

    }


    /* REFRESH */

    const refreshButton =
        document.getElementById("btnRefresh");

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            async function () {

                await loadBisnisData();

                updateStatistics();

                renderBisnisTable();

            }
        );

    }


    /* SEARCH */

    const search =
        document.getElementById("searchBisnis");

    if (search) {

        search.addEventListener(
            "input",
            renderBisnisTable
        );

    }


    /* FILTER KATEGORI */

    const kategori =
        document.getElementById(
            "filterKategori"
        );

    if (kategori) {

        kategori.addEventListener(
            "change",
            renderBisnisTable
        );

    }


    /* FILTER STATUS */

    const status =
        document.getElementById(
            "filterStatus"
        );

    if (status) {

        status.addEventListener(
            "change",
            renderBisnisTable
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
     * PRIORITAS 1
     * Baca localStorage
     */

    try {

        const localData =
            localStorage.getItem(
                BISNIS_STORAGE_KEY
            );


        if (localData) {

            const parsed =
                JSON.parse(localData);


            if (Array.isArray(parsed)) {

                bisnisData = parsed;

                console.log(
                    "Data bisnis dimuat dari localStorage:",
                    bisnisData
                );

                return;

            }

        }

    } catch (error) {

        console.warn(
            "localStorage bisnis tidak dapat dibaca.",
            error
        );

    }


    /*
     * PRIORITAS 2
     * Jika localStorage belum ada,
     * baca data/bisnis.json
     */

    try {

        const response =
            await fetch(
                BISNIS_JSON_URL,
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "bisnis.json gagal dimuat. Status: " +
                response.status
            );

        }


        const data =
            await response.json();


        bisnisData =
            Array.isArray(data)
                ? data
                : [];


        saveLocalData();


        console.log(
            "Data bisnis dimuat dari bisnis.json:",
            bisnisData
        );


    } catch (error) {

        console.error(
            "BISNIS ADMIN: Gagal memuat data bisnis.",
            error
        );

        bisnisData = [];

    }

}


/* =====================================================
   SAVE LOCAL STORAGE
===================================================== */

function saveLocalData() {

    try {

        localStorage.setItem(
            BISNIS_STORAGE_KEY,
            JSON.stringify(bisnisData)
        );


        console.log(
            "Data bisnis berhasil disimpan ke localStorage:",
            bisnisData
        );


        return true;

    } catch (error) {

        console.error(
            "BISNIS ADMIN: Gagal menyimpan localStorage.",
            error
        );


        alert(
            "Data bisnis tidak dapat disimpan di browser."
        );


        return false;

    }

}


/* =====================================================
   SUBMIT FORM
===================================================== */

function handleSubmit(event) {

    event.preventDefault();


    const data =
        getFormData();


    /* VALIDASI */

    if (!data.nama) {

        alert(
            "Nama bisnis wajib diisi."
        );

        return;

    }


    if (!data.kategori) {

        alert(
            "Kategori bisnis wajib dipilih."
        );

        return;

    }


    if (!data.desa) {

        alert(
            "Desa wajib dipilih."
        );

        return;

    }


    if (!data.produk) {

        alert(
            "Produk / jasa utama wajib diisi."
        );

        return;

    }


    /*
     * MODE EDIT
     */

    if (bisnisEditId !== null) {

        updateBisnis(data);

        return;

    }


    /*
     * MODE TAMBAH
     */

    addBisnis(data);

}


/* =====================================================
   GET FORM DATA
===================================================== */

function getFormData() {

    const nama =
        getValue("nama");

    const kategori =
        getValue("kategori");

    const desa =
        getValue("desa");

    const pemilik =
        getValue("pemilik");

    const produk =
        getValue("produk");

    const whatsapp =
        getValue("whatsapp");

    const alamat =
        getValue("alamat");

    const deskripsi =
        getValue("deskripsi");

    const gambar =
        getValue("gambar");

    const status =
        getValue("status") || "aktif";


    return {

        nama: nama,

        kategori: kategori,

        desa: desa,

        pemilik: pemilik,

        produk: produk,

        whatsapp:
            normalizeWhatsApp(whatsapp),

        alamat: alamat,

        deskripsi: deskripsi,

        gambar: gambar,

        status: status

    };

}


/* =====================================================
   TAMBAH BISNIS
===================================================== */

function addBisnis(data) {

    const nextId =
        getNextId();


    const newBisnis = {

        id: nextId,

        nama: data.nama,

        kategori: data.kategori,

        desa: data.desa,

        pemilik: data.pemilik,

        produk: data.produk,

        whatsapp: data.whatsapp,

        alamat: data.alamat,

        deskripsi: data.deskripsi,

        gambar: data.gambar,

        status: data.status

    };


    /*
     * Masukkan ke array
     */

    bisnisData.push(
        newBisnis
    );


    /*
     * Simpan
     */

    const berhasil =
        saveLocalData();


    if (!berhasil) {

        /*
         * Jika gagal simpan,
         * rollback data
         */

        bisnisData.pop();

        return;

    }


    /*
     * Refresh tampilan
     */

    updateStatistics();

    renderBisnisTable();

    resetForm();


    alert(
        "Bisnis berhasil ditambahkan."
    );


    console.log(
        "BISNIS BARU:",
        newBisnis
    );

}


/* =====================================================
   UPDATE BISNIS
===================================================== */

function updateBisnis(data) {

    const index =
        bisnisData.findIndex(
            function (item) {

                return String(item.id) ===
                    String(bisnisEditId);

            }
        );


    if (index === -1) {

        alert(
            "Data bisnis yang akan diperbarui tidak ditemukan."
        );

        resetForm();

        return;

    }


    bisnisData[index] = {

        ...bisnisData[index],

        nama: data.nama,

        kategori: data.kategori,

        desa: data.desa,

        pemilik: data.pemilik,

        produk: data.produk,

        whatsapp: data.whatsapp,

        alamat: data.alamat,

        deskripsi: data.deskripsi,

        gambar: data.gambar,

        status: data.status

    };


    const berhasil =
        saveLocalData();


    if (!berhasil) {

        return;

    }


    updateStatistics();

    renderBisnisTable();

    resetForm();


    alert(
        "Data bisnis berhasil diperbarui."
    );

}


/* =====================================================
   EDIT BISNIS
===================================================== */

function editBisnis(id) {

    const item =
        bisnisData.find(
            function (bisnis) {

                return String(bisnis.id) ===
                    String(id);

            }
        );


    if (!item) {

        alert(
            "Data bisnis tidak ditemukan."
        );

        return;

    }


    bisnisEditId =
        item.id;


    setValue(
        "bisnisId",
        item.id
    );

    setValue(
        "nama",
        item.nama
    );

    setValue(
        "kategori",
        item.kategori
    );

    setValue(
        "desa",
        item.desa
    );

    setValue(
        "pemilik",
        item.pemilik
    );

    setValue(
        "produk",
        item.produk
    );

    setValue(
        "whatsapp",
        item.whatsapp
    );

    setValue(
        "alamat",
        item.alamat
    );

    setValue(
        "deskripsi",
        item.deskripsi
    );

    setValue(
        "gambar",
        item.gambar
    );

    setValue(
        "status",
        item.status || "aktif"
    );


    /*
     * Ubah tombol menjadi UPDATE
     */

    const submitButton =
        document.querySelector(
            '#bisnisForm button[type="submit"]'
        );


    if (submitButton) {

        submitButton.innerHTML =
            '<i class="fa-solid fa-pen-to-square me-2"></i>' +
            'Update Bisnis';

    }


    /*
     * Scroll ke form
     */

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
   HAPUS BISNIS
===================================================== */

function deleteBisnis(id) {

    const item =
        bisnisData.find(
            function (bisnis) {

                return String(bisnis.id) ===
                    String(id);

            }
        );


    if (!item) {

        alert(
            "Data bisnis tidak ditemukan."
        );

        return;

    }


    const yakin =
        confirm(
            'Hapus bisnis "' +
            item.nama +
            '"?'
        );


    if (!yakin) {

        return;

    }


    bisnisData =
        bisnisData.filter(
            function (bisnis) {

                return String(bisnis.id) !==
                    String(id);

            }
        );


    const berhasil =
        saveLocalData();


    if (!berhasil) {

        return;

    }


    updateStatistics();

    renderBisnisTable();


    if (
        bisnisEditId !== null &&
        String(bisnisEditId) === String(id)
    ) {

        resetForm();

    }


    alert(
        "Bisnis berhasil dihapus."
    );

}


/* =====================================================
   DETAIL BISNIS
===================================================== */

function showDetail(id) {

    const item =
        bisnisData.find(
            function (bisnis) {

                return String(bisnis.id) ===
                    String(id);

            }
        );


    if (!item) {

        alert(
            "Data bisnis tidak ditemukan."
        );

        return;

    }


    const content =
        document.getElementById(
            "detailBisnisContent"
        );


    if (!content) {

        return;

    }


    const gambar =
        item.gambar ||
        "assets/images/bisnis/default.jpg";


    const whatsapp =
        normalizeWhatsApp(
            item.whatsapp
        );


    const pesan =
        "Halo, saya ingin mengetahui informasi tentang " +
        (item.nama || "bisnis") +
        ".";


    const waLink =
        whatsapp
            ? "https://wa.me/" +
              whatsapp +
              "?text=" +
              encodeURIComponent(pesan)
            : "";


    content.innerHTML = `

        <div class="row g-4">

            <div class="col-md-5">

                <img
                    src="${escapeHTML(gambar)}"
                    class="detail-business-image w-100"
                    alt="${escapeHTML(item.nama || "Bisnis")}"
                    onerror="this.onerror=null;this.src='assets/images/umkm/default.jpg';"
                >

            </div>


            <div class="col-md-7">

                <h3 class="fw-bold mb-1">

                    ${escapeHTML(
                        item.nama || "-"
                    )}

                </h3>


                <span class="business-category mb-3">

                    ${escapeHTML(
                        item.kategori || "Bisnis"
                    )}

                </span>


                <div class="row g-3 mt-2">


                    <div class="col-6">

                        <div class="detail-label">
                            Desa
                        </div>

                        <div class="detail-value">

                            ${escapeHTML(
                                item.desa || "-"
                            )}

                        </div>

                    </div>


                    <div class="col-6">

                        <div class="detail-label">
                            Pemilik
                        </div>

                        <div class="detail-value">

                            ${escapeHTML(
                                item.pemilik || "-"
                            )}

                        </div>

                    </div>


                    <div class="col-12">

                        <div class="detail-label">
                            Produk / Jasa
                        </div>

                        <div class="detail-value">

                            ${escapeHTML(
                                item.produk || "-"
                            )}

                        </div>

                    </div>


                    <div class="col-12">

                        <div class="detail-label">
                            Alamat
                        </div>

                        <div class="detail-value">

                            ${escapeHTML(
                                item.alamat || "-"
                            )}

                        </div>

                    </div>


                    <div class="col-12">

                        <div class="detail-label">
                            Deskripsi
                        </div>

                        <div>

                            ${escapeHTML(
                                item.deskripsi || "-"
                            )}

                        </div>

                    </div>


                    <div class="col-12">

                        <div class="detail-label">
                            Status
                        </div>

                        <div>

                            ${
                                item.status === "nonaktif"
                                    ? "Nonaktif"
                                    : "Aktif"
                            }

                        </div>

                    </div>

                </div>


                ${
                    whatsapp
                        ? `

                            <a
                                href="${waLink}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="btn btn-success mt-4"
                            >

                                <i class="fa-brands fa-whatsapp me-2"></i>

                                Hubungi via WhatsApp

                            </a>

                          `
                        : ""
                }


            </div>

        </div>

    `;


    /*
     * Bootstrap Modal
     */

    const modalElement =
        document.getElementById(
            "detailBisnisModal"
        );


    if (
        modalElement &&
        typeof bootstrap !== "undefined" &&
        bootstrap.Modal
    ) {

        const modal =
            bootstrap.Modal.getOrCreateInstance(
                modalElement
            );

        modal.show();

    }

}


/* =====================================================
   RENDER TABLE
===================================================== */

function renderBisnisTable() {

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
        getValue(
            "searchBisnis"
        )
        .toLowerCase()
        .trim();


    const kategori =
        getValue(
            "filterKategori"
        );


    const status =
        getValue(
            "filterStatus"
        );


    const filtered =
        bisnisData.filter(
            function (item) {


                const searchable = [

                    item.nama,

                    item.kategori,

                    item.desa,

                    item.pemilik,

                    item.produk,

                    item.alamat

                ]
                    .map(function (value) {

                        return String(
                            value || ""
                        );

                    })
                    .join(" ")
                    .toLowerCase();


                const cocokSearch =
                    !search ||
                    searchable.includes(
                        search
                    );


                const cocokKategori =
                    !kategori ||
                    item.kategori ===
                    kategori;


                const cocokStatus =
                    !status ||
                    (
                        item.status ||
                        "aktif"
                    ) === status;


                return (
                    cocokSearch &&
                    cocokKategori &&
                    cocokStatus
                );

            }
        );


    /*
     * Tidak ada data
     */

    if (
        filtered.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="text-center py-5"
                >

                    <div class="business-empty">

                        <div class="business-empty-icon">

                            <i
                                class="fa-solid fa-briefcase"
                            ></i>

                        </div>


                        <h5 class="fw-bold">

                            Belum ada bisnis

                        </h5>


                        <p class="text-muted mb-0">

                            Data bisnis yang sesuai
                            dengan pencarian belum tersedia.

                        </p>

                    </div>

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        filtered
            .map(
                function (item, index) {

                    return createBusinessRow(
                        item,
                        index
                    );

                }
            )
            .join("");

}


/* =====================================================
   TABLE ROW
===================================================== */

function createBusinessRow(
    item,
    index
) {

    const status =
        item.status || "aktif";


    const statusLabel =
        status === "aktif"
            ? "Aktif"
            : "Nonaktif";


    const whatsapp =
        normalizeWhatsApp(
            item.whatsapp
        );


    const waHtml =
        whatsapp
            ? `

                <a
                    href="https://wa.me/${whatsapp}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="business-wa"
                >

                    <i
                        class="fa-brands fa-whatsapp me-1"
                    ></i>

                    ${escapeHTML(
                        item.whatsapp
                    )}

                </a>

              `
            : `

                <span class="text-muted">
                    -
                </span>

              `;


    return `

        <tr>

            <!-- NO -->

            <td>
                ${index + 1}
            </td>


            <!-- BISNIS -->

            <td>

                <div class="business-name">

                    ${escapeHTML(
                        item.nama || "-"
                    )}

                </div>


                <div class="business-product">

                    ${escapeHTML(
                        item.produk || "-"
                    )}

                </div>

            </td>


            <!-- KATEGORI -->

            <td>

                <span class="business-category">

                    ${escapeHTML(
                        item.kategori || "-"
                    )}

                </span>

            </td>


            <!-- DESA -->

            <td>

                <span class="business-location">

                    <i
                        class="fa-solid fa-location-dot me-1"
                    ></i>

                    ${escapeHTML(
                        item.desa || "-"
                    )}

                </span>

            </td>


            <!-- PEMILIK -->

            <td>

                ${escapeHTML(
                    item.pemilik || "-"
                )}

            </td>


            <!-- WHATSAPP -->

            <td>

                ${waHtml}

            </td>


            <!-- STATUS -->

            <td>

                <span
                    class="status-badge status-${status}"
                >

                    <i
                        class="fa-solid ${
                            status === "aktif"
                                ? "fa-circle-check"
                                : "fa-circle-xmark"
                        }"
                    ></i>

                    ${statusLabel}

                </span>

            </td>


            <!-- AKSI -->

            <td>

                <div class="business-actions">


                    <!-- DETAIL -->

                    <button
                        type="button"
                        class="btn btn-outline-info"
                        title="Detail"
                        onclick="showDetail('${escapeJS(item.id)}')"
                    >

                        <i
                            class="fa-solid fa-eye"
                        ></i>

                    </button>


                    <!-- EDIT -->

                    <button
                        type="button"
                        class="btn btn-outline-primary"
                        title="Edit"
                        onclick="editBisnis('${escapeJS(item.id)}')"
                    >

                        <i
                            class="fa-solid fa-pen"
                        ></i>

                    </button>


                    <!-- HAPUS -->

                    <button
                        type="button"
                        class="btn btn-outline-danger"
                        title="Hapus"
                        onclick="deleteBisnis('${escapeJS(item.id)}')"
                    >

                        <i
                            class="fa-solid fa-trash"
                        ></i>

                    </button>


                </div>

            </td>

        </tr>

    `;

}


/* =====================================================
   STATISTICS
===================================================== */

function updateStatistics() {

    const total =
        Array.isArray(bisnisData)
            ? bisnisData.length
            : 0;


    const aktif =
        Array.isArray(bisnisData)
            ? bisnisData.filter(
                function (item) {

                    return (
                        item.status ||
                        "aktif"
                    ) === "aktif";

                }
            ).length
            : 0;


    const desaSet =
        new Set();


    if (
        Array.isArray(bisnisData)
    ) {

        bisnisData.forEach(
            function (item) {

                if (
                    item.desa &&
                    String(item.desa).trim()
                ) {

                    desaSet.add(
                        String(
                            item.desa
                        ).trim()
                    );

                }

            }
        );

    }


    setText(
        "totalBisnis",
        total
    );


    setText(
        "bisnisAktif",
        aktif
    );


    setText(
        "totalDesa",
        desaSet.size
    );


    console.log(
        "STATISTIK BISNIS:",
        {
            total: total,
            aktif: aktif,
            desa: desaSet.size
        }
    );

}


/* =====================================================
   RESET FORM
===================================================== */

function resetForm() {

    bisnisEditId =
        null;


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


    const submitButton =
        document.querySelector(
            '#bisnisForm button[type="submit"]'
        );


    if (submitButton) {

        submitButton.innerHTML =
            '<i class="fa-solid fa-floppy-disk me-2"></i>' +
            'Simpan Bisnis';

    }

}


/* =====================================================
   NEXT ID
===================================================== */

function getNextId() {

    if (
        !Array.isArray(bisnisData) ||
        bisnisData.length === 0
    ) {

        return 1;

    }


    const ids =
        bisnisData
            .map(
                function (item) {

                    return Number(
                        item.id
                    );

                }
            )
            .filter(
                Number.isFinite
            );


    if (
        ids.length === 0
    ) {

        return (
            bisnisData.length + 1
        );

    }


    return (
        Math.max(...ids) + 1
    );

}


/* =====================================================
   SHOW TABLE MESSAGE
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

                    ${escapeHTML(
                        message
                    )}

                </div>

            </td>

        </tr>

    `;

}


/* =====================================================
   HELPER GET VALUE
===================================================== */

function getValue(id) {

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


/* =====================================================
   HELPER SET VALUE
===================================================== */

function setValue(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return;

    }


    element.value =
        value ?? "";

}


/* =====================================================
   HELPER SET TEXT
===================================================== */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return;

    }


    element.textContent =
        value ?? "";

}


/* =====================================================
   NORMALISASI WHATSAPP
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


    /*
     * 0812xxxx
     * menjadi
     * 62812xxxx
     */

    if (
        wa.startsWith("0")
    ) {

        wa =
            "62" +
            wa.substring(1);

    }


    /*
     * +62812xxxx
     * menjadi
     * 62812xxxx
     */

    if (
        wa.startsWith("+62")
    ) {

        wa =
            wa.substring(1);

    }


    /*
     * Jika diawali 62
     * sudah benar
     */

    return wa;

}


/* =====================================================
   SECURITY HTML
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
   SECURITY JAVASCRIPT
===================================================== */

function escapeJS(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        );

}


/* =====================================================
   SELESAI
===================================================== */

console.log(
    "BISNIS ADMIN JS berhasil dimuat."
);