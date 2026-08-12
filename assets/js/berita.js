/* =====================================================
   PLAZA DAYEUHLUHUR
   BERITA.JS — FINAL
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* =================================================
       ELEMENT
    ================================================= */

    const container =
        document.getElementById("beritaContainer");

    const searchInput =
        document.getElementById("searchBerita");

    const kategoriFilter =
        document.getElementById("kategoriFilter");

    const kategoriContainer =
        document.getElementById(
            "kategoriBeritaContainer"
        );

    const jumlahHasil =
        document.getElementById(
            "jumlahHasilBerita"
        );

    const totalBerita =
        document.getElementById(
            "totalBerita"
        );

    const totalTerbaru =
        document.getElementById(
            "totalTerbaru"
        );

    const totalKategori =
        document.getElementById(
            "totalKategoriBerita"
        );

    const totalDesa =
        document.getElementById(
            "totalDesaBerita"
        );

    const beritaUnggulan =
        document.getElementById(
            "beritaUnggulan"
        );

    const emptyBerita =
        document.getElementById(
            "emptyBerita"
        );

    const resetButton =
        document.getElementById(
            "resetFilterBerita"
        );

    const resetEmpty =
        document.getElementById(
            "resetFilterEmpty"
        );


    /* =================================================
       DATA
    ================================================= */

    let semuaBerita = [];

    let beritaTerfilter = [];


    /* =================================================
       LOAD BERITA.JSON
    ================================================= */

    fetch("data/berita.json")

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "berita.json gagal dimuat. Status: " +
                    response.status
                );

            }

            return response.json();

        })

        .then(function (data) {

            if (!Array.isArray(data)) {

                throw new Error(
                    "Format berita.json harus berupa array."
                );

            }


            semuaBerita = data;

            beritaTerfilter = [...semuaBerita];


            updateStatistik();

            buildKategori();

            renderBeritaUnggulan();

            renderBerita();

        })

        .catch(function (error) {

            console.error(
                "BERITA ERROR:",
                error
            );


            if (container) {

                container.innerHTML = `

                    <div class="col-12">

                        <div class="alert alert-danger">

                            <i class="fa-solid
                                      fa-triangle-exclamation
                                      me-2">
                            </i>

                            Data berita tidak dapat
                            dimuat.

                        </div>

                    </div>

                `;

            }

        });


    /* =================================================
       STATISTIK
    ================================================= */

    function updateStatistik() {

        if (totalBerita) {

            totalBerita.textContent =
                semuaBerita.length;

        }


        /*
         * Berita terbaru.
         *
         * Untuk saat ini kita gunakan
         * maksimal 5 berita terbaru.
         */

        if (totalTerbaru) {

            totalTerbaru.textContent =
                Math.min(
                    semuaBerita.length,
                    5
                );

        }


        /* ================================
           TOTAL KATEGORI
        ================================= */

        const kategoriSet =
            new Set();


        semuaBerita.forEach(function (item) {

            const kategori =
                getKategori(item);

            if (kategori) {

                kategoriSet.add(
                    kategori
                );

            }

        });


        if (totalKategori) {

            totalKategori.textContent =
                kategoriSet.size;

        }


        /* ================================
           TOTAL DESA
        ================================= */

        const desaSet =
            new Set();


        semuaBerita.forEach(function (item) {

            const desa =
                getDesa(item);

            if (desa) {

                desaSet.add(
                    desa
                );

            }

        });


        if (totalDesa) {

            totalDesa.textContent =
                desaSet.size;

        }

    }


    /* =================================================
       KATEGORI
    ================================================= */

    function buildKategori() {

        const kategoriSet =
            new Set();


        semuaBerita.forEach(function (item) {

            const kategori =
                getKategori(item);

            if (kategori) {

                kategoriSet.add(
                    kategori
                );

            }

        });


        const kategoriArray =
            Array.from(kategoriSet)
                .sort();


        /* ================================
           SELECT
        ================================= */

        if (kategoriFilter) {

            kategoriFilter.innerHTML = `

                <option value="">
                    Semua Kategori
                </option>

            `;


            kategoriArray.forEach(
                function (kategori) {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        kategori;

                    option.textContent =
                        kategori;

                    kategoriFilter.appendChild(
                        option
                    );

                }
            );

        }


        /* ================================
           BUTTON KATEGORI
        ================================= */

        if (kategoriContainer) {

            kategoriContainer.innerHTML = `

                <button
                    type="button"
                    class="kategori-berita-btn active"
                    data-kategori="">

                    <span class="kategori-icon">

                        <i class="fa-solid
                                  fa-border-all">
                        </i>

                    </span>

                    <span>
                        Semua
                    </span>

                </button>

            `;


            kategoriArray.forEach(
                function (kategori) {

                    const button =
                        document.createElement(
                            "button"
                        );

                    button.type =
                        "button";

                    button.className =
                        "kategori-berita-btn";

                    button.dataset.kategori =
                        kategori;


                    button.innerHTML = `

                        <span
                            class="kategori-icon">

                            <i class="fa-solid
                                      fa-tag">
                            </i>

                        </span>

                        <span>
                            ${escapeHTML(kategori)}
                        </span>

                    `;


                    kategoriContainer.appendChild(
                        button
                    );

                }
            );


            activateKategoriButtons();

        }

    }


    /* =================================================
       AKTIFKAN BUTTON KATEGORI
    ================================================= */

    function activateKategoriButtons() {

        const buttons =
            document.querySelectorAll(
                ".kategori-berita-btn"
            );


        buttons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        buttons.forEach(
                            function (btn) {

                                btn.classList.remove(
                                    "active"
                                );

                            }
                        );


                        button.classList.add(
                            "active"
                        );


                        const kategori =
                            button.dataset.kategori ||
                            "";


                        if (kategoriFilter) {

                            kategoriFilter.value =
                                kategori;

                        }


                        filterBerita();

                    }
                );

            }
        );

    }


    /* =================================================
       FILTER BERITA
    ================================================= */

    function filterBerita() {

        const keyword =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        const kategori =
            kategoriFilter
                ? kategoriFilter.value
                : "";


        beritaTerfilter =
            semuaBerita.filter(
                function (item) {

                    const teks =
                        [

                            item.judul,
                            item.title,
                            item.nama,
                            item.deskripsi,
                            item.ringkasan,
                            item.isi,
                            item.kategori,
                            item.desa,
                            item.lokasi

                        ]

                        .filter(Boolean)

                        .join(" ")

                        .toLowerCase();


                    const cocokKeyword =
                        !keyword ||
                        teks.includes(
                            keyword
                        );


                    const kategoriItem =
                        getKategori(item);


                    const cocokKategori =
                        !kategori ||
                        kategoriItem
                            .toLowerCase() ===
                            kategori.toLowerCase();


                    return (
                        cocokKeyword &&
                        cocokKategori
                    );

                }
            );


        updateKategoriActive(
            kategori
        );


        renderBerita();

    }


    /* =================================================
       UPDATE ACTIVE KATEGORI
    ================================================= */

    function updateKategoriActive(
        kategori
    ) {

        const buttons =
            document.querySelectorAll(
                ".kategori-berita-btn"
            );


        buttons.forEach(
            function (button) {

                button.classList.toggle(
                    "active",
                    (button.dataset.kategori || "") ===
                    kategori
                );

            }
        );

    }


    /* =================================================
       RENDER BERITA
    ================================================= */

    function renderBerita() {

        if (!container) {
            return;
        }


        container.innerHTML = "";


        if (
            !beritaTerfilter ||
            beritaTerfilter.length === 0
        ) {

            if (emptyBerita) {

                emptyBerita.classList.remove(
                    "d-none"
                );

            }


            if (jumlahHasil) {

                jumlahHasil.textContent =
                    "0";

            }


            return;

        }


        if (emptyBerita) {

            emptyBerita.classList.add(
                "d-none"
            );

        }


        if (jumlahHasil) {

            jumlahHasil.textContent =
                beritaTerfilter.length;

        }


        beritaTerfilter.forEach(
            function (item) {

                container.insertAdjacentHTML(
                    "beforeend",
                    createBeritaCard(item)
                );

            }
        );

    }


    /* =================================================
       BERITA CARD
    ================================================= */

    function createBeritaCard(item) {

        const gambar =
            getGambar(item);


        const judul =
            getJudul(item);


        const deskripsi =
            getDeskripsi(item);


        const kategori =
            getKategori(item);


        const tanggal =
            getTanggal(item);


        const desa =
            getDesa(item);


        const slug =
            getSlug(item);


        return `

            <div
                class="col-md-6 col-lg-4">


                <article
                    class="berita-card">


                    <!-- GAMBAR -->

                    <div
                        class="berita-card-image">


                        <img
                            src="${escapeAttribute(gambar)}"
                            alt="${escapeAttribute(judul)}"
                            loading="lazy"
                            onerror="this.src='assets/images/default.jpg'">


                        <span
                            class="berita-card-category">

                            ${escapeHTML(kategori || "Berita")}

                        </span>


                    </div>


                    <!-- CONTENT -->

                    <div
                        class="berita-card-body">


                        <div
                            class="berita-card-meta">


                            <span>

                                <i
                                    class="fa-regular
                                           fa-calendar">
                                </i>

                                ${escapeHTML(tanggal)}

                            </span>


                            ${
                                desa
                                ? `
                                <span>

                                    <i
                                        class="fa-solid
                                               fa-location-dot">
                                    </i>

                                    ${escapeHTML(desa)}

                                </span>
                                `
                                : ""
                            }


                        </div>


                        <h3>

                            ${escapeHTML(judul)}

                        </h3>


                        <p>

                            ${escapeHTML(
                                truncate(
                                    deskripsi,
                                    130
                                )
                            )}

                        </p>


                        <a
                            href="detail-berita.html?slug=${encodeURIComponent(slug)}"
                            class="berita-read-more">


                            Baca Selengkapnya


                            <i
                                class="fa-solid
                                       fa-arrow-right">
                            </i>


                        </a>


                    </div>


                </article>


            </div>

        `;

    }


    /* =================================================
       BERITA UNGGULAN
    ================================================= */

    function renderBeritaUnggulan() {

        if (
            !beritaUnggulan ||
            semuaBerita.length === 0
        ) {

            return;

        }


        const item =
            semuaBerita[0];


        const gambar =
            getGambar(item);


        const judul =
            getJudul(item);


        const deskripsi =
            getDeskripsi(item);


        const kategori =
            getKategori(item);


        const tanggal =
            getTanggal(item);


        const slug =
            getSlug(item);


        beritaUnggulan.innerHTML = `

            <article
                class="berita-featured">


                <div
                    class="row g-0 align-items-stretch">


                    <!-- IMAGE -->

                    <div
                        class="col-lg-6">


                        <div
                            class="berita-featured-image">


                            <img
                                src="${escapeAttribute(gambar)}"
                                alt="${escapeAttribute(judul)}"
                                loading="lazy"
                                onerror="this.src='assets/images/default.jpg'">


                            <span
                                class="featured-badge">

                                <i
                                    class="fa-solid
                                           fa-star">
                                </i>

                                BERITA UNGGULAN

                            </span>


                        </div>


                    </div>


                    <!-- CONTENT -->

                    <div
                        class="col-lg-6">


                        <div
                            class="berita-featured-content">


                            <div
                                class="featured-meta">


                                <span>

                                    ${escapeHTML(
                                        kategori ||
                                        "Berita"
                                    )}

                                </span>


                                <span>

                                    ${escapeHTML(
                                        tanggal
                                    )}

                                </span>


                            </div>


                            <h2>

                                ${escapeHTML(judul)}

                            </h2>


                            <p>

                                ${escapeHTML(
                                    truncate(
                                        deskripsi,
                                        220
                                    )
                                )}

                            </p>


                            <a
                                href="detail-berita.html?slug=${encodeURIComponent(slug)}"
                                class="btn btn-success rounded-pill px-4">


                                Baca Berita


                                <i
                                    class="fa-solid
                                           fa-arrow-right
                                           ms-2">
                                </i>


                            </a>


                        </div>


                    </div>


                </div>


            </article>

        `;

    }


    /* =================================================
       SEARCH EVENT
    ================================================= */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterBerita
        );

    }


    /* =================================================
       CATEGORY SELECT
    ================================================= */

    if (kategoriFilter) {

        kategoriFilter.addEventListener(
            "change",
            function () {

                filterBerita();

            }
        );

    }


    /* =================================================
       RESET
    ================================================= */

    function resetFilter() {

        if (searchInput) {

            searchInput.value = "";

        }


        if (kategoriFilter) {

            kategoriFilter.value = "";

        }


        updateKategoriActive(
            ""
        );


        beritaTerfilter =
            [...semuaBerita];


        renderBerita();

    }


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetFilter
        );

    }


    if (resetEmpty) {

        resetEmpty.addEventListener(
            "click",
            resetFilter
        );

    }


    /* =================================================
       HELPER
    ================================================= */

    function getJudul(item) {

        return (
            item.judul ||
            item.title ||
            item.nama ||
            "Berita Dayeuhluhur"
        );

    }


    function getKategori(item) {

        return String(
            item.kategori ||
            item.category ||
            "Berita"
        );

    }


    function getDesa(item) {

        return String(
            item.desa ||
            item.lokasi ||
            item.desa_kelurahan ||
            ""
        );

    }


    function getDeskripsi(item) {

        return (
            item.deskripsi ||
            item.ringkasan ||
            item.excerpt ||
            item.isi_singkat ||
            item.isi ||
            "Informasi terbaru dari Kecamatan Dayeuhluhur."
        );

    }


    function getTanggal(item) {

        return (
            item.tanggal ||
            item.date ||
            item.created_at ||
            item.created ||
            "-"
        );

    }


    function getGambar(item) {

        return (
            item.gambar ||
            item.image ||
            item.foto ||
            "assets/images/default.jpg"
        );

    }


    function getSlug(item) {

        if (item.slug) {

            return String(
                item.slug
            );

        }


        const judul =
            getJudul(item);


        return judul

            .toString()

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


    function truncate(
        text,
        maxLength
    ) {

        text =
            String(text || "");


        if (
            text.length <= maxLength
        ) {

            return text;

        }


        return (
            text.substring(
                0,
                maxLength
            ).trim() +
            "..."
        );

    }


    function escapeHTML(value) {

        return String(
            value || ""
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


    function escapeAttribute(value) {

        return escapeHTML(
            value
        );

    }

});