/* =====================================================
   PLAZA DAYEUHLUHUR
   DETAIL WISATA
   FINAL / SAFE VERSION
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const detailContainer =
        document.getElementById("detailWisata");

    const heroContainer =
        document.getElementById("detailHero");


    /* =====================================================
       CEK ELEMENT HTML
    ===================================================== */

    if (!detailContainer) {

        console.error(
            "ERROR: id='detailWisata' tidak ditemukan."
        );

        return;

    }


    if (!heroContainer) {

        console.error(
            "ERROR: id='detailHero' tidak ditemukan."
        );

        return;

    }


    /* =====================================================
       AMBIL SLUG DARI URL
    ===================================================== */

    const params =
        new URLSearchParams(
            window.location.search
        );

    const slug =
        params.get("slug");


    console.log(
        "DETAIL WISATA - SLUG:",
        slug
    );


    /* =====================================================
       JIKA SLUG TIDAK ADA
    ===================================================== */

    if (!slug) {

        tampilkanError(
            "Kode destinasi wisata tidak ditemukan."
        );

        return;

    }


    /* =====================================================
       LOAD WISATA.JSON
    ===================================================== */

    fetch("data/wisata.json")

        .then(function (response) {

            console.log(
                "wisata.json status:",
                response.status
            );


            if (!response.ok) {

                throw new Error(
                    "wisata.json gagal dimuat. HTTP " +
                    response.status
                );

            }


            return response.json();

        })


        .then(function (data) {

            console.log(
                "Jumlah data wisata:",
                data.length
            );


            if (!Array.isArray(data)) {

                throw new Error(
                    "Format wisata.json bukan Array."
                );

            }


            /* =============================================
               CARI BERDASARKAN SLUG
            ============================================= */

            const wisata =
                data.find(function (item) {

                    return String(item.slug)
                        .toLowerCase()
                        === String(slug)
                        .toLowerCase();

                });


            console.log(
                "Data wisata ditemukan:",
                wisata
            );


            if (!wisata) {

                tampilkanError(
                    "Destinasi dengan slug '" +
                    slug +
                    "' tidak ditemukan di wisata.json."
                );

                return;

            }


            renderWisata(wisata);

        })


        .catch(function (error) {

            console.error(
                "DETAIL WISATA ERROR:",
                error
            );


            tampilkanError(
                error.message
            );

        });


    /* =====================================================
       RENDER WISATA
    ===================================================== */

    function renderWisata(item) {


        const nama =
            item.nama ||
            "Destinasi Wisata";


        const kategori =
            item.kategori ||
            "Wisata";


        const desa =
            item.desa ||
            "Dayeuhluhur";


        const deskripsi =
            item.deskripsi ||
            "Informasi destinasi wisata sedang dilengkapi.";


        const gambar =
            item.gambar ||
            "assets/images/wisata/default.jpg";


        const maps =
            item.maps ||
            "";


        const status =
            item.status ||
            "Potensi Wisata";


        const jenis =
            item.jenis ||
            "Wisata Lokal";


        /* =============================================
           TITLE BROWSER
        ============================================= */

        document.title =
            nama +
            " | PLAZA DAYEUHLUHUR";


        /* =============================================
           HERO
        ============================================= */

        heroContainer.innerHTML = `

            <div class="detail-hero-content">

                <span class="detail-badge">

                    <i class="fa-solid fa-mountain-sun"></i>

                    ${escapeHTML(kategori)}

                </span>


                <h1>

                    ${escapeHTML(nama)}

                </h1>


                <p>

                    <i
                        class="fa-solid fa-location-dot">
                    </i>

                    Desa ${escapeHTML(desa)},
                    Kecamatan Dayeuhluhur

                </p>

            </div>

        `;


        /* =============================================
           GAMBAR
        ============================================= */

        const imageHTML = `

            <div class="detail-image-box">

                <img
                    src="${escapeAttribute(gambar)}"
                    alt="${escapeHTML(nama)}"
                    class="detail-image"
                    onerror="
                        this.onerror=null;
                        this.src='assets/images/wisata/default.jpg';
                    ">

            </div>

        `;


        /* =============================================
           TOMBOL MAPS
        ============================================= */

        let tombolMaps = "";


        if (maps) {

            tombolMaps = `

                <a
                    href="${escapeAttribute(maps)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-success rounded-pill px-4">

                    <i
                        class="fa-solid fa-location-arrow me-2">
                    </i>

                    Lihat Lokasi

                </a>

            `;

        }


        /* =============================================
           DETAIL
        ============================================= */

        detailContainer.innerHTML = `

            <div class="row g-5 align-items-start">


                <!-- FOTO -->

                <div class="col-lg-6">

                    ${imageHTML}

                </div>


                <!-- INFORMASI -->

                <div class="col-lg-6">


                    <span class="text-success fw-bold">

                        PROFIL DESTINASI

                    </span>


                    <h2 class="fw-bold mt-2 mb-3">

                        ${escapeHTML(nama)}

                    </h2>


                    <div
                        class="text-success fw-semibold mb-4">

                        <i
                            class="fa-solid fa-location-dot me-2">
                        </i>

                        Desa ${escapeHTML(desa)}

                    </div>


                    <p
                        class="text-muted"
                        style="line-height:1.8;">

                        ${escapeHTML(deskripsi)}

                    </p>


                    <!-- INFORMASI -->

                    <div class="row g-3 mt-3">


                        <div class="col-md-6">

                            <div
                                class="p-3 rounded-4 shadow-sm bg-white">

                                <i
                                    class="fa-solid fa-layer-group
                                           text-success mb-2">
                                </i>

                                <small
                                    class="d-block text-muted">

                                    Kategori

                                </small>

                                <strong>

                                    ${escapeHTML(kategori)}

                                </strong>

                            </div>

                        </div>


                        <div class="col-md-6">

                            <div
                                class="p-3 rounded-4 shadow-sm bg-white">

                                <i
                                    class="fa-solid fa-leaf
                                           text-success mb-2">
                                </i>

                                <small
                                    class="d-block text-muted">

                                    Jenis

                                </small>

                                <strong>

                                    ${escapeHTML(jenis)}

                                </strong>

                            </div>

                        </div>


                        <div class="col-12">

                            <div
                                class="p-3 rounded-4 shadow-sm bg-white">

                                <i
                                    class="fa-solid fa-circle-check
                                           text-success mb-2">
                                </i>

                                <small
                                    class="d-block text-muted">

                                    Status

                                </small>

                                <strong>

                                    ${escapeHTML(status)}

                                </strong>

                            </div>

                        </div>


                    </div>


                    <!-- TOMBOL -->

                    <div class="d-flex flex-wrap gap-2 mt-4">

                        ${tombolMaps}


                        <a
                            href="wisata.html"
                            class="btn btn-outline-success rounded-pill px-4">

                            <i
                                class="fa-solid fa-arrow-left me-2">
                            </i>

                            Kembali ke Wisata

                        </a>

                    </div>


                </div>

            </div>

        `;


        console.log(
            "DETAIL WISATA BERHASIL DITAMPILKAN:",
            nama
        );

    }


    /* =====================================================
       ERROR MESSAGE
    ===================================================== */

    function tampilkanError(message) {


        heroContainer.innerHTML = `

            <div>

                <h1 class="fw-bold">

                    Wisata Tidak Ditemukan

                </h1>

                <p class="mb-0">

                    ${escapeHTML(message)}

                </p>

            </div>

        `;


        detailContainer.innerHTML = `

            <div class="text-center py-5">

                <i
                    class="fa-solid fa-map-location-dot
                           fa-4x text-secondary mb-4">
                </i>


                <h3 class="fw-bold">

                    Data wisata belum tersedia

                </h3>


                <p class="text-muted">

                    ${escapeHTML(message)}

                </p>


                <a
                    href="wisata.html"
                    class="btn btn-success rounded-pill px-4">

                    <i
                        class="fa-solid fa-arrow-left me-2">
                    </i>

                    Kembali ke Direktori Wisata

                </a>

            </div>

        `;

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


    /* =====================================================
       ESCAPE ATTRIBUTE
    ===================================================== */

    function escapeAttribute(value) {

        return escapeHTML(value);

    }

});