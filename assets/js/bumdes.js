/* =========================================================
   PLAZA DAYEUHLUHUR
   BUMDes DIRECTORY
   PREMIUM V2
========================================================= */

let bumdesData = [];


/* =========================================================
   DOCUMENT READY
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadBumdes();

});


/* =========================================================
   LOAD DATA
========================================================= */

async function loadBumdes() {

    const container =
        document.getElementById("bumdesContainer");

    const emptyBox =
        document.getElementById("bumdesEmpty");


    try {

        const response = await fetch(
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


        /*
         * Simpan data global
         */

        bumdesData = data;

        window.bumdesData = data;


        console.log(
            "✓ Data BUMDes berhasil dimuat:",
            data
        );


        /*
         * Statistik
         */

        updateStatistics(data);


        /*
         * Tampilkan kartu
         */

        renderBumdes(data);


        /*
         * Search
         */

        setupSearch();


    }

    catch (error) {

        console.error(
            "✗ Gagal memuat bumdes.json:",
            error
        );


        if (container) {

            container.innerHTML = "";

        }


        if (emptyBox) {

            emptyBox.style.display =
                "block";


            emptyBox.innerHTML = `

                <div class="bumdes-empty-icon">

                    <i class="fa-solid fa-triangle-exclamation"></i>

                </div>

                <h3>
                    Data BUMDes gagal dimuat
                </h3>

                <p>
                    Periksa file
                    <strong>data/bumdes.json</strong>
                    dan pastikan format JSON benar.
                </p>

            `;

        }

    }

}


/* =========================================================
   STATISTIK
========================================================= */

function updateStatistics(data) {


    /*
     * TOTAL BUMDes
     */

    const totalBumdes =
        document.getElementById(
            "totalBumdes"
        );


    if (totalBumdes) {

        totalBumdes.textContent =
            data.length;

    }


    /*
     * SEMUA BUMDes AKTIF
     */

    const bumdesAktif =
        document.getElementById(
            "bumdesAktif"
        );


    if (bumdesAktif) {

        bumdesAktif.textContent =
            data.length;

    }


    /*
     * DESA
     */

    const desaBumdes =
        document.getElementById(
            "desaBumdes"
        );


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
                ],
                ""
            );


        if (desa) {

            desaSet.add(
                String(desa).trim()
            );

        }

    });


    if (desaBumdes) {

        desaBumdes.textContent =
            desaSet.size;

    }


    /*
     * TOTAL UNIT USAHA
     */

    const totalUsaha =
        document.getElementById(
            "totalUsaha"
        );


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
                ],
                ""
            );


        if (Array.isArray(unit)) {

            unitCount +=
                unit.length;

        }

        else if (
            typeof unit === "number"
        ) {

            unitCount +=
                unit;

        }

        else if (
            unit &&
            !isNaN(unit)
        ) {

            unitCount +=
                Number(unit);

        }

    });


    if (totalUsaha) {

        totalUsaha.textContent =
            unitCount;

    }

}


/* =========================================================
   RENDER BUMDes
========================================================= */

function renderBumdes(data) {

    const container =
        document.getElementById(
            "bumdesContainer"
        );


    const emptyBox =
        document.getElementById(
            "bumdesEmpty"
        );


    const jumlahBumdes =
        document.getElementById(
            "jumlahBumdes"
        );


    if (!container) {

        return;

    }


    /*
     * JUMLAH
     */

    if (jumlahBumdes) {

        jumlahBumdes.textContent =
            data.length;

    }


    /*
     * EMPTY
     */

    if (!data.length) {

        container.innerHTML = "";


        if (emptyBox) {

            emptyBox.style.display =
                "block";

        }


        return;

    }


    if (emptyBox) {

        emptyBox.style.display =
            "none";

    }


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


        const direktur =
            getField(
                item,
                [
                    "direktur",
                    "nama_direktur",
                    "pengelola"
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
                    "produk_unggulan",
                    "potensi"
                ],
                "-"
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


        const deskripsi =
            getField(
                item,
                [
                    "deskripsi",
                    "deskripsi_singkat",
                    "keterangan",
                    "profil"
                ],
                "BUMDes yang berperan dalam mengembangkan potensi ekonomi dan usaha masyarakat desa."
            );


        /*
         * IMAGE
         */

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
                    class="bumdes-image-placeholder">

                    <i class="fa-solid fa-building"></i>

                </div>

            `;

        }

        else {

            imageHTML = `

                <div
                    class="bumdes-image-placeholder">

                    <i class="fa-solid fa-building"></i>

                </div>

            `;

        }


        /*
         * CARD
         */

        html += `

            <div class="col-xl-4 col-lg-6">

                <article class="bumdes-card">


                    <!-- IMAGE -->

                    <div class="bumdes-card-image">

                        ${imageHTML}


                        <!-- ACTIVE -->

                        <div class="bumdes-active-badge">

                            <i class="fa-solid fa-circle-check"></i>

                            Aktif

                        </div>


                        <div class="bumdes-image-overlay"></div>

                    </div>


                    <!-- BODY -->

                    <div class="bumdes-card-body">


                        <!-- LABEL -->

                        <div class="bumdes-card-label">

                            <i class="fa-solid fa-building"></i>

                            BADAN USAHA MILIK DESA

                        </div>


                        <!-- NAME -->

                        <h3 class="bumdes-card-title">

                            ${escapeHTML(nama)}

                        </h3>


                        <!-- LOCATION -->

                        <div class="bumdes-location">

                            <i class="fa-solid fa-location-dot"></i>

                            <span>
                                Desa ${escapeHTML(desa)}
                            </span>

                        </div>


                        <!-- DESCRIPTION -->

                        <p class="bumdes-card-description">

                            ${escapeHTML(deskripsi)}

                        </p>


                        <!-- INFO -->

                        <div class="bumdes-info-grid">


                            <!-- DIREKTUR -->

                            <div class="bumdes-info-item">

                                <span class="bumdes-info-icon">

                                    <i class="fa-solid fa-user-tie"></i>

                                </span>

                                <div>

                                    <small>
                                        Direktur
                                    </small>

                                    <strong>
                                        ${escapeHTML(direktur)}
                                    </strong>

                                </div>

                            </div>


                            <!-- UNIT -->

                            <div class="bumdes-info-item">

                                <span class="bumdes-info-icon">

                                    <i class="fa-solid fa-store"></i>

                                </span>

                                <div>

                                    <small>
                                        Unit Usaha
                                    </small>

                                    <strong>
                                        ${escapeHTML(formatUnit(unit))}
                                    </strong>

                                </div>

                            </div>


                            <!-- PRODUK -->

                            <div class="bumdes-info-item">

                                <span class="bumdes-info-icon">

                                    <i class="fa-solid fa-box-open"></i>

                                </span>

                                <div>

                                    <small>
                                        Produk
                                    </small>

                                    <strong>
                                        ${escapeHTML(produk)}
                                    </strong>

                                </div>

                            </div>


                        </div>


                        <!-- BUTTON -->

                        <button
                            type="button"
                            class="bumdes-detail-button"
                            onclick="showBumdesDetail('${escapeHTML(String(id))}')">

                            <span>
                                Lihat Profil BUMDes
                            </span>

                            <i class="fa-solid fa-arrow-right"></i>

                        </button>


                    </div>

                </article>

            </div>

        `;

    });


    container.innerHTML =
        html;

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    const search =
        document.getElementById(
            "searchBumdes"
        );


    if (!search) {

        return;

    }


    /*
     * Hindari event listener ganda
     */

    if (
        search.dataset.initialized === "true"
    ) {

        return;

    }


    search.dataset.initialized =
        "true";


    search.addEventListener(
        "input",
        function () {


            const keyword =
                this.value
                    .toLowerCase()
                    .trim();


            if (!keyword) {

                renderBumdes(
                    bumdesData
                );

                return;

            }


            const hasil =
                bumdesData.filter(
                    function (item) {

                        return JSON.stringify(
                            item
                        )
                        .toLowerCase()
                        .includes(keyword);

                    }
                );


            renderBumdes(
                hasil
            );

        }
    );

}


/* =========================================================
   DETAIL PROFIL BUMDes
========================================================= */

function showBumdesDetail(id) {


    const item =
        bumdesData.find(
            function (row) {

                return String(row.id)
                    === String(id);

            }
        );


    if (!item) {

        console.warn(
            "BUMDes tidak ditemukan:",
            id
        );

        return;

    }


    /*
     * DATA
     */

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


    const direktur =
        getField(
            item,
            [
                "direktur",
                "nama_direktur",
                "pengelola"
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
                "produk_unggulan",
                "potensi"
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
            "BUMDes yang mengembangkan potensi ekonomi desa."
        );


    const telepon =
        getField(
            item,
            [
                "telepon",
                "no_hp",
                "phone",
                "kontak"
            ],
            ""
        );


    const email =
        getField(
            item,
            [
                "email"
            ],
            ""
        );


    const website =
        getField(
            item,
            [
                "website",
                "web",
                "url"
            ],
            ""
        );


    const maps =
        getField(
            item,
            [
                "maps",
                "google_maps",
                "lokasi"
            ],
            ""
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


    /*
     * MODAL
     */

    const modalTitle =
        document.getElementById(
            "modalBumdesNama"
        );


    const modalContent =
        document.getElementById(
            "modalBumdesContent"
        );


    /*
     * Jika modal belum tersedia
     */

    if (
        !modalTitle ||
        !modalContent
    ) {

        alert(
            nama +
            "\n\n" +
            "Desa: " +
            desa +
            "\n" +
            "Direktur: " +
            direktur +
            "\n" +
            "Unit Usaha: " +
            formatUnit(unit) +
            "\n" +
            "Produk: " +
            produk
        );

        return;

    }


    modalTitle.textContent =
        nama;


    /*
     * GAMBAR MODAL
     */

    let modalImage = "";


    if (gambar) {

        modalImage = `

            <div class="modal-bumdes-image">

                <img
                    src="${escapeHTML(gambar)}"
                    alt="${escapeHTML(nama)}"
                    onerror="
                        this.style.display='none';
                        this.nextElementSibling.style.display='flex';
                    "
                >

                <div
                    class="modal-bumdes-placeholder">

                    <i class="fa-solid fa-building"></i>

                </div>

            </div>

        `;

    }


    /*
     * KONTAK
     */

    let contactHTML = "";


    if (telepon) {

        contactHTML += `

            <a
                href="tel:${escapeHTML(telepon)}"
                class="modal-contact-item">

                <i class="fa-solid fa-phone"></i>

                <span>
                    ${escapeHTML(telepon)}
                </span>

            </a>

        `;

    }


    if (email) {

        contactHTML += `

            <a
                href="mailto:${escapeHTML(email)}"
                class="modal-contact-item">

                <i class="fa-solid fa-envelope"></i>

                <span>
                    ${escapeHTML(email)}
                </span>

            </a>

        `;

    }


    if (website) {

        contactHTML += `

            <a
                href="${escapeHTML(website)}"
                target="_blank"
                rel="noopener"
                class="modal-contact-item">

                <i class="fa-solid fa-globe"></i>

                <span>
                    Website BUMDes
                </span>

            </a>

        `;

    }


    /*
     * MAPS
     */

    let mapsHTML = "";


    if (maps) {

        mapsHTML = `

            <a
                href="${escapeHTML(maps)}"
                target="_blank"
                rel="noopener"
                class="bumdes-map-button">

                <i class="fa-solid fa-map-location-dot"></i>

                Lihat Lokasi BUMDes

            </a>

        `;

    }


    /*
     * CONTENT MODAL
     */

    modalContent.innerHTML = `

        ${modalImage}


        <div class="modal-bumdes-header">

            <div class="modal-bumdes-label">

                <i class="fa-solid fa-circle-check"></i>

                BUMDes AKTIF

            </div>


            <h3>

                ${escapeHTML(nama)}

            </h3>


            <div class="modal-bumdes-location">

                <i class="fa-solid fa-location-dot"></i>

                Desa ${escapeHTML(desa)}

            </div>

        </div>


        <!-- RINGKASAN -->

        <div class="modal-bumdes-stats">


            <div>

                <i class="fa-solid fa-user-tie"></i>

                <small>
                    Direktur
                </small>

                <strong>
                    ${escapeHTML(direktur)}
                </strong>

            </div>


            <div>

                <i class="fa-solid fa-store"></i>

                <small>
                    Unit Usaha
                </small>

                <strong>
                    ${escapeHTML(formatUnit(unit))}
                </strong>

            </div>


            <div>

                <i class="fa-solid fa-box-open"></i>

                <small>
                    Produk
                </small>

                <strong>
                    ${escapeHTML(produk)}
                </strong>

            </div>

        </div>


        <!-- PROFIL -->

        <div class="modal-bumdes-section">

            <h4>

                <i class="fa-solid fa-circle-info"></i>

                Tentang BUMDes

            </h4>


            <p>

                ${escapeHTML(deskripsi)}

            </p>

        </div>


        ${
            contactHTML
            ?
            `

            <div class="modal-bumdes-section">

                <h4>

                    <i class="fa-solid fa-address-book"></i>

                    Kontak

                </h4>

                <div class="modal-contact-list">

                    ${contactHTML}

                </div>

            </div>

            `
            :
            ""
        }


        ${mapsHTML}

    `;


    /*
     * TAMPILKAN MODAL
     */

    const modalElement =
        document.getElementById(
            "bumdesModal"
        );


    if (
        !modalElement ||
        typeof bootstrap === "undefined"
    ) {

        return;

    }


    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );


    modal.show();

}


/* =========================================================
   FORMAT UNIT USAHA
========================================================= */

function formatUnit(value) {


    if (Array.isArray(value)) {

        return value.join(", ");

    }


    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {

        return "-";

    }


    return String(value);

}


/* =========================================================
   GET FIELD
========================================================= */

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


/* =========================================================
   ESCAPE HTML
========================================================= */

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