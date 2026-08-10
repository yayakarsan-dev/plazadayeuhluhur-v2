```javascript
/* =====================================================
   PLAZA DAYEUHLUHUR
   DESA DIRECTORY ENGINE - SAFE VERSION
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("DESA.JS AKTIF");

    loadDesa();

});


/* =====================================================
   LOAD DESA
===================================================== */

async function loadDesa() {

    var container = document.getElementById("desaContainer");

    if (!container) {
        console.error("desaContainer tidak ditemukan.");
        return;
    }

    try {

        console.log("Membaca data/desa.json...");

        var response = await fetch("./data/desa.json", {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(
                "desa.json gagal dibaca. HTTP " +
                response.status
            );
        }

        var data = await response.json();

        console.log("Jumlah data desa:", data.length);

        if (!Array.isArray(data)) {
            throw new Error(
                "Format desa.json harus berupa array."
            );
        }

        renderDesa(data);

        updateStatistik(data);

        setupSearch();

        console.log(
            "Berhasil menampilkan " +
            data.length +
            " desa."
        );

    } catch (error) {

        console.error(
            "ERROR DESA:",
            error
        );

        container.innerHTML =
            '<div class="col-12">' +
                '<div class="alert alert-danger text-center">' +
                    '<strong>Data desa gagal dimuat.</strong>' +
                    '<br>' +
                    escapeHTML(error.message) +
                '</div>' +
            '</div>';

    }

}


/* =====================================================
   RENDER DESA
===================================================== */

function renderDesa(data) {

    var container =
        document.getElementById("desaContainer");

    if (!container) {
        return;
    }

    var html = "";

    data.forEach(function (item) {

        var gambar =
            item.gambar ||
            "assets/images/desa/default.jpg";

        var nama =
            item.nama || "-";

        var status =
            item.status || "Desa";

        var deskripsi =
            item.deskripsi || "-";

        var penduduk =
            item.penduduk || "-";

        var umkm =
            item.umkm || "-";

        var bumdes =
            item.bumdes || "-";

        var wisata =
            item.wisata || "-";

        var link =
            item.link || "#";


        html +=
            '<div class="col-lg-4 col-md-6 mb-4 desa-item">' +

                '<div class="card desa-card shadow h-100">' +

                    '<img ' +
                        'src="' + escapeHTML(gambar) + '" ' +
                        'class="card-img-top" ' +
                        'alt="' + escapeHTML(nama) + '" ' +
                        'loading="lazy" ' +
                        'onerror="this.onerror=null;this.src=\'assets/images/desa/default.jpg\'">' +

                    '<div class="card-body">' +

                        '<span class="badge bg-success mb-2">' +
                            escapeHTML(status) +
                        '</span>' +

                        '<h4 class="fw-bold">' +
                            escapeHTML(nama) +
                        '</h4>' +

                        '<p class="text-success fw-semibold">' +
                            escapeHTML(deskripsi) +
                        '</p>' +

                        '<div class="row mt-3">' +

                            '<div class="col-6 mb-2">' +
                                '<div class="stat-box">' +
                                    '<div>👥</div>' +
                                    '<strong>' +
                                        escapeHTML(penduduk) +
                                    '</strong>' +
                                    '<small>Penduduk</small>' +
                                '</div>' +
                            '</div>' +

                            '<div class="col-6 mb-2">' +
                                '<div class="stat-box">' +
                                    '<div>🛍️</div>' +
                                    '<strong>' +
                                        escapeHTML(umkm) +
                                    '</strong>' +
                                    '<small>UMKM</small>' +
                                '</div>' +
                            '</div>' +

                            '<div class="col-6">' +
                                '<div class="stat-box">' +
                                    '<div>🏢</div>' +
                                    '<strong>' +
                                        escapeHTML(bumdes) +
                                    '</strong>' +
                                    '<small>BUMDes</small>' +
                                '</div>' +
                            '</div>' +

                            '<div class="col-6">' +
                                '<div class="stat-box">' +
                                    '<div>🌄</div>' +
                                    '<strong>' +
                                        escapeHTML(wisata) +
                                    '</strong>' +
                                    '<small>Wisata</small>' +
                                '</div>' +
                            '</div>' +

                        '</div>' +

                        '<a ' +
                            'href="' + escapeHTML(link) + '" ' +
                            'class="btn btn-success w-100 mt-4">' +

                            '<i class="fa-solid fa-compass me-1"></i>' +
                            ' Jelajahi Desa' +

                        '</a>' +

                    '</div>' +

                '</div>' +

            '</div>';

    });

    container.innerHTML = html;

}


/* =====================================================
   SEARCH
===================================================== */

function setupSearch() {

    var search =
        document.getElementById("searchDesa");

    if (!search) {
        return;
    }

    search.addEventListener(
        "input",
        function () {

            var keyword =
                this.value
                    .toLowerCase()
                    .trim();

            var items =
                document.querySelectorAll(
                    ".desa-item"
                );

            items.forEach(
                function (item) {

                    var text =
                        item.innerText
                            .toLowerCase();

                    if (
                        text.indexOf(keyword) !== -1
                    ) {

                        item.style.display = "";

                    } else {

                        item.style.display = "none";

                    }

                }
            );

        }
    );

}


/* =====================================================
   STATISTIK
===================================================== */

function updateStatistik(data) {

    var totalDesa =
        document.getElementById("totalDesa");

    var totalPenduduk =
        document.getElementById("totalPenduduk");

    var totalUMKM =
        document.getElementById("totalUMKM");

    var totalBUMDes =
        document.getElementById("totalBUMDes");


    if (totalDesa) {

        totalDesa.textContent =
            data.length;

    }


    var jumlahPenduduk = 0;

    var jumlahUMKM = 0;

    var jumlahBUMDes = 0;


    data.forEach(function (item) {

        jumlahPenduduk +=
            parseNumber(item.penduduk);

        jumlahUMKM +=
            parseNumber(item.umkm);


        if (
            item.bumdes &&
            item.bumdes !== "-"
        ) {

            jumlahBUMDes++;

        }

    });


    if (totalPenduduk) {

        totalPenduduk.textContent =
            jumlahPenduduk.toLocaleString(
                "id-ID"
            );

    }


    if (totalUMKM) {

        totalUMKM.textContent =
            jumlahUMKM.toLocaleString(
                "id-ID"
            );

    }


    if (totalBUMDes) {

        totalBUMDes.textContent =
            jumlahBUMDes;

    }

}


/* =====================================================
   PARSE NUMBER
===================================================== */

function parseNumber(value) {

    if (
        !value ||
        value === "-"
    ) {

        return 0;

    }

    var angka =
        String(value)
            .replace(/\./g, "")
            .replace(/,/g, "")
            .replace(/\D/g, "");

    return parseInt(
        angka,
        10
    ) || 0;

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    return String(value || "")

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}
```
