/* =====================================================
   PLAZA DAYEUHLUHUR
   DETAIL WISATA
   FINAL VERSION
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("detailWisata");

    if (!container) {
        console.error("detailWisata tidak ditemukan.");
        return;
    }


    /* =====================================================
       AMBIL SLUG DARI URL
    ===================================================== */

    const params = new URLSearchParams(window.location.search);

    const slug = params.get("slug");

    console.log("Slug wisata:", slug);


    if (!slug) {

        tampilkanError(
            "Kode destinasi wisata tidak ditemukan."
        );

        return;
    }


    /* =====================================================
       LOAD DATA
    ===================================================== */

    fetch("data/wisata.json")

        .then(function (response) {

            console.log(
                "Status wisata.json:",
                response.status
            );

            if (!response.ok) {

                throw new Error(
                    "wisata.json tidak dapat dimuat. Status: " +
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
                    "Format wisata.json harus berupa array."
                );

            }


            /* =================================================
               CARI DATA BERDASARKAN SLUG
            ================================================= */

            const wisata = data.find(function (item) {

                return String(item.slug || "")
                    .toLowerCase()
                    .trim()
                    ===
                    String(slug)
                        .toLowerCase()
                        .trim();

            });


            console.log(
                "Wisata ditemukan:",
                wisata
            );


            if (!wisata) {

                tampilkanError(
                    "Wisata dengan slug '" +
                    slug +
                    "' tidak ditemukan dalam wisata.json."
                );

                return;
            }


            renderDetail(wisata);

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
       RENDER DETAIL
    ===================================================== */

    function renderDetail(item) {

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


        const status =
            item.status ||
            "Potensi Wisata";


        const maps =
            item.maps ||
            item.google_maps ||
            "";


        /* =================================================
           TITLE
        ================================================= */

        document.title =
            nama +
            " | PLAZA DAYEUHLUHUR";


        /* =================================================
           TOMBOL MAPS
        ================================================= */

        let tombolMaps = "";


        if (maps) {

            tombolMaps = `

                <a
                    href="${escapeAttribute(maps)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-success rounded-pill px-4">

                    <i class="fa-solid fa-location-arrow me-2"></i>

                    Lihat Lokasi

                </a>

            `;

        }


        /* =================================================
           ISI HALAMAN
        ================================================= */

        container.innerHTML = `

            <div class="row g-5 align-items-start">


                <!-- FOTO -->

                <div class="col-lg-6">

                    <div
                        class="rounded-4 overflow-hidden shadow-sm">

                        <img
                            src="${escapeAttribute(gambar)}"
                            alt="${escapeHTML(nama)}"
                            class="img-fluid w-100"
                            style="
                                min-height:380px;
                                max-height:500px;
                                object-fit:cover;
                            "
                            onerror="
                                this.onerror=null;
                                this.src='assets/images/wisata/default.jpg';
                            ">

                    </div>

                </div>


                <!-- INFORMASI -->

                <div class="col-lg-6">


                    <span
                        class="badge bg-success rounded-pill px-3 py-2 mb-3">

                        🌿 ${escapeHTML(kategori)}

                    </span>


                    <h1
                        class="fw-bold mb-3">

                        ${escapeHTML(nama)}

                    </h1>


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


                    <!-- INFO BOX -->

                    <div class="row g-3 mt-4">


                        <div class="col-md-6">

                            <div
                                class="bg-light rounded-4 p-3 h-100">

                                <small
                                    class="text-muted d-block">

                                    Kategori

                                </small>

                                <strong>

                                    ${escapeHTML(kategori)}

                                </strong>

                            </div>

                        </div>


                        <div class="col-md-6">

                            <div
                                class="bg-light rounded-4 p-3 h-100">

                                <small
                                    class="text-muted d-block">

                                    Lokasi

                                </small>

                                <strong>

                                    ${escapeHTML(desa)}

                                </strong>

                            </div>

                        </div>


                        <div class="col-12">

                            <div
                                class="bg-light rounded-4 p-3">

                                <small
                                    class="text-muted d-block">

                                    Status

                                </small>

                                <strong
                                    class="text-success">

                                    ${escapeHTML(status)}

                                </strong>

                            </div>

                        </div>

                    </div>


                    <!-- TOMBOL -->

                    <div
                        class="d-flex flex-wrap gap-2 mt-4">

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
            "Detail berhasil ditampilkan:",
            nama
        );

    }


    /* =====================================================
       ERROR
    ===================================================== */

    function tampilkanError(message) {

        container.innerHTML = `

            <div
                class="text-center py-5">

                <div
                    class="display-1 mb-3">

                    😔

                </div>


                <h3
                    class="fw-bold">

                    Wisata Tidak Ditemukan

                </h3>


                <p
                    class="text-muted">

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


    function escapeAttribute(value) {

        return escapeHTML(value);

    }

});