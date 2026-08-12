/* =====================================================
   PLAZA DAYEUHLUHUR
   DIREKTORI WISATA
   wisata.js — FINAL
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

    /* =====================================================
       STATISTIK
    ===================================================== */

    const totalWisata =
        document.getElementById("totalWisata");

    const totalCurug =
        document.getElementById("totalCurug");

    const totalAlam =
        document.getElementById("totalAlam");

    const totalDesaWisata =
        document.getElementById("totalDesaWisata");


    /* =====================================================
       VALIDASI CONTAINER
    ===================================================== */

    if (!container) {

        console.error(
            "ERROR: #wisataContainer tidak ditemukan."
        );

        return;

    }


    /* =====================================================
       DATA GLOBAL
    ===================================================== */

    let semuaWisata = [];


    /* =====================================================
       LOAD DATA WISATA.JSON
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
                    "Format wisata.json harus berupa array."
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
               RENDER WISATA
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

                    <div class="alert alert-danger text-center">

                        <i
                            class="fa-solid
                                   fa-triangle-exclamation
                                   me-2">
                        </i>

                        <strong>
                            Data wisata belum dapat dimuat.
                        </strong>

                        <br><br>

                        <small>
                            ${escapeHTML(error.message)}
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

                <div class="col-12 text-center py-5">

                    <i
                        class="fa-solid
                               fa-map-location-dot
                               fa-3x
                               text-muted
                               mb-3">
                    </i>

                    <h4 class="fw-bold">
                        Wisata tidak ditemukan
                    </h4>

                    <p class="text-muted">
                        Coba gunakan kata kunci
                        atau kategori lainnya.
                    </p>

                </div>

            `;

            return;

        }


        let html = "";


        data.forEach(function (item) {

            /* =================================================
               DATA
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


            const ikon =
                item.ikon ||
                "🌿";


            const deskripsi =
                item.deskripsi ||
                "Informasi destinasi wisata segera dilengkapi.";


            const gambar =
                item.gambar ||
                "assets/images/wisata/default.jpg";


            const maps =
                item.maps ||
                "";


            /* =================================================
               KARTU
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


                        <!-- ===============================
                             GAMBAR
                        ================================ -->

                        <div
                            class="wisata-image-wrapper">


                            <img
                                src="${escapeAttribute(gambar)}"
                                class="card-img-top wisata-image"
                                alt="${escapeHTML(nama)}"
                                loading="lazy"

                                onerror="
                                    this.onerror=null;
                                    this.src='assets/images/wisata/default.jpg';
                                ">


                            <span
                                class="wisata-category">

                                ${escapeHTML(ikon)}
                                ${escapeHTML(kategori)}

                            </span>


                        </div>


                        <!-- ===============================
                             BODY
                        ================================ -->

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


                            <!-- ===============================
                                 BUTTON
                            ================================ -->

                            <div
                                class="mt-auto pt-3">


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


                                <!-- LOKASI -->

                                ${
                                    maps

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
       UPDATE STATISTIK
    ===================================================== */

    function updateStatistik(data) {


        /* =================================================
           TOTAL DESTINASI
        ================================================= */

        if (totalWisata) {

            totalWisata.textContent =
                data.length;

        }


        /* =================================================
           TOTAL CURUG
           
           Berdasarkan:
           kategori = Curug
           atau nama mengandung Curug
        ================================================= */

        const jumlahCurug =
            data.filter(function (item) {

                const kategori =
                    String(
                        item.kategori || ""
                    )
                    .trim()
                    .toLowerCase();


                const nama =
                    String(
                        item.nama || ""
                    )
                    .trim()
                    .toLowerCase();


                return (

                    kategori === "curug" ||

                    kategori.includes("curug") ||

                    nama.includes("curug")

                );

            }).length;


        /* =================================================
           TOTAL WISATA ALAM
           
           Berdasarkan field:
           "jenis": "Wisata Alam"
           
           Kelima data saat ini memiliki
           jenis = Wisata Alam.
        ================================================= */

        const jumlahAlam =
            data.filter(function (item) {

                const jenis =
                    String(
                        item.jenis || ""
                    )
                    .trim()
                    .toLowerCase();


                return (

                    jenis === "wisata alam" ||

                    jenis.includes("wisata alam")

                );

            }).length;


        /* =================================================
           TOTAL DESA UNIK
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


        /* =================================================
           TAMPILKAN STATISTIK
        ================================================= */

        if (totalCurug) {

            totalCurug.textContent =
                jumlahCurug;

        }


        if (totalAlam) {

            totalAlam.textContent =
                jumlahAlam;

        }


        if (totalDesaWisata) {

            totalDesaWisata.textContent =
                desaUnik.size;

        }


        /* =================================================
           DEBUG CONSOLE
        ================================================= */

        console.log(
            "STATISTIK WISATA:",
            {
                totalDestinasi: data.length,
                curug: jumlahCurug,
                wisataAlam: jumlahAlam,
                desaPotensial: desaUnik.size
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


        const kategoriUnik = [

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


        kategoriUnik.forEach(function (kategori) {

            kategoriFilter.innerHTML += `

                <option
                    value="${escapeAttribute(kategori)}">

                    ${escapeHTML(kategori)}

                </option>

            `;

        });

    }


    /* =====================================================
       FILTER WISATA
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


                const teks = (

                    (item.nama || "") +
                    " " +
                    (item.desa || "") +
                    " " +
                    (item.kategori || "") +
                    " " +
                    (item.jenis || "") +
                    " " +
                    (item.status || "") +
                    " " +
                    (item.deskripsi || "")

                )
                .toLowerCase();


                const cocokKeyword =

                    !keyword ||

                    teks.includes(keyword);


                const cocokKategori =

                    !kategori ||

                    String(
                        item.kategori || ""
                    )
                    .toLowerCase()
                    .trim()

                    ===

                    kategori;


                return (

                    cocokKeyword &&
                    cocokKategori

                );

            });


        renderWisata(hasil);

    }


    /* =====================================================
       EVENT SEARCH
    ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterWisata
        );

    }


    /* =====================================================
       EVENT FILTER
    ===================================================== */

    if (kategoriFilter) {

        kategoriFilter.addEventListener(
            "change",
            filterWisata
        );

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