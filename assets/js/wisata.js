/* =====================================================
   PLAZA DAYEUHLUHUR
   DIREKTORI WISATA
   FINAL VERSION
===================================================== */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       ELEMENT HTML
    ===================================================== */

    const container =
        document.getElementById("wisataContainer");


    const searchInput =
        document.getElementById("searchWisata");


    const kategoriFilter =
        document.getElementById("kategoriWisata");


    const totalWisata =
        document.getElementById("totalWisata");


    const totalDesa =
        document.getElementById("totalDesaWisata");


    const wisataAlam =
        document.getElementById("wisataAlam");


    const wisataBudaya =
        document.getElementById("wisataBudaya");


    /*
       ID statistik Curug.
       Kita dukung beberapa kemungkinan ID
       agar tidak mudah error.
    */

    const wisataCurug =
        document.getElementById("wisataCurug") ||
        document.getElementById("totalCurug") ||
        document.getElementById("curugWisata");


    /* =====================================================
       VALIDASI CONTAINER
    ===================================================== */

    if (!container) {

        console.error(
            "ERROR: wisataContainer tidak ditemukan."
        );

        return;

    }


    /* =====================================================
       DATA GLOBAL
    ===================================================== */

    let semuaWisata = [];


    /* =====================================================
       LOAD DATA WISATA
    ===================================================== */

    fetch("data/wisata.json")

        .then(function (response) {


            console.log(
                "Status wisata.json:",
                response.status
            );


            if (!response.ok) {

                throw new Error(
                    "wisata.json gagal dimuat. Status: " +
                    response.status
                );

            }


            return response.json();

        })


        .then(function (data) {


            console.log(
                "Data wisata berhasil dimuat:",
                data
            );


            if (!Array.isArray(data)) {

                throw new Error(
                    "Format wisata.json harus berupa ARRAY."
                );

            }


            semuaWisata = data;


            /* =================================================
               UPDATE STATISTIK
            ================================================= */

            updateStatistik(semuaWisata);


            /* =================================================
               ISI FILTER KATEGORI
            ================================================= */

            isiKategori(semuaWisata);


            /* =================================================
               RENDER SEMUA WISATA
            ================================================= */

            renderWisata(semuaWisata);

        })


        .catch(function (error) {


            console.error(
                "WISATA ERROR:",
                error
            );


            container.innerHTML = `

                <div class="col-12">

                    <div
                        class="alert alert-danger text-center">

                        <i
                            class="fa-solid fa-triangle-exclamation
                                   me-2">
                        </i>

                        <strong>
                            Data wisata belum dapat dimuat.
                        </strong>

                        <br>

                        <small>

                            ${escapeHTML(error.message)}

                        </small>

                        <br><br>

                        <small>

                            Pastikan file:

                            <b>
                                data/wisata.json
                            </b>

                            tersedia.

                        </small>

                    </div>

                </div>

            `;

        });


    /* =====================================================
       RENDER WISATA
    ===================================================== */

    function renderWisata(data) {


        if (!data || data.length === 0) {

            container.innerHTML = `

                <div
                    class="col-12 text-center py-5">

                    <i
                        class="fa-solid fa-map-location-dot
                               fa-3x
                               text-muted
                               mb-3">
                    </i>


                    <h4 class="fw-bold">

                        Wisata tidak ditemukan

                    </h4>


                    <p class="text-muted">

                        Coba gunakan kata kunci
                        pencarian lain.

                    </p>

                </div>

            `;


            return;

        }


        let html = "";


        data.forEach(function (item) {


            /* =================================================
               DATA DASAR
            ================================================= */

            const nama =
                item.nama ||
                "Nama wisata";


            const slug =
                item.slug ||
                buatSlug(nama);


            const desa =
                item.desa ||
                "Dayeuhluhur";


            const kategori =
                item.kategori ||
                "Wisata";


            const deskripsi =
                item.deskripsi ||
                "Informasi destinasi wisata segera dilengkapi.";


            const gambar =
                item.gambar ||
                "assets/images/wisata/default.jpg";


            const maps =
                item.maps ||
                item.google_maps ||
                "#";


            /* =================================================
               KARTU WISATA
            ================================================= */

            html += `

                <div
                    class="col-xl-4
                           col-lg-4
                           col-md-6
                           mb-4
                           wisata-item">


                    <div
                        class="card
                               wisata-card
                               h-100
                               shadow-sm">


                        <!-- =================================
                             GAMBAR
                        ================================== -->

                        <div
                            class="wisata-image-wrapper">

                            <img
                                src="${escapeAttribute(gambar)}"
                                class="card-img-top
                                       wisata-image"
                                alt="${escapeHTML(nama)}"
                                loading="lazy"

                                onerror="
                                    this.onerror=null;
                                    this.src='assets/images/wisata/default.jpg';
                                ">


                            <span
                                class="wisata-category">

                                ${escapeHTML(kategori)}

                            </span>

                        </div>


                        <!-- =================================
                             BODY
                        ================================== -->

                        <div
                            class="card-body
                                   d-flex
                                   flex-column">


                            <h4
                                class="fw-bold
                                       wisata-title">

                                ${escapeHTML(nama)}

                            </h4>


                            <div
                                class="text-success
                                       fw-semibold
                                       mb-2">

                                <i
                                    class="fa-solid
                                           fa-location-dot
                                           me-1">
                                </i>

                                ${escapeHTML(desa)}

                            </div>


                            <p
                                class="text-muted
                                       small
                                       wisata-description">

                                ${escapeHTML(deskripsi)}

                            </p>


                            <!-- =================================
                                 BUTTON
                            ================================== -->

                            <div
                                class="mt-auto
                                       pt-3">


                                <!-- DETAIL -->

                                <a
                                    href="detail-wisata.html?slug=${encodeURIComponent(slug)}"
                                    class="btn
                                           btn-success
                                           rounded-pill
                                           w-100
                                           mb-2">

                                    <i
                                        class="fa-solid
                                               fa-arrow-right
                                               me-1">
                                    </i>

                                    Lihat Detail

                                </a>


                                <!-- MAPS -->

                                ${
                                    maps &&
                                    maps !== "#"

                                    ?

                                    `

                                    <a
                                        href="${escapeAttribute(maps)}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="btn
                                               btn-outline-success
                                               rounded-pill
                                               w-100">

                                        <i
                                            class="fa-solid
                                                   fa-location-arrow
                                                   me-1">
                                        </i>

                                        Lihat Lokasi

                                    </a>

                                    `

                                    :

                                    `

                                    <button
                                        type="button"
                                        class="btn
                                               btn-outline-secondary
                                               rounded-pill
                                               w-100"
                                        disabled>

                                        <i
                                            class="fa-solid
                                                   fa-location-dot
                                                   me-1">
                                        </i>

                                        Lokasi Belum Tersedia

                                    </button>

                                    `

                                }


                            </div>

                        </div>

                    </div>

                </div>

            `;

        });


        container.innerHTML = html;

    }


    /* =====================================================
       STATISTIK
    ===================================================== */

    function updateStatistik(data) {


        /* =================================================
           TOTAL WISATA
        ================================================= */

        if (totalWisata) {

            totalWisata.textContent =
                data.length;

        }


        /* =================================================
           TOTAL DESA
        ================================================= */

        const desaUnik =
            new Set(

                data

                    .map(function (item) {

                        return String(
                            item.desa || ""
                        )
                        .trim()
                        .toLowerCase();

                    })


                    .filter(Boolean)

            );


        if (totalDesa) {

            totalDesa.textContent =
                desaUnik.size;

        }


        /* =================================================
           WISATA ALAM
        ================================================= */

        const alam =
            data.filter(function (item) {

                const kategori =
                    normalisasi(
                        item.kategori
                    );


                const nama =
                    normalisasi(
                        item.nama
                    );


                return (

                    kategori.includes("alam")

                    ||

                    kategori.includes("curug")

                    ||

                    kategori.includes("air terjun")

                    ||

                    nama.includes("curug")

                );

            }).length;


        /* =================================================
           WISATA BUDAYA
        ================================================= */

        const budaya =
            data.filter(function (item) {

                const kategori =
                    normalisasi(
                        item.kategori
                    );


                const nama =
                    normalisasi(
                        item.nama
                    );


                return (

                    kategori.includes("budaya")

                    ||

                    kategori.includes("sejarah")

                    ||

                    kategori.includes("tradisi")

                    ||

                    nama.includes("budaya")

                );

            }).length;


        /* =================================================
           CURUG / AIR TERJUN
        ================================================= */

        const curug =
            data.filter(function (item) {


                const kategori =
                    normalisasi(
                        item.kategori
                    );


                const nama =
                    normalisasi(
                        item.nama
                    );


                const jenis =
                    normalisasi(
                        item.jenis
                    );


                const tipe =
                    normalisasi(
                        item.tipe
                    );


                return (

                    kategori.includes("curug")

                    ||

                    kategori.includes("air terjun")

                    ||

                    nama.includes("curug")

                    ||

                    nama.includes("air terjun")

                    ||

                    jenis.includes("curug")

                    ||

                    jenis.includes("air terjun")

                    ||

                    tipe.includes("curug")

                    ||

                    tipe.includes("air terjun")

                );

            }).length;


        /* =================================================
           TAMPILKAN STATISTIK ALAM
        ================================================= */

        if (wisataAlam) {

            wisataAlam.textContent =
                alam;

        }


        /* =================================================
           TAMPILKAN STATISTIK BUDAYA
        ================================================= */

        if (wisataBudaya) {

            wisataBudaya.textContent =
                budaya;

        }


        /* =================================================
           TAMPILKAN STATISTIK CURUG
        ================================================= */

        if (wisataCurug) {

            wisataCurug.textContent =
                curug;

        }


        /* =================================================
           DEBUG CONSOLE
        ================================================= */

        console.log(
            "STATISTIK WISATA:",
            {
                total: data.length,
                desa: desaUnik.size,
                alam: alam,
                budaya: budaya,
                curug: curug
            }
        );

    }


    /* =====================================================
       ISI FILTER KATEGORI
    ===================================================== */

    function isiKategori(data) {


        if (!kategoriFilter) {

            return;

        }


        const kategori =
            [
                ...new Set(

                    data

                        .map(function (item) {

                            return item.kategori;

                        })


                        .filter(Boolean)

                )

            ].sort();


        kategoriFilter.innerHTML = `

            <option value="">

                Semua Kategori

            </option>

        `;


        kategori.forEach(function (item) {


            kategoriFilter.innerHTML += `

                <option
                    value="${escapeAttribute(item)}">

                    ${escapeHTML(item)}

                </option>

            `;

        });

    }


    /* =====================================================
       FILTER DATA
    ===================================================== */

    function filterWisata() {


        const keyword =

            searchInput

            ?

            searchInput.value
                .toLowerCase()
                .trim()

            :

            "";


        const kategori =

            kategoriFilter

            ?

            kategoriFilter.value
                .toLowerCase()
                .trim()

            :

            "";


        const hasil =

            semuaWisata.filter(function (item) {


                const text = (

                    (item.nama || "") +
                    " " +
                    (item.desa || "") +
                    " " +
                    (item.kategori || "") +
                    " " +
                    (item.deskripsi || "")

                ).toLowerCase();


                const cocokKeyword =

                    !keyword ||

                    text.includes(keyword);


                const cocokKategori =

                    !kategori ||

                    normalisasi(
                        item.kategori
                    )

                    ===

                    normalisasi(
                        kategori
                    );


                return (

                    cocokKeyword &&
                    cocokKategori

                );

            });


        renderWisata(hasil);

    }


    /* =====================================================
       SEARCH
    ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterWisata
        );

    }


    /* =====================================================
       FILTER KATEGORI
    ===================================================== */

    if (kategoriFilter) {

        kategoriFilter.addEventListener(
            "change",
            filterWisata
        );

    }


    /* =====================================================
       HELPER NORMALISASI
    ===================================================== */

    function normalisasi(value) {

        return String(value || "")

            .toLowerCase()

            .trim()

            .replace(/\s+/g, " ");

    }


    /* =====================================================
       BUAT SLUG
    ===================================================== */

    function buatSlug(text) {

        return String(text || "")

            .toLowerCase()

            .trim()

            .replace(
                /[^a-z0-9\s-]/g,
                ""
            )

            .replace(
                /\s+/g,
                "-"
            )

            .replace(
                /-+/g,
                "-"
            );

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

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
       ESCAPE ATTRIBUTE
    ===================================================== */

    function escapeAttribute(value) {

        return escapeHTML(value);

    }


});