/* =====================================================
   PLAZA DAYEUHLUHUR
   BUMDes DIRECTORY
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    loadBumdes();

});


/* =====================================================
   LOAD DATA
===================================================== */

async function loadBumdes() {

    const container =
        document.getElementById("bumdesContainer");

    const loading =
        document.getElementById("bumdesLoading");

    const errorBox =
        document.getElementById("bumdesError");

    const emptyBox =
        document.getElementById("bumdesEmpty");


    try {

        const response =
            await fetch(
                "data/bumdes.json",
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "HTTP " + response.status
            );

        }


        const data =
            await response.json();


        if (!Array.isArray(data)) {

            throw new Error(
                "Format data bukan array"
            );

        }


        window.bumdesData = data;


        loading.classList.add("d-none");


        updateStatistics(data);


        renderBumdes(data);


        setupSearch(data);


    }

    catch (error) {

        console.error(
            "Gagal memuat bumdes.json:",
            error
        );


        loading.classList.add("d-none");

        errorBox.classList.remove("d-none");

    }

}



/* =====================================================
   STATISTIK
===================================================== */

function updateStatistics(data) {

    const totalBumdes =
        document.getElementById(
            "totalBumdes"
        );


    const totalDesa =
        document.getElementById(
            "totalDesa"
        );


    const totalUnit =
        document.getElementById(
            "totalUnit"
        );


    const totalAktif =
        document.getElementById(
            "totalAktif"
        );


    /* JUMLAH BUMDES */

    totalBumdes.textContent =
        data.length;


    /* DESA UNIK */

    const desaSet =
        new Set();


    data.forEach(function (item) {

        const desa =
            getField(
                item,
                [
                    "desa",
                    "nama_desa",
                    "desaNama",
                    "wilayah"
                ]
            );


        if (
            desa &&
            desa !== "-"
        ) {

            desaSet.add(
                String(desa).trim()
            );

        }

    });


    totalDesa.textContent =
        desaSet.size;


    /* UNIT USAHA */

    let unitCount = 0;


    data.forEach(function (item) {

        const unit =
            getField(
                item,
                [
                    "unit_usaha",
                    "unitUsaha",
                    "unit",
                    "usaha",
                    "jumlah_unit"
                ]
            );


        if (Array.isArray(unit)) {

            unitCount += unit.length;

        }

        else if (
            typeof unit === "number"
        ) {

            unitCount += unit;

        }

        else if (
            unit &&
            !isNaN(unit)
        ) {

            unitCount +=
                Number(unit);

        }

        else if (unit) {

            unitCount += 1;

        }

    });


    totalUnit.textContent =
        unitCount;


    /* BUMDES AKTIF */

    let aktif = 0;


    data.forEach(function (item) {

        const status =
            getField(
                item,
                [
                    "status",
                    "keadaan"
                ],
                ""
            );


        if (
            String(status)
                .toLowerCase()
                .includes("aktif") ||

            String(status)
                .toLowerCase()
                .includes("active")
        ) {

            aktif++;

        }

    });


    totalAktif.textContent =
        aktif;

}



/* =====================================================
   RENDER BUMDES
===================================================== */

function renderBumdes(data) {

    const container =
        document.getElementById(
            "bumdesContainer"
        );


    const emptyBox =
        document.getElementById(
            "bumdesEmpty"
        );


    const searchInfo =
        document.getElementById(
            "searchInfo"
        );


    if (!data.length) {

        container.innerHTML = "";

        emptyBox.classList.remove(
            "d-none"
        );

        searchInfo.textContent =
            "Tidak ada BUMDes ditemukan.";

        return;

    }


    emptyBox.classList.add(
        "d-none"
    );


    let html = "";


    data.forEach(function (item) {

        const id =
            item.id ?? "";


        const nama =
            getField(
                item,
                [
                    "nama",
                    "nama_bumdes",
                    "bumdes"
                ],
                "BUMDes"
            );


        const desa =
            getField(
                item,
                [
                    "desa",
                    "nama_desa",
                    "desaNama",
                    "wilayah"
                ],
                "-"
            );


        const status =
            getField(
                item,
                [
                    "status",
                    "keadaan"
                ],
                "Segera Hadir"
            );


        const deskripsi =
            getField(
                item,
                [
                    "deskripsi",
                    "deskripsi_singkat",
                    "keterangan",
                    "profil"
                ],
                "Informasi BUMDes sedang dilengkapi."
            );


        const gambar =
            getField(
                item,
                [
                    "gambar",
                    "image",
                    "foto",
                    "logo"
                ],
                ""
            );


        const unit =
            getField(
                item,
                [
                    "unit_usaha",
                    "unitUsaha",
                    "unit",
                    "usaha"
                ],
                ""
            );


        const verified =
            item.verified === true ||
            item.verifikasi === true;


        const active =
            String(status)
                .toLowerCase()
                .includes("aktif") ||
            String(status)
                .toLowerCase()
                .includes("active");


        const statusClass =
            active
                ? "active"
                : "pending";


        let imageHTML = "";


        if (gambar) {

            imageHTML = `

                <img
                    src="${escapeHTML(gambar)}"
                    alt="${escapeHTML(nama)}"
                    onerror="
                        this.style.display='none';
                        this.nextElementSibling.style.display='flex';
                    "
                >

                <div
                    class="image-placeholder"
                    style="display:none;">

                    <i class="fa-solid fa-building"></i>

                </div>

            `;

        }

        else {

            imageHTML = `

                <div class="image-placeholder">

                    <i class="fa-solid fa-building"></i>

                </div>

            `;

        }


        html += `

            <div class="col-xl-4 col-lg-6">

                <article class="bumdes-card">


                    <!-- IMAGE -->

                    <div class="bumdes-image">

                        ${imageHTML}


                        <span
                            class="status-badge ${statusClass}">

                            ${escapeHTML(status)}

                        </span>


                        ${
                            verified
                            ?
                            `
                            <span
                                class="verified-badge"
                                title="Verified">

                                <i
                                    class="fa-solid fa-circle-check">
                                </i>

                            </span>
                            `
                            :
                            ""
                        }

                    </div>



                    <!-- BODY -->

                    <div class="bumdes-body">


                        <div class="bumdes-category">

                            <i class="fa-solid fa-building"></i>

                            BADAN USAHA MILIK DESA

                        </div>


                        <h3 class="bumdes-name">

                            ${escapeHTML(nama)}

                        </h3>


                        <p class="bumdes-description">

                            ${escapeHTML(deskripsi)}

                        </p>


                        <div class="bumdes-meta">


                            <div
                                class="bumdes-meta-item">

                                <i
                                    class="fa-solid fa-location-dot">
                                </i>

                                <span>

                                    ${escapeHTML(desa)}

                                </span>

                            </div>


                            ${
                                unit
                                ?
                                `
                                <div
                                    class="bumdes-meta-item">

                                    <i
                                        class="fa-solid fa-store">
                                    </i>

                                    <span>

                                        ${formatUnit(unit)}

                                    </span>

                                </div>
                                `
                                :
                                ""
                            }


                        </div>


                        <button
                            class="bumdes-button"
                            onclick="showBumdesDetail('${escapeHTML(String(id))}')">

                            <i
                                class="fa-solid fa-eye">
                            </i>

                            Lihat BUMDes

                        </button>


                    </div>

                </article>

            </div>

        `;

    });


    container.innerHTML =
        html;


    searchInfo.textContent =
        "Menampilkan " +
        data.length +
        " BUMDes";

}



/* =====================================================
   SEARCH
===================================================== */

function setupSearch(data) {

    const search =
        document.getElementById(
            "searchBumdes"
        );


    if (!search) {
        return;
    }


    search.addEventListener(
        "input",
        function () {

            const keyword =
                this.value
                    .toLowerCase()
                    .trim();


            if (!keyword) {

                renderBumdes(data);

                return;

            }


            const hasil =
                data.filter(
                    function (item) {

                        return JSON.stringify(
                            item
                        )
                        .toLowerCase()
                        .includes(keyword);

                    }
                );


            renderBumdes(hasil);

        }
    );

}



/* =====================================================
   DETAIL MODAL
===================================================== */

function showBumdesDetail(id) {

    const data =
        window.bumdesData || [];


    const item =
        data.find(
            function (row) {

                return String(row.id)
                    === String(id);

            }
        );


    if (!item) {

        console.warn(
            "Data BUMDes tidak ditemukan:",
            id
        );

        return;

    }


    const nama =
        getField(
            item,
            [
                "nama",
                "nama_bumdes",
                "bumdes"
            ],
            "BUMDes"
        );


    const desa =
        getField(
            item,
            [
                "desa",
                "nama_desa",
                "desaNama",
                "wilayah"
            ],
            "-"
        );


    const status =
        getField(
            item,
            [
                "status",
                "keadaan"
            ],
            "-"
        );


    const deskripsi =
        getField(
            item,
            [
                "deskripsi",
                "deskripsi_singkat",
                "keterangan",
                "profil"
            ],
            "-"
        );


    const unit =
        getField(
            item,
            [
                "unit_usaha",
                "unitUsaha",
                "unit",
                "usaha"
            ],
            "-"
        );


    const produk =
        getField(
            item,
            [
                "produk",
                "produk_unggulan"
            ],
            "-"
        );


    const modalTitle =
        document.getElementById(
            "modalBumdesNama"
        );


    const modalContent =
        document.getElementById(
            "modalBumdesContent"
        );


    modalTitle.textContent =
        nama;


    modalContent.innerHTML = `

        <div class="modal-detail-icon">

            <i class="fa-solid fa-building"></i>

        </div>


        <h3 class="fw-bold mb-3">

            ${escapeHTML(nama)}

        </h3>


        <div class="modal-detail-item">

            <strong>

                <i class="fa-solid fa-location-dot text-success"></i>

                Desa

            </strong>

            <span>

                ${escapeHTML(desa)}

            </span>

        </div>


        <div class="modal-detail-item">

            <strong>

                <i class="fa-solid fa-circle-check text-success"></i>

                Status

            </strong>

            <span>

                ${escapeHTML(status)}

            </span>

        </div>


        <div class="modal-detail-item">

            <strong>

                <i class="fa-solid fa-store text-success"></i>

                Unit Usaha

            </strong>

            <span>

                ${formatUnit(unit)}

            </span>

        </div>


        <div class="modal-detail-item">

            <strong>

                <i class="fa-solid fa-box-open text-success"></i>

                Produk / Potensi

            </strong>

            <span>

                ${escapeHTML(produk)}

            </span>

        </div>


        <div class="modal-detail-item">

            <strong>

                <i class="fa-solid fa-circle-info text-success"></i>

                Tentang BUMDes

            </strong>

            <span>

                ${escapeHTML(deskripsi)}

            </span>

        </div>

    `;


    const modalElement =
        document.getElementById(
            "bumdesModal"
        );


    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );


    modal.show();

}



/* =====================================================
   HELPER FIELD
===================================================== */

function getField(
    object,
    fields,
    fallback = "-"
) {

    for (
        let i = 0;
        i < fields.length;
        i++
    ) {

        const field =
            fields[i];


        if (
            object[field] !== undefined &&
            object[field] !== null &&
            object[field] !== ""
        ) {

            return object[field];

        }

    }


    return fallback;

}



/* =====================================================
   FORMAT UNIT USAHA
===================================================== */

function formatUnit(value) {

    if (
        Array.isArray(value)
    ) {

        return escapeHTML(
            value.join(", ")
        );

    }


    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {

        return "-";

    }


    return escapeHTML(
        String(value)
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