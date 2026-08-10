```javascript
/* =====================================================
   PLAZA DAYEUHLUHUR
   DESA DIRECTORY ENGINE V2
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("DESA DIRECTORY ENGINE V2");
    console.log("====================================");

    loadDesa();

});


/* =====================================================
   LOAD DESA JSON
===================================================== */

async function loadDesa() {

    const container =
        document.getElementById("desaContainer");

    if (!container) {

        console.error(
            "ERROR: desaContainer tidak ditemukan."
        );

        return;
    }


    console.log(
        "Membaca data/desa.json..."
    );


    try {

        const response =
            await fetch("./data/desa.json", {
                cache: "no-store"
            });


        console.log(
            "HTTP Status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "File desa.json tidak ditemukan. HTTP " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "Data desa berhasil dibaca:"
        );

        console.log(data);


        if (!Array.isArray(data)) {

            throw new Error(
                "Format desa.json harus berupa ARRAY."
            );

        }


        console.log(
            "Jumlah data desa:",
            data.length
        );


        window.plazaDesa =
            data;


        renderDesa(data);


        setupSearchDesa();


        updateStatistik(data);


    }

    catch (error) {

        console.error(
            "GAGAL MEMUAT DATA DESA:"
        );

        console.error(error);


        container.innerHTML = `

            <div class="col-12">

                <div class="alert alert-danger text-center shadow-sm">

                    <i
                        class="fa-solid fa-triangle-exclamation fa-2x mb-3">
                    </i>

                    <h5>
                        Data Desa Tidak Dapat Dimuat
                    </h5>

                    <p class="mb-0">
                        ${escapeHTML(error.message)}
                    </p>

                </div>

            </div>

        `;

    }

}


/* =====================================================
   RENDER DESA
===================================================== */

function renderDesa(data) {

    const container =
        document.getElementById(
            "desaContainer"
        );


    if (!container) {
        return;
    }


    let html = "";


    data.forEach(function (item) {

        const nama =
            item.nama || "Nama Desa";


        const gambar =
            item.gambar ||
            "assets/images/desa/default.jpg";


        const status =
            item.status ||
            "Profil Desa";


        const deskripsi =
            item.deskripsi ||
            "Informasi desa sedang dilengkapi.";


        html += `

            <div class="col-lg-4 col-md-6 mb-4 desa-item">

                <div class="card desa-card shadow h-100">


                    <!-- GAMBAR -->

                    <img
                        src="${escapeHTML(gambar)}"
                        class="card-img-top"
                        alt="${escapeHTML(nama)}"
                        loading="lazy"
                        onerror="
                            this.onerror=null;
                            this.src='assets/images/desa/default.jpg';
                        "
                    >


                    <!-- BODY -->

                    <div class="card-body d-flex flex-column">


                        <!-- STATUS -->

                        <span
                            class="badge bg-success mb-3 align-self-start">

                            ${escapeHTML(status)}

                        </span>


                        <!-- NAMA DESA -->

                        <h4 class="fw-bold">

                            ${escapeHTML(nama)}

                        </h4>


                        <!-- DESKRIPSI -->

                        <p class="text-success fw-semibold">

                            ${escapeHTML(deskripsi)}

                        </p>


                        <!-- PRODUK / POTENSI -->

                        <p class="small text-muted">

                            <i class="fa-solid fa-gift"></i>

                            Produk / Potensi :

                            <b>
                                ${escapeHTML(
                                    item.produk || "-"
                                )}
                            </b>

                        </p>


                        <!-- STATISTIK -->

                        <div class="row mt-3">


                            <!-- PENDUDUK -->

                            <div class="col-6">

                                <div class="stat-box">

                                    <div>
                                        👥
                                    </div>

                                    <strong>
                                        ${escapeHTML(
                                            item.penduduk || "-"
                                        )}
                                    </strong>

                                    <small>
                                        Penduduk
                                    </small>

                                </div>

                            </div>


                            <!-- UMKM -->

                            <div class="col-6">

                                <div class="stat-box">

                                    <div>
                                        🛍️
                                    </div>

                                    <strong>
                                        ${escapeHTML(
                                            item.umkm || "-"
                                        )}
                                    </strong>

                                    <small>
                                        UMKM
                                    </small>

                                </div>

                            </div>


                            <!-- BUMDES -->

                            <div class="col-6 mt-2">

                                <div class="stat-box">

                                    <div>
                                        🏢
                                    </div>

                                    <strong>
                                        ${escapeHTML(
                                            item.bumdes || "-"
                                        )}
                                    </strong>

                                    <small>
                                        BUMDes
                                    </small>

                                </div>

                            </div>


                            <!-- WISATA -->

                            <div class="col-6 mt-2">

                                <div class="stat-box">

                                    <div>
                                        🌄
                                    </div>

                                    <strong>
                                        ${escapeHTML(
                                            item.wisata || "-"
                                        )}
                                    </strong>

                                    <small>
                                        Wisata
                                    </small>

                                </div>

                            </div>


                        </div>


                        <!-- TOMBOL -->

                        <a
                            href="${escapeHTML(
                                item.link || "#"
                            )}"
                            class="btn btn-success w-100 mt-auto mt-4">

                            <i
                                class="fa-solid fa-compass me-1">
                            </i>

                            Jelajahi Desa

                        </a>


                    </div>

                </div>

            </div>

        `;

    });


    container.innerHTML =
        html;


    console.log(
        "===================================="
    );

    console.log(
        "BERHASIL MENAMPILKAN " +
        data.length +
        " DESA"
    );

    console.log(
        "===================================="
    );

}


/* =====================================================
   SEARCH DESA
===================================================== */

function setupSearchDesa() {

    const search =
        document.getElementById(
            "searchDesa"
        );


    if (!search) {

        console.log(
            "Search Desa tidak ditemukan."
        );

        return;

    }


    search.addEventListener(
        "input",
        function () {

            const keyword =
                this.value
                    .toLowerCase()
                    .trim();


            const cards =
                document.querySelectorAll(
                    ".desa-item"
                );


            cards.forEach(
                function (card) {

                    const text =
                        card.innerText
                            .toLowerCase();


                    if (
                        text.includes(
                            keyword
                        )
                    ) {

                        card.style.display =
                            "";

                    }

                    else {

                        card.style.display =
                            "none";

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

    setValue(
        "totalDesa",
        data.length
    );


    let totalPenduduk = 0;
    let totalUmkm = 0;


    data.forEach(function (item) {

        totalPenduduk +=
            parseNumber(
                item.penduduk
            );


        totalUmkm +=
            parseNumber(
                item.umkm
            );

    });


    setValue(
        "totalPenduduk",
        totalPenduduk
            ? totalPenduduk.toLocaleString("id-ID")
            : "0"
    );


    setValue(
        "totalUMKM",
        totalUmkm
            ? totalUmkm.toLocaleString("id-ID")
            : "0"
    );


    /*
       Jumlah BUMDes berdasarkan
       jumlah desa yang memiliki
       data BUMDes.
    */

    const totalBumdes =
        data.filter(function (item) {

            return (
                item.bumdes &&
                item.bumdes !== "-"
            );

        }).length;


    setValue(
        "totalBUMDes",
        totalBumdes
    );

}


/* =====================================================
   SET VALUE
===================================================== */

function setValue(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


/* =====================================================
   PARSE NUMBER
===================================================== */

function parseNumber(value) {

    if (
        value === null ||
        value === undefined ||
        value === "-"
    ) {

        return 0;

    }


    const number =
        String(value)
            .replace(/\./g, "")
            .replace(/,/g, "")
            .replace(/[^0-9]/g, "");


    return (
        parseInt(
            number,
            10
        ) || 0
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    return String(
        value ?? ""
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
```
