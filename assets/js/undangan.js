/* =========================================================
   PLAZA DAYEUHLUHUR
   KALENDER HAJATAN WARGA
   UNDANGAN.JS — V1
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       KONFIGURASI
    ====================================================== */

    const DATA_URL = "data/undangan.json";

    let semuaUndangan = [];

    let hasilUndangan = [];

    let currentDate = new Date();

    /* =====================================================
       ELEMENT
    ====================================================== */

    const searchInput =
        document.getElementById("searchUndangan");

    const filterDesa =
        document.getElementById("filterDesa");

    const filterJenis =
        document.getElementById("filterJenis");

    const filterBulan =
        document.getElementById("filterBulan");

    const resetFilter =
        document.getElementById("resetFilter");

    const daftarUndangan =
        document.getElementById("daftarUndangan");

    const hajatanTerdekat =
        document.getElementById("hajatanTerdekat");

    const jumlahHajatan =
        document.getElementById("jumlahHajatan");

    const emptyUndangan =
        document.getElementById("emptyUndangan");

    const loadingUndangan =
        document.getElementById("loadingUndangan");

    const calendarContainer =
        document.getElementById("calendarContainer");

    const calendarMonth =
        document.getElementById("calendarMonth");

    const prevMonth =
        document.getElementById("prevMonth");

    const nextMonth =
        document.getElementById("nextMonth");

    const todayButton =
        document.getElementById("todayButton");

    const modalTitle =
        document.getElementById("modalUndanganTitle");

    const modalBody =
        document.getElementById("modalUndanganBody");

    const btnTambahUndangan =
        document.getElementById("btnTambahUndangan");


    /* =====================================================
       INIT
    ====================================================== */

    init();


    async function init() {

        try {

            await loadUndangan();

            setupFilter();

            setupCalendar();

            renderAll();

        } catch (error) {

            console.error(
                "Gagal memuat data undangan:",
                error
            );

            showLoadError();

        }

    }


    /* =====================================================
       LOAD JSON
    ====================================================== */

    async function loadUndangan() {

        const response =
            await fetch(DATA_URL);

        if (!response.ok) {

            throw new Error(
                `HTTP Error ${response.status}`
            );

        }

        const data =
            await response.json();

        if (!Array.isArray(data)) {

            throw new Error(
                "Format undangan.json harus berupa array."
            );

        }

        semuaUndangan =
            data
                .filter(item => item.status !== "nonaktif")
                .map(normalizeData);

        hasilUndangan =
            [...semuaUndangan];

        console.log(
            `Berhasil membaca ${semuaUndangan.length} data hajatan.`
        );

    }


    /* =====================================================
       NORMALIZE DATA
    ====================================================== */

    function normalizeData(item) {

        return {

            id:
                item.id ?? "",

            slug:
                item.slug ?? "",

            status:
                item.status ?? "aktif",

            jenis:
                item.jenis ?? "Hajatan",

            judul:
                item.judul ?? "Undangan Hajatan",

            nama:
                item.nama ?? "Nama Keluarga",

            tanggal:
                item.tanggal ?? "",

            hari:
                item.hari ?? "",

            waktu:
                item.waktu ?? "",

            desa:
                item.desa ?? "",

            dusun:
                item.dusun ?? "",

            alamat:
                item.alamat ?? "",

            latitude:
                item.latitude ?? "",

            longitude:
                item.longitude ?? "",

            gambar:
                item.gambar ||
                "assets/images/default.jpg",

            hiburan:
                item.hiburan ?? "",

            deskripsi:
                item.deskripsi ?? "",

            maps:
                item.maps ?? "",

            kontak:
                item.kontak ?? "",

            vendor:
                Array.isArray(item.vendor)
                    ? item.vendor
                    : []

        };

    }


    /* =====================================================
       FILTER SETUP
    ====================================================== */

    function setupFilter() {

        searchInput?.addEventListener(
            "input",
            applyFilters
        );

        filterDesa?.addEventListener(
            "change",
            applyFilters
        );

        filterJenis?.addEventListener(
            "change",
            applyFilters
        );

        filterBulan?.addEventListener(
            "change",
            applyFilters
        );

        resetFilter?.addEventListener(
            "click",
            resetFilters
        );

    }


    /* =====================================================
       POPULATE FILTER
    ====================================================== */

    function populateFilters() {

        const desaSet =
            new Set();

        const jenisSet =
            new Set();

        semuaUndangan.forEach(item => {

            if (item.desa) {

                desaSet.add(
                    item.desa
                );

            }

            if (item.jenis) {

                jenisSet.add(
                    item.jenis
                );

            }

        });


        /* ===============================
           DESA
        =============================== */

        if (filterDesa) {

            const currentValue =
                filterDesa.value;

            filterDesa.innerHTML =
                `
                <option value="">
                    Semua Desa
                </option>
                `;

            [...desaSet]
                .sort((a, b) =>
                    a.localeCompare(b, "id")
                )
                .forEach(desa => {

                    const option =
                        document.createElement("option");

                    option.value =
                        desa;

                    option.textContent =
                        desa;

                    filterDesa.appendChild(
                        option
                    );

                });

            filterDesa.value =
                currentValue;

        }


        /* ===============================
           JENIS
        =============================== */

        if (filterJenis) {

            const currentValue =
                filterJenis.value;

            filterJenis.innerHTML =
                `
                <option value="">
                    Semua Acara
                </option>
                `;

            [...jenisSet]
                .sort((a, b) =>
                    a.localeCompare(b, "id")
                )
                .forEach(jenis => {

                    const option =
                        document.createElement("option");

                    option.value =
                        jenis;

                    option.textContent =
                        jenis;

                    filterJenis.appendChild(
                        option
                    );

                });

            filterJenis.value =
                currentValue;

        }


        /* ===============================
           BULAN
        =============================== */

        if (filterBulan) {

            const bulanList = [

                "Januari",
                "Februari",
                "Maret",
                "April",
                "Mei",
                "Juni",
                "Juli",
                "Agustus",
                "September",
                "Oktober",
                "November",
                "Desember"

            ];

            filterBulan.innerHTML =
                `
                <option value="">
                    Semua Bulan
                </option>
                `;

            bulanList.forEach(
                (bulan, index) => {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        String(index + 1)
                            .padStart(2, "0");

                    option.textContent =
                        bulan;

                    filterBulan.appendChild(
                        option
                    );

                }
            );

        }

    }


    /* =====================================================
       APPLY FILTER
    ====================================================== */

    function applyFilters() {

        const keyword =
            (searchInput?.value || "")
                .trim()
                .toLowerCase();

        const desa =
            filterDesa?.value || "";

        const jenis =
            filterJenis?.value || "";

        const bulan =
            filterBulan?.value || "";


        hasilUndangan =
            semuaUndangan.filter(item => {

                const searchText = [

                    item.nama,
                    item.judul,
                    item.jenis,
                    item.desa,
                    item.dusun,
                    item.alamat,
                    item.hiburan

                ]
                    .join(" ")
                    .toLowerCase();


                const matchKeyword =
                    !keyword ||
                    searchText.includes(
                        keyword
                    );


                const matchDesa =
                    !desa ||
                    item.desa === desa;


                const matchJenis =
                    !jenis ||
                    item.jenis === jenis;


                const itemMonth =
                    getMonthFromDate(
                        item.tanggal
                    );


                const matchBulan =
                    !bulan ||
                    itemMonth === bulan;


                return (
                    matchKeyword &&
                    matchDesa &&
                    matchJenis &&
                    matchBulan
                );

            });


        renderDaftar();

        updateJumlah();

    }


    /* =====================================================
       RESET FILTER
    ====================================================== */

    function resetFilters() {

        if (searchInput) {

            searchInput.value = "";

        }

        if (filterDesa) {

            filterDesa.value = "";

        }

        if (filterJenis) {

            filterJenis.value = "";

        }

        if (filterBulan) {

            filterBulan.value = "";

        }

        hasilUndangan =
            [...semuaUndangan];

        renderDaftar();

        updateJumlah();

    }


    /* =====================================================
       RENDER ALL
    ====================================================== */

    function renderAll() {

        populateFilters();

        renderTerdekat();

        renderDaftar();

        renderCalendar();

        updateJumlah();

        hideLoading();

    }


    /* =====================================================
       UPDATE JUMLAH
    ====================================================== */

    function updateJumlah() {

        if (!jumlahHajatan) {

            return;

        }

        jumlahHajatan.textContent =
            `${hasilUndangan.length} Hajatan`;

    }


    /* =====================================================
       RENDER HAJATAN TERDEKAT
    ====================================================== */

    function renderTerdekat() {

        if (!hajatanTerdekat) {

            return;

        }

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        const upcoming =
            semuaUndangan

                .filter(item => {

                    const date =
                        parseDate(
                            item.tanggal
                        );

                    return (
                        date &&
                        date >= today
                    );

                })

                .sort((a, b) => {

                    return (
                        parseDate(a.tanggal) -
                        parseDate(b.tanggal)
                    );

                })

                .slice(0, 3);


        if (!upcoming.length) {

            hajatanTerdekat.innerHTML =
                `
                <div class="col-12">
                    <div class="empty-undangan">
                        <div class="empty-icon">
                            <i class="bi bi-calendar-x"></i>
                        </div>

                        <h3>
                            Belum Ada Hajatan Mendatang
                        </h3>

                        <p>
                            Data hajatan warga akan
                            ditampilkan di sini.
                        </p>
                    </div>
                </div>
                `;

            return;

        }


        hajatanTerdekat.innerHTML =
            upcoming
                .map(item =>
                    createCard(
                        item,
                        true
                    )
                )
                .join("");

    }


    /* =====================================================
       RENDER DAFTAR
    ====================================================== */

    function renderDaftar() {

        if (!daftarUndangan) {

            return;

        }


        const sorted =
            [...hasilUndangan]
                .sort((a, b) => {

                    return (
                        parseDate(a.tanggal) -
                        parseDate(b.tanggal)
                    );

                });


        if (!sorted.length) {

            daftarUndangan.innerHTML =
                "";

            emptyUndangan?.classList.remove(
                "d-none"
            );

            return;

        }


        emptyUndangan?.classList.add(
            "d-none"
        );


        daftarUndangan.innerHTML =
            sorted
                .map(item =>
                    createCard(
                        item,
                        false
                    )
                )
                .join("");

    }


    /* =====================================================
       CREATE CARD
    ====================================================== */

    function createCard(
        item,
        featured = false
    ) {

        const date =
            parseDate(
                item.tanggal
            );


        const day =
            date
                ? String(
                    date.getDate()
                )
                : "--";


        const month =
            date
                ? getShortMonth(
                    date.getMonth()
                )
                : "---";


        const image =
            escapeAttribute(
                item.gambar
            );


        const nama =
            escapeHTML(
                item.nama
            );


        const jenis =
            escapeHTML(
                item.jenis
            );


        const judul =
            escapeHTML(
                item.judul
            );


        const desa =
            escapeHTML(
                item.desa
            );


        const alamat =
            escapeHTML(
                item.alamat
            );


        const waktu =
            escapeHTML(
                item.waktu
            );


        const hiburan =
            escapeHTML(
                item.hiburan
            );


        return `
            <div class="col-lg-4 col-md-6">

                <article
                    class="hajatan-card ${
                        featured
                            ? "hajatan-featured"
                            : ""
                    }"
                >

                    <div class="hajatan-card-image">

                        <img
                            src="${image}"
                            alt="${nama}"
                            loading="lazy"
                            onerror="this.src='assets/images/default.jpg'"
                        >


                        <div class="hajatan-date">

                            <span
                                class="hajatan-date-day"
                            >
                                ${day}
                            </span>

                            <span
                                class="hajatan-date-month"
                            >
                                ${month}
                            </span>

                        </div>


                        <span class="hajatan-type">

                            ${getIconJenis(item.jenis)}

                            ${jenis}

                        </span>

                    </div>


                    <div class="hajatan-card-body">

                        <h3>
                            ${nama}
                        </h3>

                        <div class="judul-acara">
                            ${judul}
                        </div>


                        ${
                            item.tanggal
                                ? `
                                <div class="hajatan-info">

                                    <i class="bi bi-calendar3"></i>

                                    <span>
                                        ${formatTanggal(
                                            item.tanggal
                                        )}
                                    </span>

                                </div>
                                `
                                : ""
                        }


                        ${
                            item.waktu
                                ? `
                                <div class="hajatan-info">

                                    <i class="bi bi-clock"></i>

                                    <span>
                                        ${waktu}
                                    </span>

                                </div>
                                `
                                : ""
                        }


                        ${
                            item.alamat
                                ? `
                                <div class="hajatan-info">

                                    <i class="bi bi-geo-alt"></i>

                                    <span>
                                        ${alamat}
                                    </span>

                                </div>
                                `
                                : `
                                <div class="hajatan-info">

                                    <i class="bi bi-geo-alt"></i>

                                    <span>
                                        ${desa}
                                    </span>

                                </div>
                                `
                        }


                        ${
                            item.hiburan
                                ? `
                                <div class="hajatan-hiburan">

                                    <strong>
                                        <i class="bi bi-music-note-beamed"></i>
                                        Hiburan
                                    </strong>

                                    <span>
                                        ${hiburan}
                                    </span>

                                </div>
                                `
                                : ""
                        }

                    </div>


                    <div class="hajatan-card-footer">

                        <button
                            type="button"
                            class="btn btn-undangan"
                            onclick="window.bukaUndangan(${item.id})"
                        >

                            <i class="bi bi-envelope-open me-1"></i>

                            Lihat Undangan

                        </button>


                        ${
                            item.maps
                                ? `
                                <a
                                    href="${escapeAttribute(
                                        item.maps
                                    )}"
                                    target="_blank"
                                    rel="noopener"
                                    class="btn btn-outline-primary"
                                >

                                    <i class="bi bi-geo-alt"></i>

                                </a>
                                `
                                : ""
                        }

                    </div>

                </article>

            </div>
        `;

    }


    /* =====================================================
       DETAIL UNDANGAN
    ====================================================== */

    window.bukaUndangan =
        function(id) {

            const item =
                semuaUndangan.find(
                    data =>
                        String(data.id) ===
                        String(id)
                );


            if (!item) {

                console.warn(
                    "Data undangan tidak ditemukan:",
                    id
                );

                return;

            }


            renderModal(item);

        };


    function renderModal(item) {

        if (!modalTitle ||
            !modalBody) {

            return;

        }


        modalTitle.textContent =
            item.judul ||
            "Detail Undangan";


        const vendorHTML =
            createVendorHTML(
                item.vendor
            );


        const whatsappLink =
            createWhatsAppLink(
                item
            );


        const mapsLink =
            createMapsLink(
                item
            );


        modalBody.innerHTML =
            `

            ${
                item.gambar
                    ? `
                    <img
                        src="${escapeAttribute(
                            item.gambar
                        )}"
                        class="detail-undangan-cover"
                        alt="${escapeAttribute(
                            item.nama
                        )}"
                        onerror="this.style.display='none'"
                    >
                    `
                    : ""
            }


            <div class="text-center mb-4">

                <div class="section-label justify-content-center">

                    ${getIconJenis(item.jenis)}

                    ${escapeHTML(
                        item.jenis
                    )}

                </div>


                <h2 class="detail-undangan-title">

                    ${escapeHTML(
                        item.nama
                    )}

                </h2>


                <div class="detail-undangan-type">

                    ${escapeHTML(
                        item.judul
                    )}

                </div>

            </div>


            ${
                item.deskripsi
                    ? `
                    <div class="mb-4">

                        <p
                            class="text-center"
                            style="
                                font-size:13px;
                                line-height:1.8;
                                color:#6b7280;
                            "
                        >
                            ${escapeHTML(
                                item.deskripsi
                            )}
                        </p>

                    </div>
                    `
                    : ""
            }


            <div class="row g-2 mb-3">

                ${
                    item.tanggal
                        ? `
                        <div class="col-md-6">

                            <div class="detail-info-box">

                                <i class="bi bi-calendar-event"></i>

                                <div>

                                    <strong>
                                        Tanggal
                                    </strong>

                                    <span>
                                        ${formatTanggal(
                                            item.tanggal
                                        )}
                                    </span>

                                </div>

                            </div>

                        </div>
                        `
                        : ""
                }


                ${
                    item.waktu
                        ? `
                        <div class="col-md-6">

                            <div class="detail-info-box">

                                <i class="bi bi-clock"></i>

                                <div>

                                    <strong>
                                        Waktu
                                    </strong>

                                    <span>
                                        ${escapeHTML(
                                            item.waktu
                                        )}
                                    </span>

                                </div>

                            </div>

                        </div>
                        `
                        : ""
                }


                ${
                    item.alamat
                        ? `
                        <div class="col-12">

                            <div class="detail-info-box">

                                <i class="bi bi-geo-alt"></i>

                                <div>

                                    <strong>
                                        Lokasi Acara
                                    </strong>

                                    <span>
                                        ${escapeHTML(
                                            item.alamat
                                        )}
                                    </span>

                                </div>

                            </div>

                        </div>
                        `
                        : ""
                }


                ${
                    item.hiburan
                        ? `
                        <div class="col-12">

                            <div class="detail-info-box">

                                <i class="bi bi-music-note-beamed"></i>

                                <div>

                                    <strong>
                                        Hiburan
                                    </strong>

                                    <span>
                                        ${escapeHTML(
                                            item.hiburan
                                        )}
                                    </span>

                                </div>

                            </div>

                        </div>
                        `
                        : ""
                }

            </div>


            ${
                vendorHTML
                    ? `
                    <div class="mt-4">

                        <h5
                            class="mb-3"
                            style="
                                color:#172033;
                                font-size:16px;
                                font-weight:700;
                            "
                        >
                            <i
                                class="bi bi-shop me-2"
                                style="color:#0d6efd;"
                            ></i>

                            Vendor Pendukung
                        </h5>

                        ${vendorHTML}

                    </div>
                    `
                    : ""
            }


            <div
                class="d-flex flex-wrap gap-2 mt-4"
            >

                ${
                    whatsappLink
                        ? `
                        <a
                            href="${whatsappLink}"
                            target="_blank"
                            rel="noopener"
                            class="btn btn-success"
                        >

                            <i class="bi bi-whatsapp me-2"></i>

                            Hubungi

                        </a>
                        `
                        : ""
                }


                ${
                    mapsLink
                        ? `
                        <a
                            href="${mapsLink}"
                            target="_blank"
                            rel="noopener"
                            class="btn btn-outline-primary"
                        >

                            <i class="bi bi-geo-alt me-2"></i>

                            Google Maps

                        </a>
                        `
                        : ""
                }


                <button
                    type="button"
                    class="btn btn-outline-secondary"
                    onclick="window.bagikanUndangan(${item.id})"
                >

                    <i class="bi bi-share me-2"></i>

                    Bagikan

                </button>

            </div>

        `;


        const modalElement =
            document.getElementById(
                "modalUndangan"
            );


        if (modalElement) {

            const modal =
                bootstrap.Modal.getOrCreateInstance(
                    modalElement
                );

            modal.show();

        }

    }


    /* =====================================================
       VENDOR
    ====================================================== */

    function createVendorHTML(vendors) {

        if (!Array.isArray(vendors) ||
            vendors.length === 0) {

            return "";

        }


        return vendors
            .map(vendor => {

                return `
                    <div
                        class="detail-info-box"
                        style="
                            margin-bottom:8px;
                        "
                    >

                        <i
                            class="bi bi-shop"
                        ></i>

                        <div>

                            <strong>
                                ${escapeHTML(
                                    vendor.kategori ||
                                    "Vendor"
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    vendor.nama ||
                                    "Vendor"
                                )}
                            </span>

                        </div>

                    </div>
                `;

            })
            .join("");

    }


    /* =====================================================
       WHATSAPP
    ====================================================== */

    function createWhatsAppLink(item) {

        if (!item.kontak) {

            return "";

        }


        let nomor =
            String(item.kontak)
                .replace(/\D/g, "");


        if (
            nomor.startsWith("0")
        ) {

            nomor =
                "62" +
                nomor.substring(1);

        }


        const text =
            `Halo, saya mendapatkan informasi ` +
            `hajatan ${item.nama} ` +
            `di Plaza Dayeuhluhur. ` +
            `Saya ingin menghubungi keluarga ` +
            `terkait acara tersebut.`;


        return `
            https://wa.me/${nomor}?text=${
                encodeURIComponent(text)
            }
        `;

    }


    /* =====================================================
       GOOGLE MAPS
    ====================================================== */

    function createMapsLink(item) {

        if (item.maps) {

            return escapeAttribute(
                item.maps
            );

        }


        if (
            item.latitude &&
            item.longitude
        ) {

            return `
                https://www.google.com/maps?q=${
                    item.latitude
                },${
                    item.longitude
                }
            `;

        }


        if (item.alamat) {

            return `
                https://www.google.com/maps/search/?api=1&query=${
                    encodeURIComponent(
                        item.alamat
                    )
                }
            `;

        }


        return "";

    }


    /* =====================================================
       BAGIKAN
    ====================================================== */

    window.bagikanUndangan =
        async function(id) {

            const item =
                semuaUndangan.find(
                    data =>
                        String(data.id) ===
                        String(id)
                );


            if (!item) {

                return;

            }


            const url =
                window.location.href
                .split("#")[0];


            const shareData = {

                title:
                    `${item.judul} - ${item.nama}`,

                text:
                    `Undangan ${item.nama} - ` +
                    `Plaza Dayeuhluhur`,

                url:
                    url

            };


            try {

                if (
                    navigator.share
                ) {

                    await navigator.share(
                        shareData
                    );

                } else {

                    await navigator.clipboard.writeText(
                        url
                    );

                    alert(
                        "Link undangan berhasil disalin."
                    );

                }

            } catch (error) {

                console.log(
                    "Share dibatalkan:",
                    error
                );

            }

        };


    /* =====================================================
       CALENDAR SETUP
    ====================================================== */

    function setupCalendar() {

        prevMonth?.addEventListener(
            "click",
            () => {

                currentDate.setMonth(
                    currentDate.getMonth() - 1
                );

                renderCalendar();

            }
        );


        nextMonth?.addEventListener(
            "click",
            () => {

                currentDate.setMonth(
                    currentDate.getMonth() + 1
                );

                renderCalendar();

            }
        );


        todayButton?.addEventListener(
            "click",
            () => {

                currentDate =
                    new Date();

                renderCalendar();

            }
        );

    }


    /* =====================================================
       RENDER CALENDAR
    ====================================================== */

    function renderCalendar() {

        if (!calendarContainer) {

            return;

        }


        const year =
            currentDate.getFullYear();

        const month =
            currentDate.getMonth();


        const monthNames = [

            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember"

        ];


        if (calendarMonth) {

            calendarMonth.textContent =
                `${monthNames[month]} ${year}`;

        }


        const firstDay =
            new Date(
                year,
                month,
                1
            );


        const lastDay =
            new Date(
                year,
                month + 1,
                0
            );


        let startDay =
            firstDay.getDay();


        /*
         * Mengubah posisi agar Senin
         * menjadi hari pertama.
         */

        startDay =
            startDay === 0
                ? 6
                : startDay - 1;


        const daysInMonth =
            lastDay.getDate();


        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        let html =
            `
            <div class="calendar-grid">

                <div class="calendar-weekday">
                    Sen
                </div>

                <div class="calendar-weekday">
                    Sel
                </div>

                <div class="calendar-weekday">
                    Rab
                </div>

                <div class="calendar-weekday">
                    Kam
                </div>

                <div class="calendar-weekday">
                    Jum
                </div>

                <div class="calendar-weekday">
                    Sab
                </div>

                <div class="calendar-weekday">
                    Min
                </div>
            `;


        /* ===============================
           EMPTY BEFORE MONTH
        =============================== */

        for (
            let i = 0;
            i < startDay;
            i++
        ) {

            html +=
                `
                <div class="calendar-day empty">
                </div>
                `;

        }


        /* ===============================
           DAYS
        =============================== */

        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {

            const date =
                new Date(
                    year,
                    month,
                    day
                );


            const dateString =
                formatDateISO(
                    date
                );


            const events =
                semuaUndangan.filter(
                    item =>
                        item.tanggal ===
                        dateString
                );


            const isToday =
                date.getTime() ===
                today.getTime();


            html +=
                `
                <div
                    class="
                        calendar-day
                        ${
                            isToday
                                ? "today"
                                : ""
                        }
                    "
                    data-date="${dateString}"
                >

                    <div class="calendar-day-number">

                        <span>
                            ${day}
                        </span>

                        ${
                            events.length
                                ? `
                                <i
                                    class="bi bi-calendar-heart"
                                    style="
                                        color:#0d6efd;
                                        font-size:10px;
                                    "
                                ></i>
                                `
                                : ""
                        }

                    </div>
                `;


            events
                .slice(0, 2)
                .forEach(
                    event => {

                        html +=
                            `
                            <div
                                class="calendar-event"
                                onclick="window.bukaUndangan(${event.id})"
                            >
                                ${escapeHTML(
                                    event.nama
                                )}
                            </div>
                            `;

                    }
                );


            if (events.length > 2) {

                html +=
                    `
                    <div
                        class="
                            calendar-event
                            more
                        "
                    >
                        +${events.length - 2}
                        lainnya
                    </div>
                    `;

            }


            html +=
                `
                </div>
                `;

        }


        html +=
            `</div>`;


        calendarContainer.innerHTML =
            html;


        setupCalendarDayClick();

    }


    /* =====================================================
       CALENDAR DAY CLICK
    ====================================================== */

    function setupCalendarDayClick() {

        const days =
            document.querySelectorAll(
                ".calendar-day:not(.empty)"
            );


        days.forEach(day => {

            day.addEventListener(
                "click",
                event => {

                    /*
                     * Jika yang diklik adalah
                     * event langsung, biarkan
                     * tombol event bekerja.
                     */

                    if (
                        event.target.closest(
                            ".calendar-event"
                        )
                    ) {

                        return;

                    }


                    const date =
                        day.dataset.date;


                    if (!date) {

                        return;

                    }


                    const events =
                        semuaUndangan.filter(
                            item =>
                                item.tanggal ===
                                date
                        );


                    if (!events.length) {

                        return;

                    }


                    hasilUndangan =
                        [...events];


                    renderDaftar();

                    updateJumlah();


                    const daftar =
                        document.getElementById(
                            "daftarUndangan"
                        );


                    if (daftar) {

                        daftar.scrollIntoView({

                            behavior: "smooth",

                            block: "start"

                        });

                    }

                }
            );

        });

    }


    /* =====================================================
       DATE HELPERS
    ====================================================== */

    function parseDate(value) {

        if (!value) {

            return null;

        }


        /*
         * Format yang diharapkan:
         * YYYY-MM-DD
         */

        const parts =
            String(value)
                .split("-");


        if (
            parts.length !== 3
        ) {

            return new Date(value);

        }


        const year =
            Number(parts[0]);

        const month =
            Number(parts[1]) - 1;

        const day =
            Number(parts[2]);


        const date =
            new Date(
                year,
                month,
                day
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return null;

        }


        return date;

    }


    function formatDateISO(date) {

        const year =
            date.getFullYear();


        const month =
            String(
                date.getMonth() + 1
            )
                .padStart(2, "0");


        const day =
            String(
                date.getDate()
            )
                .padStart(2, "0");


        return `${year}-${month}-${day}`;

    }


    function getMonthFromDate(value) {

        if (!value) {

            return "";

        }


        const parts =
            String(value)
                .split("-");


        if (
            parts.length < 2
        ) {

            return "";

        }


        return parts[1];

    }


    function formatTanggal(value) {

        const date =
            parseDate(value);


        if (!date) {

            return value || "-";

        }


        return new Intl.DateTimeFormat(
            "id-ID",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        ).format(date);

    }


    function getShortMonth(monthIndex) {

        const months = [

            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Mei",
            "Jun",
            "Jul",
            "Agu",
            "Sep",
            "Okt",
            "Nov",
            "Des"

        ];


        return months[
            monthIndex
        ] || "---";

    }


    /* =====================================================
       ICON JENIS
    ====================================================== */

    function getIconJenis(jenis) {

        const value =
            String(
                jenis || ""
            ).toLowerCase();


        if (
            value.includes(
                "nikah"
            ) ||
            value.includes(
                "pernikahan"
            )
        ) {

            return "💍";

        }


        if (
            value.includes(
                "khitan"
            ) ||
            value.includes(
                "sunat"
            )
        ) {

            return "🎉";

        }


        if (
            value.includes(
                "pengajian"
            )
        ) {

            return "🕌";

        }


        if (
            value.includes(
                "syukuran"
            )
        ) {

            return "🙏";

        }


        if (
            value.includes(
                "hiburan"
            )
        ) {

            return "🎵";

        }


        return "📅";

    }


    /* =====================================================
       ESCAPE HTML
    ====================================================== */

    function escapeHTML(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";

        }


        return String(value)
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


    /* =====================================================
       LOADING
    ====================================================== */

    function hideLoading() {

        loadingUndangan?.classList.add(
            "d-none"
        );

    }


    function showLoadError() {

        hideLoading();


        if (!emptyUndangan) {

            emptyUndangan.classList.remove(
                "d-none"
            );


            emptyUndangan.innerHTML =
                `
                <div class="empty-icon">

                    <i
                        class="bi bi-exclamation-triangle"
                    ></i>

                </div>

                <h3>
                    Data Belum Dapat Dimuat
                </h3>

                <p>
                    Pastikan file
                    <strong>
                        data/undangan.json
                    </strong>
                    tersedia dan format JSON
                    sudah benar.
                </p>
                `;

        }

    }


    /* =====================================================
       TAMBAH UNDANGAN
    ====================================================== */

    btnTambahUndangan?.addEventListener(
        "click",
        () => {

            alert(
                "Fitur pengajuan hajatan akan kita aktifkan pada tahap berikutnya."
            );

        }
    );

});