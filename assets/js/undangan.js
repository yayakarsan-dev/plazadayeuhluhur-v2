/* =====================================================
   PLAZA DAYEUHLUHUR
   KALENDER HAJATAN & UNDANGAN ONLINE
   undangan.js
   VERSI DETAIL INDIVIDUAL
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const DATA_URL = "data/undangan.json";

    /*
     * Ambil ID dari URL
     *
     * Contoh:
     * undangan.html?id=1
     */
    const params = new URLSearchParams(
        window.location.search
    );

    const eventId = params.get("id");


    /* =================================================
       LOAD DATA
    ================================================= */

    fetch(DATA_URL)
        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Gagal membaca data undangan.json"
                );

            }

            return response.json();

        })

        .then(data => {

            /*
             * Jika ada ?id=
             * tampilkan detail undangan
             */
            if (eventId) {

                const event =
                    data.find(item =>
                        String(item.id) ===
                        String(eventId)
                    );

                if (!event) {

                    tampilkanTidakDitemukan();

                    return;
                }

                renderDetail(event);

                return;
            }


            /*
             * Jika tidak ada ?id=
             * tampilkan daftar kalender
             */
            renderDaftar(data);

        })

        .catch(error => {

            console.error(
                "Undangan:",
                error
            );

            tampilkanError();

        });


    /* =================================================
       CARI CONTAINER
    ================================================= */

    function getContainer() {

        return (

            document.getElementById(
                "undanganDetail"
            ) ||

            document.getElementById(
                "undanganContent"
            ) ||

            document.getElementById(
                "undanganContainer"
            ) ||

            document.getElementById(
                "undanganGrid"
            ) ||

            document.querySelector(
                "main"
            )

        );

    }


    /* =================================================
       DETAIL UNDANGAN
    ================================================= */

    function renderDetail(item) {

        const container =
            getContainer();

        if (!container) {

            console.error(
                "Container undangan tidak ditemukan."
            );

            return;
        }


        const tanggal =
            formatTanggal(
                item.tanggal
            );


        const foto =
            item.foto_utama ||
            item.gambar ||
            "assets/images/default.jpg";


        /*
         * Vendor
         */

        let vendorHTML = "";


        if (
            item.vendor &&
            item.vendor.length > 0
        ) {

            vendorHTML = `

                <section
                    class="detail-vendor-section"
                >

                    <div
                        class="detail-section-heading"
                    >

                        <span>
                            <i
                                class="bi bi-shop"
                            ></i>

                            Dukungan Usaha Lokal
                        </span>

                        <h2>
                            Vendor Pendukung Acara
                        </h2>

                        <p>
                            Usahawan lokal yang turut
                            mendukung acara ini.
                        </p>

                    </div>


                    <div
                        class="detail-vendor-grid"
                    >

                        ${item.vendor
                            .map(vendor =>
                                createVendorCard(
                                    vendor
                                )
                            )
                            .join("")
                        }

                    </div>

                </section>

            `;

        }


        /*
         * HTML DETAIL
         */

        container.innerHTML = `

            <div
                class="undangan-detail-page"
            >

                <!-- =================================
                     HERO
                ================================= -->

                <section
                    class="undangan-hero"
                >

                    <div
                        class="undangan-hero-overlay"
                    ></div>


                    <div
                        class="undangan-hero-content"
                    >

                        <span
                            class="undangan-label"
                        >

                            <i
                                class="bi bi-envelope-heart"
                            ></i>

                            ${escapeHTML(
                                item.judul ||
                                "Undangan"
                            )}

                        </span>


                        <div
                            class="undangan-main-photo"
                        >

                            <img
                                src="${foto}"
                                alt="${escapeHTML(
                                    item.nama ||
                                    "Undangan"
                                )}"
                                onerror="
                                    this.src=
                                    'assets/images/default.jpg'
                                "
                            >

                        </div>


                        <p
                            class="undangan-pembuka"
                        >
                            Dengan penuh kebahagiaan
                        </p>


                        <h1>
                            ${escapeHTML(
                                item.nama ||
                                "Keluarga"
                            )}
                        </h1>


                        <div
                            class="undangan-date-main"
                        >

                            <i
                                class="bi bi-calendar-heart"
                            ></i>

                            ${tanggal}

                        </div>


                        <div
                            class="undangan-location-main"
                        >

                            <i
                                class="bi bi-geo-alt-fill"
                            ></i>

                            ${escapeHTML(
                                item.desa ||
                                "Dayeuhluhur"
                            )}

                        </div>

                    </div>

                </section>


                <!-- =================================
                     DETAIL ACARA
                ================================= -->

                <section
                    class="undangan-detail-section"
                >

                    <div
                        class="undangan-detail-container"
                    >

                        <div
                            class="detail-section-heading"
                        >

                            <span>

                                <i
                                    class="bi bi-calendar-event"
                                ></i>

                                Informasi Acara

                            </span>

                            <h2>
                                Detail Hajatan
                            </h2>

                        </div>


                        <div
                            class="detail-info-grid"
                        >

                            <div
                                class="detail-info-card"
                            >

                                <div
                                    class="detail-info-icon"
                                >

                                    <i
                                        class="bi bi-calendar3"
                                    ></i>

                                </div>

                                <div>

                                    <small>
                                        Tanggal
                                    </small>

                                    <strong>
                                        ${tanggal}
                                    </strong>

                                </div>

                            </div>


                            <div
                                class="detail-info-card"
                            >

                                <div
                                    class="detail-info-icon"
                                >

                                    <i
                                        class="bi bi-clock"
                                    ></i>

                                </div>

                                <div>

                                    <small>
                                        Waktu
                                    </small>

                                    <strong>
                                        ${escapeHTML(
                                            item.waktu ||
                                            "-"
                                        )}
                                    </strong>

                                </div>

                            </div>


                            <div
                                class="detail-info-card"
                            >

                                <div
                                    class="detail-info-icon"
                                >

                                    <i
                                        class="bi bi-geo-alt"
                                    ></i>

                                </div>

                                <div>

                                    <small>
                                        Lokasi
                                    </small>

                                    <strong>
                                        ${escapeHTML(
                                            item.desa ||
                                            "-"
                                        )}
                                    </strong>

                                </div>

                            </div>


                            <div
                                class="detail-info-card"
                            >

                                <div
                                    class="detail-info-icon"
                                >

                                    <i
                                        class="bi bi-music-note-beamed"
                                    ></i>

                                </div>

                                <div>

                                    <small>
                                        Hiburan
                                    </small>

                                    <strong>
                                        ${escapeHTML(
                                            item.hiburan ||
                                            "Tidak ada"
                                        )}
                                    </strong>

                                </div>

                            </div>

                        </div>


                        <!-- ALAMAT -->

                        <div
                            class="detail-address-card"
                        >

                            <div
                                class="detail-address-icon"
                            >

                                <i
                                    class="bi bi-pin-map-fill"
                                ></i>

                            </div>


                            <div>

                                <small>
                                    Alamat Acara
                                </small>

                                <p>
                                    ${escapeHTML(
                                        item.alamat ||
                                        "-"
                                    )}
                                </p>

                            </div>

                        </div>


                        <!-- DESKRIPSI -->

                        ${
                            item.deskripsi
                            ? `

                                <div
                                    class="
                                        detail-description
                                    "
                                >

                                    <i
                                        class="
                                            bi
                                            bi-quote
                                        "
                                    ></i>

                                    <p>
                                        ${escapeHTML(
                                            item.deskripsi
                                        )}
                                    </p>

                                </div>

                            `
                            : ""
                        }


                        <!-- TOMBOL -->

                        <div
                            class="detail-action-buttons"
                        >

                            ${
                                item.maps
                                ? `

                                    <a
                                        href="${item.maps}"
                                        target="_blank"
                                        rel="noopener"
                                        class="
                                            btn-detail
                                            btn-maps
                                        "
                                    >

                                        <i
                                            class="
                                                bi
                                                bi-geo-alt-fill
                                            "
                                        ></i>

                                        Lihat Lokasi

                                    </a>

                                `
                                : ""
                            }


                            ${
                                item.kontak
                                ? `

                                    <a
                                        href="${buatWhatsApp(
                                            item.kontak,
                                            item.nama
                                        )}"
                                        target="_blank"
                                        rel="noopener"
                                        class="
                                            btn-detail
                                            btn-whatsapp
                                        "
                                    >

                                        <i
                                            class="
                                                bi
                                                bi-whatsapp
                                            "
                                        ></i>

                                        Konfirmasi / Hubungi

                                    </a>

                                `
                                : ""
                            }

                        </div>

                    </div>

                </section>


                <!-- =================================
                     VENDOR
                ================================= -->

                ${vendorHTML}


                <!-- =================================
                     SHARE
                ================================= -->

                <section
                    class="undangan-share-section"
                >

                    <div
                        class="undangan-share-box"
                    >

                        <div
                            class="share-icon"
                        >

                            <i
                                class="
                                    bi
                                    bi-share-fill
                                "
                            ></i>

                        </div>


                        <div>

                            <h3>
                                Bagikan Undangan
                            </h3>

                            <p>
                                Bagikan informasi acara
                                ini kepada keluarga,
                                sahabat dan kerabat.
                            </p>

                        </div>


                        <button
                            type="button"
                            class="btn-share-undangan"
                            id="btnShareUndangan"
                        >

                            <i
                                class="
                                    bi
                                    bi-share
                                "
                            ></i>

                            Bagikan

                        </button>

                    </div>

                </section>


                <!-- =================================
                     BACK
                ================================= -->

                <div
                    class="undangan-back-wrapper"
                >

                    <a
                        href="undangan.html"
                        class="btn-back-undangan"
                    >

                        <i
                            class="
                                bi
                                bi-arrow-left
                            "
                        ></i>

                        Kembali ke Kalender Hajatan

                    </a>

                </div>


            </div>

        `;


        /*
         * Tombol share
         */

        const shareButton =
            document.getElementById(
                "btnShareUndangan"
            );


        if (shareButton) {

            shareButton.addEventListener(
                "click",
                () => {

                    shareUndangan(
                        item
                    );

                }
            );

        }


        /*
         * Update title browser
         */

        document.title =
            `${item.nama || "Undangan"} | Plaza Dayeuhluhur`;

    }


    /* =================================================
       VENDOR CARD
    ================================================= */

    function createVendorCard(
        vendor
    ) {

        return `

            <div
                class="detail-vendor-card"
            >

                <div
                    class="vendor-icon"
                >

                    <i
                        class="
                            bi
                            bi-shop-window
                        "
                    ></i>

                </div>


                <div
                    class="vendor-content"
                >

                    <span>
                        ${escapeHTML(
                            vendor.kategori ||
                            "Vendor"
                        )}
                    </span>

                    <h3>
                        ${escapeHTML(
                            vendor.nama ||
                            "Usaha Lokal"
                        )}
                    </h3>


                    ${
                        vendor.id_umkm
                        ? `

                            <a
                                href="umkm.html?id=${vendor.id_umkm}"
                                class="vendor-link"
                            >

                                Lihat Profil UMKM

                                <i
                                    class="
                                        bi
                                        bi-arrow-right
                                    "
                                ></i>

                            </a>

                        `
                        : ""
                    }

                </div>

            </div>

        `;

    }


    /* =================================================
       DAFTAR KALENDER
    ================================================= */

    function renderDaftar(data) {

        const container =
            getContainer();

        if (!container) return;


        /*
         * Hanya aktif
         */

        const events =
            data
                .filter(item =>
                    item.status !== "nonaktif"
                )
                .sort((a, b) =>
                    new Date(a.tanggal) -
                    new Date(b.tanggal)
                );


        /*
         * Kalau HTML punya grid
         */

        if (
            container.id ===
            "undanganGrid"
        ) {

            container.innerHTML =
                events
                    .map(item =>
                        createListCard(item)
                    )
                    .join("");

            return;

        }


        /*
         * Jika belum ada container
         * khusus, buat tampilan daftar
         */

        container.innerHTML = `

            <section
                class="undangan-list-page"
            >

                <div
                    class="undangan-list-heading"
                >

                    <span>
                        <i
                            class="
                                bi
                                bi-calendar-heart
                            "
                        ></i>

                        Kalender Warga
                    </span>

                    <h1>
                        Kalender Hajatan &
                        Undangan Online
                    </h1>

                    <p>
                        Informasi berbagai hajatan
                        warga Dayeuhluhur.
                    </p>

                </div>


                <div
                    class="undangan-list-grid"
                >

                    ${events
                        .map(item =>
                            createListCard(item)
                        )
                        .join("")
                    }

                </div>

            </section>

        `;

    }


    /* =================================================
       CARD DAFTAR
    ================================================= */

    function createListCard(item) {

        const tanggal =
            formatTanggal(
                item.tanggal
            );

        const image =
            item.gambar ||
            "assets/images/default.jpg";


        return `

            <article
                class="undangan-list-card"
            >

                <div
                    class="undangan-list-image"
                >

                    <img
                        src="${image}"
                        alt="${escapeHTML(
                            item.nama
                        )}"
                        loading="lazy"
                        onerror="
                            this.src=
                            'assets/images/default.jpg'
                        "
                    >

                </div>


                <div
                    class="undangan-list-body"
                >

                    <span
                        class="
                            undangan-list-type
                        "
                    >

                        ${escapeHTML(
                            item.jenis ||
                            "Hajatan"
                        )}

                    </span>


                    <h2>
                        ${escapeHTML(
                            item.nama ||
                            "Keluarga"
                        )}
                    </h2>


                    <p
                        class="
                            undangan-list-date
                        "
                    >

                        <i
                            class="
                                bi
                                bi-calendar3
                            "
                        ></i>

                        ${tanggal}

                    </p>


                    <p>

                        <i
                            class="
                                bi
                                bi-geo-alt
                            "
                        ></i>

                        ${escapeHTML(
                            item.desa ||
                            "-"
                        )}

                    </p>


                    <a
                        href="
                            undangan.html?id=${item.id}
                        "
                        class="
                            btn-list-undangan
                        "
                    >

                        Lihat Undangan

                        <i
                            class="
                                bi
                                bi-arrow-right
                            "
                        ></i>

                    </a>

                </div>

            </article>

        `;

    }


    /* =================================================
       FORMAT TANGGAL
    ================================================= */

    function formatTanggal(
        tanggal
    ) {

        if (!tanggal) {
            return "-";
        }

        const date =
            new Date(
                tanggal +
                "T00:00:00"
            );

        return date.toLocaleDateString(
            "id-ID",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    }


    /* =================================================
       WHATSAPP
    ================================================= */

    function buatWhatsApp(
        nomor,
        nama
    ) {

        let phone =
            String(nomor)
                .replace(/\D/g, "");


        /*
         * Jika nomor dimulai 0
         */

        if (
            phone.startsWith("0")
        ) {

            phone =
                "62" +
                phone.substring(1);

        }


        const pesan =
            `Halo, saya mendapatkan informasi ` +
            `Undangan ${nama || "hajatan"} ` +
            `dari Plaza Dayeuhluhur. ` +
            `Saya ingin mendapatkan informasi ` +
            `lebih lanjut. Terima kasih.`;


        return (
            "https://wa.me/" +
            phone +
            "?text=" +
            encodeURIComponent(
                pesan
            )
        );

    }


    /* =================================================
       SHARE
    ================================================= */

    function shareUndangan(
        item
    ) {

        const shareData = {

            title:
                `Undangan ${item.nama}`,

            text:
                `Undangan ${item.nama} - ` +
                `${formatTanggal(
                    item.tanggal
                )}. ` +
                `Lihat selengkapnya di ` +
                `Plaza Dayeuhluhur.`,

            url:
                window.location.href

        };


        /*
         * Browser mendukung Web Share
         */

        if (
            navigator.share
        ) {

            navigator.share(
                shareData
            )

            .catch(() => {});

            return;
        }


        /*
         * Fallback copy URL
         */

        if (
            navigator.clipboard
        ) {

            navigator.clipboard
                .writeText(
                    window.location.href
                )
                .then(() => {

                    alert(
                        "Link undangan berhasil disalin."
                    );

                });

            return;

        }


        alert(
            "Silakan salin alamat halaman " +
            "ini untuk membagikan undangan."
        );

    }


    /* =================================================
       TIDAK DITEMUKAN
    ================================================= */

    function tampilkanTidakDitemukan() {

        const container =
            getContainer();

        if (!container) return;


        container.innerHTML = `

            <div
                class="
                    undangan-error-page
                "
            >

                <div
                    class="
                        undangan-error-icon
                    "
                >

                    <i
                        class="
                            bi
                            bi-envelope-x
                        "
                    ></i>

                </div>


                <h1>
                    Undangan Tidak Ditemukan
                </h1>


                <p>
                    Data undangan yang Anda cari
                    tidak tersedia atau sudah
                    tidak aktif.
                </p>


                <a
                    href="undangan.html"
                    class="
                        btn-back-undangan
                    "
                >

                    <i
                        class="
                            bi
                            bi-arrow-left
                        "
                    ></i>

                    Kembali ke Kalender

                </a>

            </div>

        `;

    }


    /* =================================================
       ERROR
    ================================================= */

    function tampilkanError() {

        const container =
            getContainer();

        if (!container) return;


        container.innerHTML = `

            <div
                class="
                    undangan-error-page
                "
            >

                <div
                    class="
                        undangan-error-icon
                    "
                >

                    <i
                        class="
                            bi
                            bi-exclamation-triangle
                        "
                    ></i>

                </div>


                <h1>
                    Data Belum Dapat Dimuat
                </h1>


                <p>
                    Terjadi masalah saat membaca
                    data Kalender Hajatan.
                </p>

            </div>

        `;

    }


    /* =================================================
       ESCAPE HTML
    ================================================= */

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

});