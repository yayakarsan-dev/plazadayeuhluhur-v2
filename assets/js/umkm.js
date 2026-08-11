/* =====================================================
   PLAZA DAYEUHLUHUR
   UMKM DIRECTORY ENGINE
   FINAL VERSION
===================================================== */


/* =====================================================
   INITIALIZATION
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("UMKM DIRECTORY ENGINE");
    console.log("FINAL VERSION");
    console.log("====================================");

    loadUmkm();

    setupUmkmSearch();

    setupUmkmFilter();

    setupMobileMenu();

    setupLogout();

    loadAdminProfile();

    setupAddUmkm();

});


/* =====================================================
   DATABASE UMKM
===================================================== */

async function loadUmkm() {

    console.log("Membaca database UMKM...");

    try {

        const response = await fetch(
            "data/umkm.json",
            {
                cache: "no-store"
            }
        );


        if (!response.ok) {

            throw new Error(
                "HTTP " +
                response.status +
                " - " +
                response.statusText
            );

        }


        const text =
            await response.text();


        if (!text.trim()) {

            throw new Error(
                "umkm.json kosong."
            );

        }


        let data;


        try {

            data =
                JSON.parse(text);

        } catch (error) {

            console.error(
                "Isi umkm.json:"
            );

            console.error(text);

            throw new Error(
                "umkm.json bukan JSON yang valid."
            );

        }


        if (!Array.isArray(data)) {

            throw new Error(
                "Format umkm.json harus berupa array."
            );

        }


        /* Simpan database ke global */

        window.plazaUmkm = data;


        console.log(
            "Berhasil membaca " +
            data.length +
            " data UMKM."
        );


        /* Statistik */

        updateUmkmStatistics(data);


        /* Render */

        renderUmkm(data);


    } catch (error) {

        console.error(
            "Gagal membaca database UMKM:",
            error
        );


        showUmkmError();

    }

}


/* =====================================================
   ERROR DATABASE
===================================================== */

function showUmkmError() {

    const tableBody =
        document.getElementById(
            "umkmTableBody"
        );


    const container =
        document.getElementById(
            "umkmContainer"
        );


    if (tableBody) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="text-center py-5 text-danger">

                    <i
                        class="fa-solid fa-triangle-exclamation">
                    </i>

                    <br>

                    Gagal membaca database UMKM.

                </td>

            </tr>

        `;

    }


    if (container) {

        container.innerHTML = `

            <div class="text-center py-5 text-danger">

                <i
                    class="fa-solid fa-triangle-exclamation fa-2x mb-3">
                </i>

                <h4>
                    Data UMKM belum dapat dimuat
                </h4>

                <p>
                    Silakan refresh halaman atau periksa
                    file data/umkm.json.
                </p>

            </div>

        `;

    }

}


/* =====================================================
   STATISTIK UMKM
===================================================== */

function updateUmkmStatistics(data) {

    /* TOTAL UMKM */

    setValue(
        "totalUmkm",
        data.length
    );


    /* UMKM BUKA */

    const totalBuka =
        data.filter(function (item) {

            return String(
                item.status || ""
            )
                .toLowerCase()
                .trim() === "buka";

        }).length;


    setValue(
        "totalUmkmBuka",
        totalBuka
    );


    /* KULINER */

    const totalKuliner =
        data.filter(function (item) {

            return String(
                item.kategori || ""
            )
                .toLowerCase()
                .trim() === "kuliner";

        }).length;


    setValue(
        "totalKuliner",
        totalKuliner
    );


    /* JUMLAH DESA */

    const desaSet =
        new Set();


    data.forEach(function (item) {

        if (
            item.desa &&
            String(item.desa).trim() !== ""
        ) {

            desaSet.add(
                String(item.desa).trim()
            );

        }

    });


    setValue(
        "totalUmkmDesa",
        desaSet.size
    );


    /* Statistik alternatif */

    setValue(
        "jumlahUmkm",
        data.length
    );

    setValue(
        "statTotalUmkm",
        data.length
    );

}


/* =====================================================
   RENDER UMKM
===================================================== */

function renderUmkm(data) {

    console.log(
        "Render UMKM:",
        data.length
    );


    /* =================================================
       1. TABLE ADMIN
    ================================================= */

    const tableBody =
        document.getElementById(
            "umkmTableBody"
        );


    if (tableBody) {

        renderUmkmTable(
            data,
            tableBody
        );

    }


    /* =================================================
       2. CARD DIRECTORY
    ================================================= */

    const container =
        document.getElementById(
            "umkmContainer"
        );


    if (container) {

        renderUmkmCards(
            data,
            container
        );

    }


    /* =================================================
       3. INDEX / PRODUCT SECTION
    ================================================= */

    const productContainer =
        document.getElementById(
            "umkmProducts"
        );


    if (productContainer) {

        renderUmkmCards(
            data.slice(0, 4),
            productContainer
        );

    }

}


/* =====================================================
   RENDER TABLE
===================================================== */

function renderUmkmTable(
    data,
    tableBody
) {

    if (!data.length) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="text-center py-4">

                    <i
                        class="fa-solid fa-store-slash">
                    </i>

                    <div>
                        Belum ada data UMKM.
                    </div>

                </td>

            </tr>

        `;

        return;

    }


    let html = "";


    data.forEach(
        function (item, index) {

            const status =
                item.status || "Buka";


            const statusClass =
                String(status)
                    .toLowerCase() === "buka"
                    ? "open"
                    : "closed";


            const gambar =
                item.gambar ||
                "assets/images/umkm/default.jpg";


            html += `

                <tr>

                    <td>
                        ${index + 1}
                    </td>


                    <td>

                        <div class="umkm-name">

                            <img
                                src="${escapeHtml(gambar)}"
                                class="umkm-image"
                                alt="${escapeHtml(item.nama || "UMKM")}"
                                onerror="this.onerror=null;this.src='assets/images/umkm/default.jpg';">


                            <div class="umkm-name-content">

                                <strong>
                                    ${escapeHtml(item.nama || "-")}
                                </strong>

                                <small>
                                    ${escapeHtml(item.produk || "-")}
                                </small>

                            </div>

                        </div>

                    </td>


                    <td>

                        <span class="umkm-category">

                            ${escapeHtml(item.kategori || "-")}

                        </span>

                    </td>


                    <td>
                        ${escapeHtml(item.desa || "-")}
                    </td>


                    <td>

                        <span class="umkm-rating">

                            <i class="fa-solid fa-star"></i>

                            <strong>
                                ${escapeHtml(item.rating || "0")}
                            </strong>

                        </span>

                    </td>


                    <td>

                        <span
                            class="umkm-status ${statusClass}">

                            <i class="fa-solid fa-circle"></i>

                            ${escapeHtml(status)}

                        </span>

                    </td>


                    <td>

                        <a
                            href="${escapeHtml(item.link || "#")}"
                            class="btn btn-sm btn-outline-secondary me-1"
                            target="_blank"
                            title="Lihat">

                            <i class="fa-solid fa-eye"></i>

                        </a>


                        <button
                            type="button"
                            class="btn btn-sm btn-outline-primary me-1"
                            onclick="editUmkm(${Number(item.id)})"
                            title="Edit">

                            <i class="fa-solid fa-pen"></i>

                        </button>


                        <button
                            type="button"
                            class="btn btn-sm btn-outline-danger"
                            onclick="deleteUmkm(${Number(item.id)})"
                            title="Hapus">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </td>

                </tr>

            `;

        }
    );


    tableBody.innerHTML =
        html;

}


/* =====================================================
   RENDER CARD UMKM
===================================================== */

function renderUmkmCards(
    data,
    container
) {

    if (!data.length) {

        container.innerHTML = `

            <div class="text-center py-5">

                <i
                    class="fa-solid fa-store-slash fa-2x mb-3">
                </i>

                <p>
                    Belum ada data UMKM.
                </p>

            </div>

        `;

        return;

    }


    let html = "";


    data.forEach(
        function (umkm) {

            const gambar =
                umkm.gambar ||
                "assets/images/umkm/default.jpg";


            const nama =
                umkm.nama ||
                "-";


            const kategori =
                umkm.kategori ||
                "Lainnya";


            const desa =
                umkm.desa ||
                "-";


            const produk =
                umkm.produk ||
                "-";


            const rating =
                umkm.rating ||
                "0";


            const status =
                umkm.status ||
                "Buka";


            /*
             * PENTING
             * Link detail UMKM
             */

            const detailLink =
                "pages/umkm/detail.html?id=" +
                encodeURIComponent(
                    umkm.id
                );


            html += `

                <div class="col-lg-3 col-md-6 mb-4">

                    <div class="umkm-card h-100">


                        <!-- FOTO -->

                        <div class="umkm-card-image">

                            <img
                                src="${escapeHtml(gambar)}"
                                alt="${escapeHtml(nama)}"
                                onerror="this.onerror=null;this.src='assets/images/umkm/default.jpg';">

                        </div>


                        <!-- CONTENT -->

                        <div class="umkm-card-body">


                            <!-- KATEGORI -->

                            <span class="umkm-kategori">

                                ${escapeHtml(kategori)}

                            </span>


                            <!-- NAMA -->

                            <h3>

                                ${escapeHtml(nama)}

                            </h3>


                            <!-- DESA -->

                            <div class="umkm-info">

                                <i class="fa-solid fa-location-dot"></i>

                                ${escapeHtml(desa)}

                            </div>


                            <!-- PRODUK -->

                            <div class="umkm-info">

                                <i class="fa-solid fa-basket-shopping"></i>

                                ${escapeHtml(produk)}

                            </div>


                            <!-- RATING -->

                            <div class="umkm-rating">

                                ⭐

                                ${escapeHtml(rating)}

                            </div>


                            <!-- STATUS -->

                            <div class="umkm-status-card">

                                <span class="
                                    ${String(status).toLowerCase() === "buka"
                                        ? "status-open"
                                        : "status-closed"}
                                ">

                                    ●

                                    ${escapeHtml(status)}

                                </span>

                            </div>


                            <!-- BUTTON -->

                            <a
                                href="${detailLink}"
                                class="btn btn-success w-100 mt-3">

                                <i
                                    class="fa-solid fa-store">
                                </i>

                                Lihat UMKM

                            </a>


                        </div>

                    </div>

                </div>

            `;

        }
    );


    container.innerHTML =
        html;


    console.log(
        "Kartu UMKM berhasil ditampilkan."
    );

}


/* =====================================================
   SEARCH UMKM
===================================================== */

function setupUmkmSearch() {

    const input =
        document.getElementById(
            "searchUmkm"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        function () {

            filterUmkm();

        }
    );

}


/* =====================================================
   FILTER KATEGORI
===================================================== */

function setupUmkmFilter() {

    const filter =
        document.getElementById(
            "filterKategori"
        );


    if (!filter) {
        return;
    }


    filter.addEventListener(
        "change",
        function () {

            filterUmkm();

        }
    );

}


/* =====================================================
   FILTER ENGINE
===================================================== */

function filterUmkm() {

    const keywordElement =
        document.getElementById(
            "searchUmkm"
        );


    const categoryElement =
        document.getElementById(
            "filterKategori"
        );


    const keyword =
        keywordElement
            ? keywordElement.value
                .toLowerCase()
                .trim()
            : "";


    const category =
        categoryElement
            ? categoryElement.value
            : "";


    const data =
        window.plazaUmkm || [];


    const filtered =
        data.filter(
            function (item) {


                const text =

                    (item.nama || "") +
                    " " +

                    (item.kategori || "") +
                    " " +

                    (item.desa || "") +
                    " " +

                    (item.produk || "");


                const cocokKeyword =
                    text
                        .toLowerCase()
                        .includes(keyword);


                const cocokKategori =

                    category === "" ||

                    String(item.kategori || "")
                        .toLowerCase() ===
                    String(category)
                        .toLowerCase();


                return (
                    cocokKeyword &&
                    cocokKategori
                );

            }
        );


    renderUmkm(
        filtered
    );

}


/* =====================================================
   TAMBAH UMKM
===================================================== */

function setupAddUmkm() {

    const button =
        document.getElementById(
            "addUmkmButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            openUmkmModal();

        }
    );

}


/* =====================================================
   MODAL TAMBAH
===================================================== */

function openUmkmModal() {

    const form =
        document.getElementById(
            "umkmForm"
        );


    if (form) {

        form.reset();

    }


    setValue(
        "umkmModalTitle",
        "Tambah UMKM"
    );


    const id =
        document.getElementById(
            "umkmId"
        );


    if (id) {

        id.value = "";

    }


    const modalElement =
        document.getElementById(
            "umkmModal"
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
   EDIT UMKM
===================================================== */

function editUmkm(id) {

    const data =
        window.plazaUmkm || [];


    const item =
        data.find(
            function (umkm) {

                return Number(umkm.id) ===
                    Number(id);

            }
        );


    if (!item) {

        alert(
            "Data UMKM tidak ditemukan."
        );

        return;

    }


    alert(

        "EDIT UMKM\n\n" +

        "Nama: " +
        (item.nama || "-") +

        "\nKategori: " +
        (item.kategori || "-") +

        "\nDesa: " +
        (item.desa || "-") +

        "\nProduk: " +
        (item.produk || "-") +

        "\nRating: " +
        (item.rating || "-") +

        "\nStatus: " +
        (item.status || "Buka")

    );

}


/* =====================================================
   DELETE UMKM
===================================================== */

function deleteUmkm(id) {

    const data =
        window.plazaUmkm || [];


    const item =
        data.find(
            function (umkm) {

                return Number(umkm.id) ===
                    Number(id);

            }
        );


    if (!item) {

        alert(
            "Data UMKM tidak ditemukan."
        );

        return;

    }


    const yakin =
        confirm(

            'Apakah Anda yakin ingin menghapus "' +
            (item.nama || "UMKM") +
            '"?'

        );


    if (!yakin) {
        return;
    }


    alert(

        "Data UMKM siap dihapus.\n\n" +

        "Sistem database online akan kita "
        +
        "hubungkan pada tahap berikutnya."

    );

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

        element.textContent =
            value;

    }

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(value) {

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
   ADMIN PROFILE
===================================================== */

function loadAdminProfile() {

    const adminName =
        sessionStorage.getItem(
            "plazaAdminName"
        );


    if (!adminName) {
        return;
    }


    const profileName =
        document.querySelector(
            ".profile-info strong"
        );


    if (profileName) {

        profileName.textContent =
            adminName;

    }

}


/* =====================================================
   MOBILE MENU
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
        function () {

            sidebar.classList.add(
                "show"
            );

            overlay.classList.add(
                "show"
            );

        }
    );


    overlay.addEventListener(
        "click",
        function () {

            sidebar.classList.remove(
                "show"
            );

            overlay.classList.remove(
                "show"
            );

        }
    );


    document
        .querySelectorAll(
            ".menu-item"
        )
        .forEach(
            function (item) {

                item.addEventListener(
                    "click",
                    function () {

                        sidebar.classList.remove(
                            "show"
                        );

                        overlay.classList.remove(
                            "show"
                        );

                    }
                );

            }
        );

}


/* =====================================================
   LOGOUT
===================================================== */

function setupLogout() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        function (event) {

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

}