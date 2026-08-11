/* =====================================================
   PLAZA DAYEUHLUHUR
   PUBLIC UMKM DIRECTORY
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("PUBLIC UMKM DIRECTORY");
    console.log("====================================");

    loadPublicUmkm();

});


/* =====================================================
   GLOBAL DATA
===================================================== */

let publicUmkmData = [];


/* =====================================================
   LOAD DATA
===================================================== */

async function loadPublicUmkm() {

    try {

        const response = await fetch(
            "data/umkm.json",
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {

            throw new Error(
                "HTTP " + response.status
            );

        }

        const data = await response.json();

        publicUmkmData =
            Array.isArray(data)
                ? data
                : [];

        console.log(
            "Data UMKM:",
            publicUmkmData.length
        );


        updateStatistics();

        setupFilters();

        renderPublicUmkm(
            publicUmkmData
        );


    } catch (error) {

        console.error(
            "Gagal membaca data UMKM:",
            error
        );

        const container =
            document.getElementById(
                "umkmContainer"
            );

        if (container) {

            container.innerHTML = `

                <div class="col-12">

                    <div class="empty-umkm">

                        <i class="fa-solid fa-triangle-exclamation"></i>

                        <h4>
                            Data UMKM belum dapat dimuat
                        </h4>

                        <p>
                            Silakan periksa file
                            data/umkm.json.
                        </p>

                    </div>

                </div>

            `;

        }

    }

}


/* =====================================================
   STATISTICS
===================================================== */

function updateStatistics() {

    const total =
        publicUmkmData.length;


    const kuliner =
        publicUmkmData.filter(
            item =>
                normalize(item.kategori)
                === "kuliner"
        ).length;


    const jasa =
        publicUmkmData.filter(
            item =>
                normalize(item.kategori)
                === "jasa"
        ).length;


    const desaSet =
        new Set(
            publicUmkmData
                .map(item =>
                    item.desa
                )
                .filter(Boolean)
        );


    setText(
        "totalUmkm",
        total
    );

    setText(
        "totalKuliner",
        kuliner
    );

    setText(
        "totalJasa",
        jasa
    );

    setText(
        "totalDesa",
        desaSet.size
    );

}


/* =====================================================
   FILTER
===================================================== */

function setupFilters() {

    const search1 =
        document.getElementById(
            "searchUmkm"
        );

    const search2 =
        document.getElementById(
            "searchUmkm2"
        );

    const kategori =
        document.getElementById(
            "filterKategori"
        );

    const status =
        document.getElementById(
            "filterStatus"
        );

    const reset =
        document.getElementById(
            "resetFilter"
        );


    function runFilter() {

        const keyword =
            (
                search1?.value ||
                search2?.value ||
                ""
            )
            .toLowerCase()
            .trim();


        const selectedKategori =
            kategori
                ? kategori.value
                : "";


        const selectedStatus =
            status
                ? status.value
                : "";


        const hasil =
            publicUmkmData.filter(
                item => {

                    const text = (

                        item.nama || ""

                    ) + " " + (

                        item.kategori || ""

                    ) + " " + (

                        item.desa || ""

                    ) + " " + (

                        item.produk || "");


                    const cocokKeyword =
                        text
                            .toLowerCase()
                            .includes(keyword);


                    const cocokKategori =
                        !selectedKategori ||
                        normalize(
                            item.kategori
                        ) === normalize(
                            selectedKategori
                        );


                    const cocokStatus =
                        !selectedStatus ||
                        normalize(
                            item.status
                        ) === normalize(
                            selectedStatus
                        );


                    return (
                        cocokKeyword &&
                        cocokKategori &&
                        cocokStatus
                    );

                }
            );


        renderPublicUmkm(
            hasil
        );

    }


    if (search1) {

        search1.addEventListener(
            "input",
            function () {

                if (search2) {

                    search2.value =
                        search1.value;

                }

                runFilter();

            }
        );

    }


    if (search2) {

        search2.addEventListener(
            "input",
            function () {

                if (search1) {

                    search1.value =
                        search2.value;

                }

                runFilter();

            }
        );

    }


    if (kategori) {

        kategori.addEventListener(
            "change",
            runFilter
        );

    }


    if (status) {

        status.addEventListener(
            "change",
            runFilter
        );

    }


    if (reset) {

        reset.addEventListener(
            "click",
            function () {

                if (search1)
                    search1.value = "";

                if (search2)
                    search2.value = "";

                if (kategori)
                    kategori.value = "";

                if (status)
                    status.value = "";


                renderPublicUmkm(
                    publicUmkmData
                );

            }
        );

    }

}


/* =====================================================
   RENDER
===================================================== */

function renderPublicUmkm(data) {

    const container =
        document.getElementById(
            "umkmContainer"
        );

    const empty =
        document.getElementById(
            "emptyUmkm"
        );

    const jumlah =
        document.getElementById(
            "jumlahHasil"
        );


    if (!container) {
        return;
    }


    if (jumlah) {

        jumlah.textContent =
            data.length;

    }


    if (!data.length) {

        container.innerHTML = "";

        if (empty) {

            empty.style.display =
                "block";

        }

        return;

    }


    if (empty) {

        empty.style.display =
            "none";

    }


    let html = "";


    data.forEach(function (item) {


        const nama =
            escapeHtml(
                item.nama || "UMKM"
            );


        const kategori =
            escapeHtml(
                item.kategori || "Lainnya"
            );


        const desa =
            escapeHtml(
                item.desa || "-"
            );


        const produk =
            escapeHtml(
                item.produk || "-"
            );


        const rating =
            escapeHtml(
                item.rating || "0"
            );


        const status =
            item.status || "Buka";


        const statusClass =
            normalize(status) === "buka"
                ? "open"
                : "closed";


        const gambar =
            item.gambar || "";


        const link =
            item.link || "#";


        html += `

            <div
                class="col-lg-4 col-md-6"
                data-aos="fade-up">


                <article class="umkm-card">


                    <div class="umkm-image-wrap">


                        ${
                            gambar
                            ?

                            `<img
                                src="${escapeHtml(gambar)}"
                                class="umkm-image"
                                alt="${nama}"
                                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`

                            :

                            ""
                        }


                        <div
                            class="umkm-placeholder"
                            style="${gambar ? "display:none;" : "display:flex;"}">

                            <i class="fa-solid fa-store"></i>

                        </div>


                        <span class="umkm-category">

                            ${kategori}

                        </span>


                        <span
                            class="umkm-status ${statusClass}">

                            <i class="fa-solid fa-circle"></i>

                            ${escapeHtml(status)}

                        </span>


                    </div>


                    <div class="umkm-body">


                        <h3>

                            ${nama}

                        </h3>


                        <div class="umkm-product">

                            <i class="fa-solid fa-bag-shopping"></i>

                            ${produk}

                        </div>


                        <div class="umkm-location">

                            <i class="fa-solid fa-location-dot"></i>

                            ${desa}

                        </div>


                        <div class="umkm-rating">

                            <i class="fa-solid fa-star"></i>

                            ${rating}

                        </div>


                        <div class="umkm-footer-card">


                            <a
                                href="${escapeHtml(link)}"
                                class="btn btn-detail"
                                target="_blank">

                                <i class="fa-solid fa-eye"></i>

                                Lihat UMKM

                            </a>


                        </div>


                    </div>


                </article>


            </div>

        `;

    });


    container.innerHTML =
        html;

}


/* =====================================================
   HELPERS
===================================================== */

function normalize(value) {

    return String(
        value || ""
    )
    .toLowerCase()
    .trim();

}


function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value;

    }

}


function escapeHtml(value) {

    return String(
        value ?? ""
    )
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}