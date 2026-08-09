/* =====================================================
   PLAZA DAYEUHLUHUR
   UMKM MANAGEMENT ENGINE V1
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("UMKM MANAGEMENT ENGINE V1");
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

    var tableBody =
        document.getElementById("umkmTableBody");

    if (!tableBody) {
        console.error("umkmTableBody tidak ditemukan.");
        return;
    }

    console.log("Membaca database UMKM...");

    try {

        var response =
            await fetch("data/umkm.json", {
                cache: "no-store"
            });

        if (!response.ok) {

            throw new Error(
                "HTTP " +
                response.status +
                " - " +
                response.statusText
            );

        }

        var text =
            await response.text();

        if (!text.trim()) {
            throw new Error("umkm.json kosong.");
        }

        var data;

        try {

            data = JSON.parse(text);

        } catch (error) {

            console.error("Isi umkm.json:");
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

        window.plazaUmkm = data;

        console.log(
            "Berhasil membaca " +
            data.length +
            " data UMKM."
        );

        updateUmkmStatistics(data);
        renderUmkm(data);

    }

    catch (error) {

        console.error(
            "Gagal membaca database UMKM:",
            error
        );

        tableBody.innerHTML =
            '<tr>' +
                '<td colspan="8" class="text-center py-4 text-danger">' +
                    '<i class="fa-solid fa-triangle-exclamation"></i> ' +
                    'Gagal membaca database UMKM.' +
                '</td>' +
            '</tr>';

    }

}


/* =====================================================
   STATISTIK UMKM
===================================================== */

function updateUmkmStatistics(data) {

    setValue(
        "totalUmkm",
        data.length
    );


    var totalBuka =
        data.filter(function (item) {

            return String(item.status || "")
                .toLowerCase() === "buka";

        }).length;


    setValue(
        "totalUmkmBuka",
        totalBuka
    );


    var totalKuliner =
        data.filter(function (item) {

            return String(item.kategori || "")
                .toLowerCase() === "kuliner";

        }).length;


    setValue(
        "totalKuliner",
        totalKuliner
    );


    var totalDesa =
        new Set(
            data.map(function (item) {
                return item.desa;
            })
        ).size;


    setValue(
        "totalUmkmDesa",
        totalDesa
    );

}


/* =====================================================
   RENDER UMKM
===================================================== */

function renderUmkm(data) {

    var tableBody =
        document.getElementById(
            "umkmTableBody"
        );

    if (!tableBody) {
        return;
    }


    if (!data.length) {

        tableBody.innerHTML =
            '<tr>' +
                '<td colspan="8" class="umkm-empty">' +
                    '<i class="fa-solid fa-store-slash"></i>' +
                    '<div>Belum ada data UMKM.</div>' +
                '</td>' +
            '</tr>';

        return;
    }


    var html = "";


    data.forEach(function (item, index) {

        var status =
            item.status || "Buka";


        var statusClass =
            String(status).toLowerCase() === "buka"
                ? "open"
                : "closed";


        html +=
            '<tr>' +

                '<td>' +
                    (index + 1) +
                '</td>' +


                '<td>' +

                    '<div class="umkm-name">' +

                        '<img ' +
                            'src="' +
                            escapeHtml(
                                item.gambar ||
                                "assets/images/umkm/default.jpg"
                            ) +
                            '" ' +
                            'class="umkm-image" ' +
                            'alt="UMKM" ' +
                            'onerror="this.src=\'assets/images/umkm/default.jpg\'">' +

                        '<div class="umkm-name-content">' +

                            '<strong>' +
                                escapeHtml(
                                    item.nama
                                ) +
                            '</strong>' +

                            '<small>' +
                                escapeHtml(
                                    item.produk || "-"
                                ) +
                            '</small>' +

                        '</div>' +

                    '</div>' +

                '</td>' +


                '<td>' +

                    '<span class="umkm-category">' +
                        escapeHtml(
                            item.kategori || "-"
                        ) +
                    '</span>' +

                '</td>' +


                '<td>' +
                    escapeHtml(
                        item.desa || "-"
                    ) +
                '</td>' +


                '<td>' +

                    '<span class="umkm-rating">' +

                        '<i class="fa-solid fa-star"></i>' +

                        '<strong>' +
                            escapeHtml(
                                item.rating || "0"
                            ) +
                        '</strong>' +

                    '</span>' +

                '</td>' +


                '<td>' +

                    '<span class="umkm-status ' +
                        statusClass +
                    '">' +

                        '<i class="fa-solid fa-circle"></i>' +

                        escapeHtml(status) +

                    '</span>' +

                '</td>' +


                '<td>' +

                    '<a ' +
                        'href="' +
                        escapeHtml(
                            item.link || "#"
                        ) +
                        '" ' +
                        'class="btn btn-sm btn-outline-secondary me-1" ' +
                        'target="_blank" ' +
                        'title="Lihat">' +

                        '<i class="fa-solid fa-eye"></i>' +

                    '</a>' +


                    '<button ' +
                        'type="button" ' +
                        'class="btn btn-sm btn-outline-primary me-1" ' +
                        'onclick="editUmkm(' +
                            item.id +
                        ')" ' +
                        'title="Edit">' +

                        '<i class="fa-solid fa-pen"></i>' +

                    '</button>' +


                    '<button ' +
                        'type="button" ' +
                        'class="btn btn-sm btn-outline-danger" ' +
                        'onclick="deleteUmkm(' +
                            item.id +
                        ')" ' +
                        'title="Hapus">' +

                        '<i class="fa-solid fa-trash"></i>' +

                    '</button>' +

                '</td>' +

            '</tr>';

    });


    tableBody.innerHTML =
        html;


    console.log(
        "Tabel UMKM berhasil ditampilkan."
    );

}


/* =====================================================
   SEARCH UMKM
===================================================== */

function setupUmkmSearch() {

    var input =
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

    var filter =
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

    var keywordElement =
        document.getElementById(
            "searchUmkm"
        );


    var categoryElement =
        document.getElementById(
            "filterKategori"
        );


    var keyword =
        keywordElement
            ? keywordElement.value
                .toLowerCase()
                .trim()
            : "";


    var category =
        categoryElement
            ? categoryElement.value
            : "";


    var data =
        window.plazaUmkm || [];


    var filtered =
        data.filter(function (item) {

            var text =
                (item.nama || "") +
                " " +
                (item.kategori || "") +
                " " +
                (item.desa || "") +
                " " +
                (item.produk || "");


            var cocokKeyword =
                text
                    .toLowerCase()
                    .includes(keyword);


            var cocokKategori =
                category === "" ||
                item.kategori === category;


            return (
                cocokKeyword &&
                cocokKategori
            );

        });


    renderUmkm(filtered);

}


/* =====================================================
   TAMBAH UMKM
===================================================== */

function setupAddUmkm() {

    var button =
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
   BUKA MODAL TAMBAH
===================================================== */

function openUmkmModal() {

    var form =
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


    var id =
        document.getElementById(
            "umkmId"
        );


    if (id) {
        id.value = "";
    }


    var modalElement =
        document.getElementById(
            "umkmModal"
        );


    if (
        modalElement &&
        typeof bootstrap !== "undefined"
    ) {

        var modal =
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

    var data =
        window.plazaUmkm || [];


    var item =
        data.find(function (umkm) {

            return umkm.id === id;

        });


    if (!item) {

        alert(
            "Data UMKM tidak ditemukan."
        );

        return;

    }


    alert(
        "EDIT UMKM\n\n" +
        "Nama: " +
        item.nama +
        "\nKategori: " +
        item.kategori +
        "\nDesa: " +
        item.desa +
        "\nProduk: " +
        item.produk +
        "\nStatus: " +
        (item.status || "Buka")
    );

}


/* =====================================================
   DELETE UMKM
===================================================== */

function deleteUmkm(id) {

    var data =
        window.plazaUmkm || [];


    var item =
        data.find(function (umkm) {

            return umkm.id === id;

        });


    if (!item) {

        alert(
            "Data UMKM tidak ditemukan."
        );

        return;

    }


    var yakin =
        confirm(
            'Apakah Anda yakin ingin menghapus "' +
            item.nama +
            '"?'
        );


    if (!yakin) {
        return;
    }


    alert(
        "Data UMKM siap dihapus.\n\n" +
        "Pada tahap berikutnya kita akan " +
        "menghubungkan tombol ini dengan sistem CRUD."
    );

}


/* =====================================================
   HELPER
===================================================== */

function setValue(id, value) {

    var element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(value) {

    return String(value || "")

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

    var adminName =
        sessionStorage.getItem(
            "plazaAdminName"
        );


    if (!adminName) {
        return;
    }


    var profileName =
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

    var button =
        document.getElementById(
            "mobileMenuBtn"
        );


    var sidebar =
        document.getElementById(
            "sidebar"
        );


    var overlay =
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
        .querySelectorAll(".menu-item")
        .forEach(function (item) {

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

        });

}


/* =====================================================
   LOGOUT
===================================================== */

function setupLogout() {

    var logoutButton =
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