/* =====================================================
   PLAZA DAYEUHLUHUR
   DESA PANULISAN
   DETAIL PAGE ENGINE
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("DESA PANULISAN");
    console.log("DETAIL PAGE ENGINE");
    console.log("====================================");

    loadPanulisan();

});


/* =====================================================
   LOAD DATA PANULISAN
===================================================== */

async function loadPanulisan() {

    try {

        /*
         * Karena panulisan.html berada di:
         * pages/desa/
         *
         * maka untuk kembali ke root:
         * ../../
         */

        var response =
            await fetch("../../data/desa.json", {
                cache: "no-store"
            });


        if (!response.ok) {

            throw new Error(
                "desa.json gagal dimuat. HTTP " +
                response.status
            );

        }


        var data =
            await response.json();


        /*
         * Cari desa berdasarkan slug
         */

        var desa =
            data.find(function (item) {

                return item.slug === "panulisan";

            });


        if (!desa) {

            throw new Error(
                "Data Desa Panulisan tidak ditemukan."
            );

        }


        console.log(
            "Data Panulisan:",
            desa
        );


        renderPanulisan(desa);


    } catch (error) {

        console.error(
            "Gagal memuat Panulisan:",
            error
        );

        showError(error.message);

    }

}


/* =====================================================
   RENDER PANULISAN
===================================================== */

function renderPanulisan(desa) {


    /*
     * NAMA DESA
     */

    setText(
        "namaDesa",
        desa.nama
    );


    /*
     * STATUS
     */

    setText(
        "statusDesa",
        desa.status
    );


    /*
     * DESKRIPSI
     */

    setText(
        "deskripsiDesa",
        desa.deskripsi
    );


    /*
     * PENDUDUK
     */

    setText(
        "jumlahPenduduk",
        desa.penduduk
    );


    /*
     * UMKM
     */

    setText(
        "jumlahUMKM",
        desa.umkm
    );


    /*
     * BUMDES
     */

    setText(
        "namaBUMDes",
        desa.bumdes
    );


    /*
     * WISATA
     */

    setText(
        "jumlahWisata",
        desa.wisata
    );


    /*
     * GAMBAR
     */

    var gambar =
        document.getElementById(
            "gambarDesa"
        );


    if (gambar) {

        gambar.src =
            "../../" +
            desa.gambar;

        gambar.alt =
            "Desa " +
            desa.nama;

    }


    /*
     * TITLE
     */

    document.title =
        "Desa " +
        desa.nama +
        " | PLAZA DAYEUHLUHUR";


    console.log(
        "Halaman Panulisan berhasil dirender."
    );

}


/* =====================================================
   HELPER SET TEXT
===================================================== */

function setText(id, value) {

    var element =
        document.getElementById(id);


    if (!element) {

        return;

    }


    element.textContent =
        value || "-";

}


/* =====================================================
   ERROR
===================================================== */

function showError(message) {

    var container =
        document.getElementById(
            "desaDetailContainer"
        );


    if (!container) {

        return;

    }


    container.innerHTML =

        '<div class="alert alert-danger text-center">' +

            '<i class="fa-solid fa-triangle-exclamation me-2"></i>' +

            '<strong>Data desa gagal dimuat.</strong>' +

            '<br>' +

            '<small>' +
                message +
            '</small>' +

        '</div>';

}