/* =========================================================
   PLAZA DAYEUHLUHUR
   PRODUK LOKAL ENGINE V1
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("PRODUK LOKAL ENGINE");
    console.log("====================================");


    /* =====================================================
       ELEMENT
    ===================================================== */

    const container =
        document.getElementById("produkContainer");

    const searchInput =
        document.getElementById("searchProduk");

    const kategoriSelect =
        document.getElementById("filterKategori");

    const desaSelect =
        document.getElementById("filterDesa");

    const resetButton =
        document.getElementById("resetFilter");

    const statusText =
        document.getElementById("produkStatus");

    const emptyState =
        document.getElementById("produkEmpty");


    /* =====================================================
       CEK CONTAINER
    ===================================================== */

    if (!container) {

        console.error(
            "❌ produkContainer tidak ditemukan."
        );

        return;

    }


    /* =====================================================
       DATA
    ===================================================== */

    let semuaProduk = [];


    /* =====================================================
       LOAD DATA
    ===================================================== */

    async function loadProduk() {

        try {

            console.log(
                "Membaca data/umkm.json..."
            );


            const response =
                await fetch("data/umkm.json");


            if (!response.ok) {

                throw new Error(
                    "HTTP " + response.status
                );

            }


            const data =
                await response.json();


            if (!Array.isArray(data)) {

                throw new Error(
                    "Format data bukan Array."
                );

            }


            semuaProduk = data;


            console.log(
                "✓ Produk berhasil dimuat:",
                semuaProduk
            );


            isiFilter();


            renderProduk(
                semuaProduk
            );


        }

        catch (error) {

            console.error(
                "❌ Gagal membaca produk:",
                error
            );


            if (statusText) {

                statusText.textContent =
                    "Gagal memuat produk.";

            }

        }

    }


    /* =====================================================
       ISI FILTER KATEGORI & DESA
    ===================================================== */

    function isiFilter() {

        if (kategoriSelect) {

            const kategori =
                [
                    ...new Set(
                        semuaProduk
                            .map(item =>
                                item.kategori
                            )
                            .filter(Boolean)
                    )
                ]
                .sort();


            kategoriSelect.innerHTML =
                `<option value="">
                    Semua kategori
                </option>`;


            kategori.forEach(function (item) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value = item;

                option.textContent = item;

                kategoriSelect.appendChild(
                    option
                );

            });

        }


        if (desaSelect) {

            const desa =
                [
                    ...new Set(
                        semuaProduk
                            .map(item =>
                                item.desa
                            )
                            .filter(Boolean)
                    )
                ]
                .sort();


            desaSelect.innerHTML =
                `<option value="">
                    Semua Desa
                </option>`;


            desa.forEach(function (item) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value = item;

                option.textContent = item;

                desaSelect.appendChild(
                    option
                );

            });

        }

    }


    /* =====================================================
       RENDER PRODUK
    ===================================================== */

    function renderProduk(data) {

        container.innerHTML = "";


        /* -------------------------------------------------
           STATUS
        ------------------------------------------------- */

        if (statusText) {

            statusText.textContent =
                data.length +
                " produk tersedia";

        }


        /* -------------------------------------------------
           EMPTY
        ------------------------------------------------- */

        if (data.length === 0) {

            if (emptyState) {

                emptyState.style.display =
                    "block";

            }

            return;

        }


        if (emptyState) {

            emptyState.style.display =
                "none";

        }


        /* -------------------------------------------------
           CARD
        ------------------------------------------------- */

        data.forEach(function (produk) {

            const col =
                document.createElement(
                    "div"
                );

            col.className =
                "col-md-6 col-lg-4";


            const gambar =
                produk.gambar ||
                produk.foto ||
                "assets/images/umkm/default.jpg";


            const namaProduk =
                produk.produk ||
                produk.namaProduk ||
                produk.nama ||
                "Produk Lokal";


            const deskripsi =
                produk.deskripsi ||
                produk.keterangan ||
                "Produk lokal masyarakat Dayeuhluhur.";


            const pemilik =
                produk.umkm ||
                produk.pemilik ||
                produk.nama ||
                "-";


            const desa =
                produk.desa ||
                "-";


            const harga =
                produk.harga ||
                "Hubungi Penjual";


            const whatsapp =
                produk.whatsapp ||
                produk.wa ||
                "";


            const kategori =
                produk.kategori ||
                "Produk Lokal";


            col.innerHTML = `

                <div class="product-card">

                    <!-- FOTO -->

                    <div class="product-image">

                        <img
                            src="${escapeHTML(gambar)}"
                            alt="${escapeHTML(namaProduk)}"
                            loading="lazy"
                            onerror="
                                this.src='assets/images/umkm/default.jpg'
                            "
                        >

                    </div>


                    <!-- BODY -->

                    <div class="product-body">


                        <!-- KATEGORI -->

                        <div class="product-category">

                            ${escapeHTML(kategori)}

                        </div>


                        <!-- NAMA PRODUK -->

                        <h3 class="product-title">

                            ${escapeHTML(namaProduk)}

                        </h3>


                        <!-- DESKRIPSI -->

                        <p class="product-description">

                            ${escapeHTML(deskripsi)}

                        </p>


                        <!-- PEMILIK -->

                        <div class="product-meta">

                            <i class="fa-solid fa-store"></i>

                            <span>

                                ${escapeHTML(pemilik)}

                            </span>

                        </div>


                        <!-- DESA -->

                        <div class="product-meta">

                            <i class="fa-solid fa-location-dot"></i>

                            <span>

                                ${escapeHTML(desa)}

                            </span>

                        </div>


                        <!-- HARGA -->

                        <div class="product-price">

                            ${escapeHTML(harga)}

                        </div>


                        <!-- CTA -->

                        ${
                            whatsapp
                            ?
                            `
                            <a
                                href="${buatLinkWhatsApp(
                                    whatsapp,
                                    pemilik,
                                    namaProduk
                                )}"
                                target="_blank"
                                rel="noopener"
                                class="btn-buy-wa"
                            >

                                <i class="fa-brands fa-whatsapp"></i>

                                BELI via WhatsApp

                            </a>
                            `
                            :
                            `
                            <button
                                class="btn-buy-wa disabled"
                                disabled
                            >

                                <i class="fa-solid fa-phone-slash"></i>

                                Kontak Belum Tersedia

                            </button>
                            `
                        }

                    </div>

                </div>

            `;


            container.appendChild(
                col
            );

        });

    }


    /* =====================================================
       FILTER
    ===================================================== */

    function filterProduk() {

        const keyword =
            (
                searchInput
                ?.value ||
                ""
            )
            .toLowerCase()
            .trim();


        const kategori =
            kategoriSelect
            ?.value ||
            "";


        const desa =
            desaSelect
            ?.value ||
            "";


        const hasil =
            semuaProduk.filter(
                function (produk) {

                    const nama =
                        String(
                            produk.produk ||
                            produk.namaProduk ||
                            produk.nama ||
                            ""
                        )
                        .toLowerCase();


                    const pemilik =
                        String(
                            produk.umkm ||
                            produk.pemilik ||
                            produk.nama ||
                            ""
                        )
                        .toLowerCase();


                    const cocokKeyword =
                        !keyword ||
                        nama.includes(
                            keyword
                        ) ||
                        pemilik.includes(
                            keyword
                        );


                    const cocokKategori =
                        !kategori ||
                        produk.kategori ===
                        kategori;


                    const cocokDesa =
                        !desa ||
                        produk.desa ===
                        desa;


                    return (
                        cocokKeyword &&
                        cocokKategori &&
                        cocokDesa
                    );

                }
            );


        renderProduk(
            hasil
        );

    }


    /* =====================================================
       WHATSAPP
    ===================================================== */

    function buatLinkWhatsApp(
        nomor,
        pemilik,
        produk
    ) {

        if (!nomor) {

            return "#";

        }


        let wa =
            String(nomor)
                .replace(
                    /\D/g,
                    ""
                );


        if (
            wa.startsWith("0")
        ) {

            wa =
                "62" +
                wa.substring(1);

        }


        if (
            wa.startsWith("8")
        ) {

            wa =
                "62" +
                wa;

        }


        const pesan =
            `Halo, saya tertarik membeli produk "${produk}" dari ${pemilik} yang saya lihat di Plaza Dayeuhluhur. Apakah produknya masih tersedia?`;


        return (
            "https://wa.me/" +
            wa +
            "?text=" +
            encodeURIComponent(
                pesan
            )
        );

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(
        value
    ) {

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


    /* =====================================================
       EVENT FILTER
    ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterProduk
        );

    }


    if (kategoriSelect) {

        kategoriSelect.addEventListener(
            "change",
            filterProduk
        );

    }


    if (desaSelect) {

        desaSelect.addEventListener(
            "change",
            filterProduk
        );

    }


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            function () {

                if (searchInput) {

                    searchInput.value =
                        "";

                }


                if (kategoriSelect) {

                    kategoriSelect.value =
                        "";

                }


                if (desaSelect) {

                    desaSelect.value =
                        "";

                }


                renderProduk(
                    semuaProduk
                );

            }
        );

    }


    /* =====================================================
       START
    ===================================================== */

    loadProduk();

});