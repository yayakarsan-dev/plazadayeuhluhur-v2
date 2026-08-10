/* =====================================================
   PLAZA DAYEUHLUHUR
   DESA DIRECTORY ENGINE
   VERSION FINAL
===================================================== */


/* =====================================================
   START
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("DESA DIRECTORY ENGINE");
    console.log("====================================");

    loadDesa();

});


/* =====================================================
   LOAD DATA DESA
===================================================== */

async function loadDesa() {

    var container =
        document.getElementById("desaContainer");


    if (!container) {

        console.error(
            "ERROR: desaContainer tidak ditemukan."
        );

        return;

    }


    console.log(
        "Membaca data/desa.json..."
    );


    try {

        var response =
            await fetch(
                "./data/desa.json",
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "desa.json gagal dimuat. HTTP " +
                response.status
            );

        }


        var data =
            await response.json();


        console.log(
            "DATA DESA BERHASIL DIBACA:",
            data
        );


        console.log(
            "JUMLAH DESA:",
            data.length
        );


        if (!Array.isArray(data)) {

            throw new Error(
                "Format desa.json harus berupa array."
            );

        }


        /* =========================================
           UPDATE STATISTIK
        ========================================= */

        updateStatistik(data);


        /* =========================================
           TAMPILKAN KARTU DESA
        ========================================= */

        renderDesa(data);


        /* =========================================
           AKTIFKAN SEARCH
        ========================================= */

        setupSearch();


        console.log(
            "DESA SELESAI DITAMPILKAN."
        );


    } catch (error) {

        console.error(
            "GAGAL MEMUAT DATA DESA:",
            error
        );


        container.innerHTML =

            '<div class="col-12">' +

                '<div class="alert alert-danger text-center">' +

                    '<i class="fa-solid fa-triangle-exclamation me-2"></i>' +

                    '<strong>Data desa gagal dimuat.</strong>' +

                    '<br>' +

                    '<small>' +
                        escapeHTML(error.message) +
                    '</small>' +

                '</div>' +

            '</div>';

    }

}


/* =====================================================
   UPDATE STATISTIK
===================================================== */

function updateStatistik(data) {

    var totalDesa =
        data.length;


    var totalPenduduk =
        0;


    var totalUMKM =
        0;


    var totalBUMDes =
        0;


    /* =========================================
       HITUNG DATA
    ========================================= */

    data.forEach(function (item) {


        /* =====================================
           PENDUDUK
        ===================================== */

        if (
            item.penduduk &&
            item.penduduk !== "-"
        ) {

            totalPenduduk +=
                parseNumber(
                    item.penduduk
                );

        }


        /* =====================================
           UMKM
        ===================================== */

        if (
            item.umkm &&
            item.umkm !== "-"
        ) {

            totalUMKM +=
                parseNumber(
                    item.umkm
                );

        }


        /* =====================================
           BUMDES
        ===================================== */

        if (
            item.bumdes &&
            item.bumdes !== "-"
        ) {

            totalBUMDes++;

        }

    });


    /* =========================================
       AMBIL ELEMENT STATISTIK
    ========================================= */

    var statDesa =
        document.getElementById(
            "totalDesa"
        );


    var statPenduduk =
        document.getElementById(
            "totalPenduduk"
        );


    var statUMKM =
        document.getElementById(
            "totalUMKM"
        );


    var statBUMDes =
        document.getElementById(
            "totalBUMDes"
        );


    /* =========================================
       TAMPILKAN STATISTIK
    ========================================= */

    if (statDesa) {

        statDesa.textContent =
            totalDesa;

    }


    if (statPenduduk) {

        statPenduduk.textContent =
            totalPenduduk.toLocaleString(
                "id-ID"
            );

    }


    if (statUMKM) {

        statUMKM.textContent =
            totalUMKM.toLocaleString(
                "id-ID"
            );

    }


    if (statBUMDes) {

        statBUMDes.textContent =
            totalBUMDes;

    }


    console.log(
        "STATISTIK DESA:"
    );


    console.log(
        "Desa:",
        totalDesa
    );


    console.log(
        "Penduduk:",
        totalPenduduk
    );


    console.log(
        "UMKM:",
        totalUMKM
    );


    console.log(
        "BUMDes:",
        totalBUMDes
    );

}


/* =====================================================
   RENDER DESA
===================================================== */

function renderDesa(data) {

    var container =
        document.getElementById(
            "desaContainer"
        );


    if (!container) {

        console.error(
            "desaContainer tidak ditemukan."
        );

        return;

    }


    var html = "";


    /* =========================================
       JIKA DATA KOSONG
    ========================================= */

    if (!data.length) {

        container.innerHTML =

            '<div class="col-12">' +

                '<div class="alert alert-info text-center">' +

                    '<i class="fa-solid fa-house me-2"></i>' +

                    'Belum ada data desa.' +

                '</div>' +

            '</div>';

        return;

    }


    /* =========================================
       LOOP DATA DESA
    ========================================= */

    data.forEach(function (item) {


        var gambar =
            item.gambar ||
            "assets/images/desa/default.jpg";


        var nama =
            item.nama ||
            "-";


        var status =
            item.status ||
            "Desa";


        var deskripsi =
            item.deskripsi ||
            "-";


        var penduduk =
            item.penduduk ||
            "-";


        var umkm =
            item.umkm ||
            "-";


        var bumdes =
            item.bumdes ||
            "-";


        var wisata =
            item.wisata ||
            "-";


        var link =
            item.link ||
            "#";


        var verified =
            item.verified ||
            false;


        /* =====================================
           VERIFIED BADGE
        ===================================== */

        var verifiedBadge = "";


        if (verified === true) {

            verifiedBadge =

                ' <i class="fa-solid fa-circle-check text-primary" ' +

                'title="Verified by PLAZA DAYEUHLUHUR">' +

                '</i>';

        }


        /* =====================================
           BUAT CARD
        ===================================== */

        html +=

            '<div class="col-lg-4 col-md-6 mb-4 desa-item">' +

                '<div class="card desa-card shadow h-100">' +


                    /* =========================
                       GAMBAR
                    ========================= */

                    '<img ' +

                        'src="' +
                        escapeHTML(gambar) +
                        '" ' +

                        'class="card-img-top" ' +

                        'alt="' +
                        escapeHTML(nama) +
                        '" ' +

                        'loading="lazy" ' +

                        'onerror="' +
                        "this.onerror=null;" +
                        "this.src='assets/images/desa/default.jpg';" +
                        '">' +


                    /* =========================
                       CARD BODY
                    ========================= */

                    '<div class="card-body">' +


                        /* STATUS */

                        '<span class="badge bg-success mb-2">' +

                            escapeHTML(status) +

                        '</span>' +


                        /* NAMA DESA */

                        '<h4 class="fw-bold">' +

                            escapeHTML(nama) +

                            verifiedBadge +

                        '</h4>' +


                        /* DESKRIPSI */

                        '<p class="text-success fw-semibold">' +

                            escapeHTML(deskripsi) +

                        '</p>' +


                        /* =====================
                           STATISTIK CARD
                        ===================== */

                        '<div class="row mt-3">' +


                            /* PENDUDUK */

                            '<div class="col-6 mb-2">' +

                                '<div class="stat-box">' +

                                    '<div class="stat-icon">' +
                                        '👥' +
                                    '</div>' +

                                    '<strong>' +

                                        escapeHTML(
                                            penduduk
                                        ) +

                                    '</strong>' +

                                    '<small>' +
                                        'Penduduk' +
                                    '</small>' +

                                '</div>' +

                            '</div>' +


                            /* UMKM */

                            '<div class="col-6 mb-2">' +

                                '<div class="stat-box">' +

                                    '<div class="stat-icon">' +
                                        '🛍️' +
                                    '</div>' +

                                    '<strong>' +

                                        escapeHTML(
                                            umkm
                                        ) +

                                    '</strong>' +

                                    '<small>' +
                                        'UMKM' +
                                    '</small>' +

                                '</div>' +

                            '</div>' +


                            /* BUMDES */

                            '<div class="col-6">' +

                                '<div class="stat-box">' +

                                    '<div class="stat-icon">' +
                                        '🏢' +
                                    '</div>' +

                                    '<strong>' +

                                        escapeHTML(
                                            bumdes
                                        ) +

                                    '</strong>' +

                                    '<small>' +
                                        'BUMDes' +
                                    '</small>' +

                                '</div>' +

                            '</div>' +


                            /* WISATA */

                            '<div class="col-6">' +

                                '<div class="stat-box">' +

                                    '<div class="stat-icon">' +
                                        '🌄' +
                                    '</div>' +

                                    '<strong>' +

                                        escapeHTML(
                                            wisata
                                        ) +

                                    '</strong>' +

                                    '<small>' +
                                        'Wisata' +
                                    '</small>' +

                                '</div>' +

                            '</div>' +


                        '</div>' +


                        /* =====================
                           TOMBOL
                        ===================== */

                        '<a ' +

                            'href="' +
                            escapeHTML(link) +
                            '" ' +

                            'class="btn btn-success w-100 mt-4">' +

                            '<i class="fa-solid fa-compass me-1"></i>' +

                            ' Jelajahi Desa' +

                        '</a>' +


                    '</div>' +

                '</div>' +

            '</div>';

    });


    /* =========================================
       MASUKKAN KE HTML
    ========================================= */

    container.innerHTML =
        html;


    console.log(
        "Kartu desa berhasil dibuat:"
    );


    console.log(
        data.length +
        " kartu desa."
    );

}


/* =====================================================
   SEARCH DESA
===================================================== */

function setupSearch() {

    var search =
        document.getElementById(
            "searchDesa"
        );


    if (!search) {

        console.log(
            "searchDesa tidak ditemukan."
        );

        return;

    }


    search.addEventListener(
        "input",
        function () {


            var keyword =
                this.value
                    .toLowerCase()
                    .trim();


            var cards =
                document.querySelectorAll(
                    ".desa-item"
                );


            var jumlahTampil =
                0;


            cards.forEach(
                function (card) {


                    var text =
                        card.innerText
                            .toLowerCase();


                    if (
                        text.indexOf(
                            keyword
                        ) !== -1
                    ) {


                        card.style.display =
                            "";


                        jumlahTampil++;


                    } else {


                        card.style.display =
                            "none";


                    }

                }
            );


            console.log(
                "Hasil pencarian:",
                jumlahTampil,
                "desa"
            );

        }
    );

}


/* =====================================================
   PARSE ANGKA
===================================================== */

function parseNumber(value) {

    if (
        value === null ||
        value === undefined ||
        value === "" ||
        value === "-"
    ) {

        return 0;

    }


    var angka =
        String(value)
            .replace(/\./g, "")
            .replace(/,/g, "")
            .replace(/\D/g, "");


    return (
        parseInt(
            angka,
            10
        ) || 0
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    return String(
        value === null ||
        value === undefined
            ? ""
            : value
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
   END
===================================================== */

console.log(
    "desa.js selesai dimuat."
);