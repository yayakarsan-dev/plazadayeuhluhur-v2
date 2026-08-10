```javascript
/* =====================================================
   PLAZA DAYEUHLUHUR
   DESA DIRECTORY ENGINE
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("=================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("DESA DIRECTORY ENGINE");
    console.log("=================================");

    loadDesa();

});


/* =====================================================
   LOAD DATA DESA
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


        if (!response.ok) {

            throw new Error(
                "HTTP " +
                response.status +
                " - desa.json tidak ditemukan."
            );

        }


        const data =
            await response.json();


        console.log(
            "Jumlah data desa:",
            data.length
        );


        if (!Array.isArray(data)) {

            throw new Error(
                "Format desa.json harus berupa ARRAY."
            );

        }


        renderDesa(data);


        updateStatistik(data);


        setupSearch();


        console.log(
            "Berhasil menampilkan " +
            data.length +
            " desa."
        );


    } catch (error) {

        console.error(
            "GAGAL MEMUAT DATA DESA:",
            error
        );


        container.innerHTML = `

            <div class="col-12">

                <div class="alert alert-danger text-center">

                    <i class="fa-solid fa-triangle-exclamation"></i>

                    <strong>
                        Data desa gagal dimuat.
                    </strong>

                    <br>

                    ${escapeHTML(
                        error.message
                    )}

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

        html += `

            <div class="col-lg-4 col-md-6 mb-4 desa-item">

                <div class="card desa-card shadow h-100">

                    <img
                        src="${escapeHTML(
                            item.gambar ||
                            "assets/images/desa/default.jpg"
                        )}"
                        class="card-img-top"
                        alt="${escapeHTML(
                            item.nama ||
                            "Desa"
                        )}"
                        loading="lazy"
                        onerror="
                            this.onerror=null;
                            this.src='assets/images/desa/default.jpg';
                        "
                    >


                    <div class="card-body">

                        <span class="badge bg-success mb-2">

                            ${escapeHTML(
                                item.status ||
                                "Desa"
                            )}

                        </span>


                        <h4 class="fw-bold">

                            ${escapeHTML(
                                item.nama ||
                                "-"
                            )}

                        </h4>


                        <p class="text-success fw-semibold">

                            ${escapeHTML(
                                item.deskripsi ||
                                "-"
                            )}

                        </p>


                        <div class="row mt-3">

                            <div class="col-6 mb-2">

                                <div class="stat-box">

                                    <div>
                                        👥
                                    </div>

                                    <strong>
                                        ${escapeHTML(
                                            item.penduduk ||
                                            "-"
                                        )}
                                    </strong>

                                    <small>
                                        Penduduk
                                    </small>

                                </div>

                            </div>


                            <div class="col-6 mb-2">

                                <div class="stat-box">

                                    <div>
                                        🛍️
                                    </div>

                                    <strong>
                                        ${escapeHTML(
                                            item.umkm ||
                                            "-"
                                        )}
                                    </strong>

                                    <small>
                                        UMKM
                                    </small>

                                </div>

                            </div>


                            <div class="col-6">

                                <div class="stat-box">

                                    <div>
                                        🏢
                                    </div>

                                    <strong>
                                        ${escapeHTML(
                                            item.bumdes ||
                                            "-"
                                        )}
                                    </strong>

                                    <small>
                                        BUMDes
                                    </small>

                                </div>

                            </div>


                            <div class="col-6">

                                <div class="stat-box">

                                    <div>
                                        🌄
                                    </div>

                                    <strong>
                                        ${escapeHTML(
                                            item.wisata ||
                                            "-"
                                        )}
                                    </strong>

                                    <small>
                                        Wisata
                                    </small>

                                </div>

                            </div>

                        </div>


                        <a
                            href="${escapeHTML(
                                item.link ||
                                "#"
                            )}"
                            class="btn btn-success w-100 mt-4"
                        >

                            <i class="fa-solid fa-compass me-1"></i>

                            Jelajahi Desa

                        </a>


                    </div>

                </div>

            </div>

        `;

    });


    container.innerHTML = html;

}


/* =====================================================
   SEARCH DESA
===================================================== */

function setupSearch() {

    const search =
        document.getElementById(
            "searchDesa"
        );


    if (!search) {

        console.log(
            "Kolom searchDesa tidak ditemukan."
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


            const items =
                document.querySelectorAll(
                    ".desa-item"
                );


            items.forEach(
                function (item) {

                    const text =
                        item.innerText
                            .toLowerCase();


                    if (
                        text.includes(keyword)
                    ) {

                        item.style.display =
                            "";

                    } else {

                        item.style.display =
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

    const totalDesa =
        document.getElementById(
            "totalDesa"
        );


    const totalPenduduk =
        document.getElementById(
            "totalPenduduk"
        );


    const totalUMKM =
        document.getElementById(
            "totalUMKM"
        );


    const totalBUMDes =
        document.getElementById(
            "totalBUMDes"
        );


    if (totalDesa) {

        totalDesa.textContent =
            data.length;

    }


    let jumlahPenduduk = 0;

    let jumlahUMKM = 0;


    data.forEach(function (item) {

        jumlahPenduduk +=
            parseNumber(
                item.penduduk
            );


        jumlahUMKM +=
            parseNumber(
                item.umkm
            );

    });


    if (totalPenduduk) {

        totalPenduduk.textContent =
            jumlahPenduduk.toLocaleString(
                "id-ID"
            );

    }


    if (totalUMKM) {

        totalUMKM.textContent =
            jumlahUMKM.toLocaleString(
                "id-ID"
            );

    }


    let jumlahBUMDes = 0;


    data.forEach(function (item) {

        if (
            item.bumdes &&
            item.bumdes !== "-"
        ) {

            jumlahBUMDes++;

        }

    });


    if (totalBUMDes) {

        totalBUMDes.textContent =
            jumlahBUMDes;

    }

}


/* =====================================================
   PARSE ANGKA
===================================================== */

function parseNumber(value) {

    if (
        !value ||
        value === "-"
    ) {

        return 0;

    }


    const angka =
        String(value)
            .replace(/\./g, "")
            .replace(/,/g, "")
            .replace(/\D/g, "");


    return parseInt(
        angka,
        10
    ) || 0;

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
