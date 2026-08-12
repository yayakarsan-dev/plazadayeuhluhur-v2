/* =====================================================
   PLAZA DAYEUHLUHUR
   DIREKTORI WISATA
   FINAL VERSION
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

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


    /* =====================================================
       VALIDASI CONTAINER
    ===================================================== */

    if (!container) {

        console.error(
            "wisataContainer tidak ditemukan."
        );

        return;

    }


    /* =====================================================
       DATA GLOBAL
    ===================================================== */

    let semuaWisata = [];


    /* =====================================================
       LOAD DATA
    ===================================================== */

    fetch("data/wisata.json")

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "wisata.json gagal dimuat. Status: "
                    + response.status
                );

            }

            return response.json();

        })

        .then(function (data) {

            if (!Array.isArray(data)) {

                throw new Error(
                    "Format wisata.json harus berupa array."
                );

            }


            semuaWisata = data;


            /* Statistik */

            updateStatistik(semuaWisata);


            /* Filter kategori */

            isiKategori(semuaWisata);


            /* Render */

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

                        Data wisata belum dapat dimuat.

                        <br>

                        <small>

                            Periksa file
                            <b>data/wisata.json</b>

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
                        class="fa-solid fa-map-location-dot
                               fa-3x text-muted mb-3">
                    </i>

                    <h4>

                        Wisata tidak ditemukan

                    </h4>

                    <p class="text-muted">

                        Coba gunakan kata kunci pencarian lain.

                    </p>

                </div>

            `;

            return;

        }


        let html = "";


        data.forEach(function (item) {

            const nama =
                item.nama || "Nama wisata";

            const slug =
                item.slug ||
                buatSlug(nama);

            const desa =
                item.desa || "Dayeuhluhur";

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
                item.maps || "#";


            html += `

                <div
                    class="col-xl-4 col-lg-4 col-md-6 mb-4 wisata-item">

                    <div
                        class="card wisata-card h-100 shadow-sm">


                        <!-- GAMBAR -->

                        <div
                            class="wisata-image-wrapper">

                            <img
                                src="${gambar}"
                                class="card-img-top wisata-image"
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


                        <!-- BODY -->

                        <div
                            class="card-body d-flex flex-column">


                            <h4
                                class="fw-bold wisata-title">

                                ${escapeHTML(nama)}

                            </h4>


                            <div
                                class="text-success fw-semibold mb-2">

                                <i
                                    class="fa-solid fa-location-dot
                                           me-1">
                                </i>

                                ${escapeHTML(desa)}

                            </div>


                            <p
                                class="text-muted small wisata-description">

                                ${escapeHTML(deskripsi)}

                            </p>


                            <div
                                class="mt-auto pt-3">


                                <!-- DETAIL -->

                                <a
                                    href="detail-wisata.html?slug=${encodeURIComponent(slug)}"
                                    class="btn btn-success rounded-pill w-100 mb-2">

                                    <i
                                        class="fa-solid fa-arrow-right
                                               me-1">
                                    </i>

                                    Lihat Detail

                                </a>


                                <!-- MAPS -->

                                ${
                                    maps !== "#"
                                    ?

                                    `

                                    <a
                                        href="${escapeAttribute(maps)}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="btn btn-outline-success rounded-pill w-100">

                                        <i
                                            class="fa-solid fa-location-arrow
                                                   me-1">
                                        </i>

                                        Lihat Lokasi

                                    </a>

                                    `

                                    :

                                    `

                                    <button
                                        type="button"
                                        class="btn btn-outline-secondary
                                               rounded-pill w-100"
                                        disabled>

                                        <i
                                            class="fa-solid fa-location-dot
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

        if (totalWisata) {

            totalWisata.textContent =
                data.length;

        }


        const desaUnik =
            new Set(

                data
                    .map(function (item) {

                        return item.desa;

                    })
                    .filter(Boolean)

            );


        if (totalDesa) {

            totalDesa.textContent =
                desaUnik.size;

        }


        const alam =
            data.filter(function (item) {

                return normalisasi(
                    item.kategori
                ).includes("alam");

            }).length;


        const budaya =
            data.filter(function (item) {

                return normalisasi(
                    item.kategori
                ).includes("budaya");

            }).length;


        if (wisataAlam) {

            wisataAlam.textContent =
                alam;

        }


        if (wisataBudaya) {

            wisataBudaya.textContent =
                budaya;

        }

    }


    /* =====================================================
       ISI FILTER KATEGORI
    ===================================================== */

    function isiKategori(data) {

        if (!kategoriFilter) {

            return;

        }


        const kategori =
            [...new Set(

                data

                    .map(function (item) {

                        return item.kategori;

                    })

                    .filter(Boolean)

            )].sort();


        kategoriFilter.innerHTML = `

            <option value="">

                Semua Kategori

            </option>

        `;


        kategori.forEach(function (item) {

            kategoriFilter.innerHTML += `

                <option value="${escapeAttribute(item)}">

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
                    ) === normalisasi(kategori);


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
            .trim();

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