/* =====================================================
   PLAZA DAYEUHLUHUR
   FRONT PAGE UMKM ENGINE V1
===================================================== */

var dataUmkmDepan = [];


/* =====================================================
   SAAT HALAMAN SELESAI DIMUAT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    loadUmkmDepan();

});


/* =====================================================
   LOAD DATA UMKM
===================================================== */

function loadUmkmDepan() {

    fetch("data/umkm.json")

        .then(function (response) {

            if (!response.ok) {
                throw new Error("Gagal membaca data UMKM.");
            }

            return response.json();

        })

        .then(function (data) {

            dataUmkmDepan = data.slice();

            loadLocalUmkmDepan();

        })

        .catch(function (error) {

            console.error(error);

            loadLocalUmkmDepan();

        });

}


/* =====================================================
   LOAD DATA DARI LOCAL STORAGE
===================================================== */

function loadLocalUmkmDepan() {

    var localData =
        localStorage.getItem("plazaUmkm");


    if (localData) {

        try {

            var tambahan =
                JSON.parse(localData);


            if (Array.isArray(tambahan)) {

                dataUmkmDepan =
                    dataUmkmDepan.concat(tambahan);

            }

        }

        catch (error) {

            console.error(
                "Data UMKM localStorage tidak valid.",
                error
            );

        }

    }


    tampilkanUmkmDepan();

}


/* =====================================================
   TAMPILKAN UMKM
===================================================== */

function tampilkanUmkmDepan() {

    var container =
        document.getElementById("umkmContainer");


    if (!container) {

        console.log(
            "umkmContainer belum tersedia di index.html."
        );

        return;

    }


    container.innerHTML = "";


    /* =================================================
       HANYA UMKM BUKA
    ================================================= */

    var dataTampil =
        dataUmkmDepan.filter(function (item) {

            return item.status === "Buka";

        });


    /* =================================================
       UMKM UNGGULAN DULU
    ================================================= */

    dataTampil.sort(function (a, b) {

        var featuredA =
            a.featured === "Ya" ? 1 : 0;

        var featuredB =
            b.featured === "Ya" ? 1 : 0;


        return featuredB - featuredA;

    });


    /* =================================================
       BATASI 8 UMKM UNTUK HALAMAN DEPAN
    ================================================= */

    dataTampil =
        dataTampil.slice(0, 8);


    /* =================================================
       JIKA KOSONG
    ================================================= */

    if (dataTampil.length === 0) {

        container.innerHTML =
            '<div class="col-12 text-center">' +
            '<p>Belum ada UMKM yang ditampilkan.</p>' +
            '</div>';

        return;

    }


    /* =================================================
       BUAT KARTU UMKM
    ================================================= */

    dataTampil.forEach(function (item) {

        var gambar =
            item.gambar ||
            "assets/images/umkm/default.jpg";


        var link =
            item.link || "#";


        var featured =
            item.featured === "Ya";


        var card =
            document.createElement("div");


        card.className =
            "col-xl-3 col-lg-4 col-md-6 mb-4";


        card.innerHTML =

            '<div class="card h-100 shadow-sm umkm-card">' +

                '<img ' +
                'src="' + escapeHtmlIndex(gambar) + '" ' +
                'class="card-img-top" ' +
                'alt="' + escapeHtmlIndex(item.nama) + '" ' +
                'style="height:200px;object-fit:cover;" ' +
                'onerror="this.src=\'assets/images/umkm/default.jpg\'">' +

                '<div class="card-body">' +

                    (featured
                        ? '<span class="badge bg-warning text-dark mb-2">' +
                          '<i class="fa-solid fa-star"></i> Unggulan' +
                          '</span>'
                        : "") +

                    '<h5 class="card-title">' +
                    escapeHtmlIndex(item.nama || "-") +
                    '</h5>' +

                    '<p class="card-text mb-1">' +
                    '<i class="fa-solid fa-location-dot"></i> ' +
                    escapeHtmlIndex(item.desa || "-") +
                    '</p>' +

                    '<p class="card-text mb-2">' +
                    '<strong>' +
                    escapeHtmlIndex(item.produk || "-") +
                    '</strong>' +
                    '</p>' +

                    '<div class="mb-3">' +

                        '<span class="text-warning">' +
                        '<i class="fa-solid fa-star"></i>' +
                        '</span> ' +

                        escapeHtmlIndex(item.rating || "0") +

                    '</div>' +

                    '<a href="' +
                    escapeHtmlIndex(link) +
                    '" class="btn btn-primary btn-sm">' +

                    'Lihat UMKM' +

                    '</a>' +

                '</div>' +

            '</div>';


        container.appendChild(card);

    });

}


/* =====================================================
   KEAMANAN HTML
===================================================== */

function escapeHtmlIndex(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}