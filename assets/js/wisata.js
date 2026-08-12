/* =====================================================
   PLAZA DAYEUHLUHUR
   WISATA.JS
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const container =
        document.getElementById("wisataContainer");

    const searchInput =
        document.getElementById("searchWisata");

    const jumlahWisata =
        document.getElementById("jumlahWisata");

    const emptyState =
        document.getElementById("wisataEmpty");


    let wisataData = [];

    let currentFilter = "all";


    /* =================================================
       LOAD DATA
    ================================================= */

    fetch("data/wisata.json")

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Gagal memuat data wisata.json"
                );

            }

            return response.json();

        })

        .then(function (data) {

            wisataData = data;

            updateStatistics(data);

            renderWisata();

        })

        .catch(function (error) {

            console.error(
                "WISATA ERROR:",
                error
            );

            container.innerHTML = `

                <div class="col-12">

                    <div class="alert alert-danger text-center">

                        <i class="fa-solid fa-triangle-exclamation"></i>

                        Data wisata belum dapat dimuat.

                        <br>

                        Pastikan file

                        <strong>
                            data/wisata.json
                        </strong>

                        tersedia.

                    </div>

                </div>

            `;

        });


    /* =================================================
       STATISTIK
    ================================================= */

    function updateStatistics(data) {

        const total =
            document.getElementById("totalWisata");

        const totalCurug =
            document.getElementById("totalCurug");

        const totalAlam =
            document.getElementById("totalAlam");

        const totalDesaWisata =
            document.getElementById("totalDesaWisata");


        if (total) {

            total.textContent =
                data.length;

        }


        if (totalCurug) {

            totalCurug.textContent =
                data.filter(item =>
                    item.kategori === "Curug"
                ).length;

        }


        if (totalAlam) {

            totalAlam.textContent =
                data.filter(item =>
                    item.kategori === "Alam" ||
                    item.kategori === "Curug" ||
                    item.kategori === "Bukit"
                ).length;

        }


        if (totalDesaWisata) {

            const desaUnik =
                new Set(
                    data.map(item => item.desa)
                );

            totalDesaWisata.textContent =
                desaUnik.size;

        }

    }


    /* =================================================
       RENDER
    ================================================= */

    function renderWisata() {

        const keyword =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";


        let filtered =
            wisataData.filter(function (item) {


                const matchCategory =
                    currentFilter === "all" ||
                    item.kategori === currentFilter;


                const searchableText = `

                    ${item.nama}

                    ${item.desa}

                    ${item.kategori}

                    ${item.deskripsi}

                `.toLowerCase();


                const matchSearch =
                    searchableText.includes(
                        keyword
                    );


                return (
                    matchCategory &&
                    matchSearch
                );

            });


        /* JUMLAH */

        if (jumlahWisata) {

            jumlahWisata.innerHTML = `

                Menampilkan

                <strong>
                    ${filtered.length}
                </strong>

                destinasi

            `;

        }


        /* EMPTY */

        if (
            filtered.length === 0
        ) {

            container.innerHTML = "";

            emptyState.classList.remove(
                "d-none"
            );

            return;

        }


        emptyState.classList.add(
            "d-none"
        );


        /* CARD */

        let html = "";


        filtered.forEach(function (item) {

            html += createCard(item);

        });


        container.innerHTML = html;

    }


    /* =================================================
       CREATE CARD
    ================================================= */

    function createCard(item) {

        const image =
            item.gambar
                ? `

                    <img
                        src="${item.gambar}"
                        alt="${item.nama}"
                        onerror="this.style.display='none';
                        this.nextElementSibling.style.display='flex';">

                    <div
                        class="wisata-image-placeholder"
                        style="display:none;">

                        <i class="fa-solid fa-mountain-sun"></i>

                        <span>
                            Foto segera hadir
                        </span>

                    </div>

                `
                :
                `

                    <div
                        class="wisata-image-placeholder">

                        <i class="fa-solid fa-mountain-sun"></i>

                        <span>
                            Foto segera hadir
                        </span>

                    </div>

                `;


        return `

            <div
                class="col-md-6 col-xl-4 wisata-item">

                <article class="wisata-card">


                    <!-- IMAGE -->

                    <div class="wisata-image">

                        ${image}


                        <span
                            class="wisata-category">

                            ${item.ikon || "🌿"}

                            ${item.kategori}

                        </span>


                        <span
                            class="wisata-status">

                            ${item.status || "Potensi Wisata"}

                        </span>

                    </div>


                    <!-- BODY -->

                    <div class="wisata-card-body">


                        <h3>

                            ${item.nama}

                        </h3>


                        <div class="wisata-location">

                            <i
                                class="fa-solid fa-location-dot">
                            </i>

                            Desa ${item.desa}

                        </div>


                        <p class="wisata-description">

                            ${item.deskripsi}

                        </p>


                        <div class="wisata-card-footer">


                            <small>

                                <i
                                    class="fa-solid fa-leaf">
                                </i>

                                ${item.jenis || "Wisata Lokal"}

                            </small>


                            <a
                                href="${item.maps}"
                                target="_blank"
                                rel="noopener"
                                class="wisata-detail-btn">

                                <i
                                    class="fa-solid fa-location-arrow">
                                </i>

                                Lokasi

                            </a>


                        </div>

                    </div>

                </article>

            </div>

        `;

    }


    /* =================================================
       SEARCH
    ================================================= */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderWisata
        );

    }


    /* =================================================
       FILTER
    ================================================= */

    const filterButtons =
        document.querySelectorAll(
            ".wisata-filter-btn"
        );


    filterButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {


                filterButtons.forEach(
                    function (btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                this.classList.add(
                    "active"
                );


                currentFilter =
                    this.dataset.filter;


                renderWisata();

            }
        );

    });


});