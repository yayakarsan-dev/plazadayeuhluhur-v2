```javascript
/* =====================================================
   PLAZA DAYEUHLUHUR
   UMKM MANAGEMENT ENGINE V2
   Form Tambah & Simpan UMKM
   Penyimpanan: localStorage
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("====================================");
    console.log("PLAZA DAYEUHLUHUR");
    console.log("UMKM MANAGEMENT ENGINE V2");
    console.log("====================================");


    /* =================================================
       ELEMENT
    ================================================= */

    const daftarUMKM =
        document.getElementById("daftarUMKM");

    const emptyUMKM =
        document.getElementById("emptyUMKM");

    const modalUMKM =
        document.getElementById("modalUMKM");

    const formUMKM =
        document.getElementById("formUMKM");

    const btnTambahUMKM =
        document.getElementById("btnTambahUMKM");

    const btnTutupModal =
        document.getElementById("btnTutupModal");

    const btnBatal =
        document.getElementById("btnBatal");

    const searchUMKM =
        document.getElementById("searchUMKM");

    const filterKategori =
        document.getElementById("filterKategori");

    const filterDesa =
        document.getElementById("filterDesa");

    const totalUMKM =
        document.getElementById("totalUMKM");

    const totalJasa =
        document.getElementById("totalJasa");

    const totalKuliner =
        document.getElementById("totalKuliner");

    const totalPerdagangan =
        document.getElementById("totalPerdagangan");


    /* =================================================
       STORAGE KEY
    ================================================= */

    const STORAGE_KEY =
        "plaza_dayeuhluhur_umkm";


    /* =================================================
       DATA
    ================================================= */

    let dataUMKM = [];


    /* =================================================
       CEK HALAMAN
    ================================================= */

    /*
       File ini khusus untuk halaman ADMIN UMKM.
       Jika elemen utama tidak tersedia, engine tidak
       dijalankan.
    */

    if (
        !daftarUMKM ||
        !emptyUMKM ||
        !formUMKM
    ) {

        console.log(
            "UMKM Management Engine: " +
            "halaman admin tidak terdeteksi."
        );

        return;

    }


    /* =================================================
       LOAD DATA
    ================================================= */

    function loadData() {

        const dataLocal =
            localStorage.getItem(STORAGE_KEY);


        if (dataLocal) {

            try {

                dataUMKM =
                    JSON.parse(dataLocal);


                if (!Array.isArray(dataUMKM)) {

                    dataUMKM = [];

                }


                console.log(
                    "Data UMKM dari localStorage:",
                    dataUMKM.length
                );


                renderUMKM();

            }

            catch (error) {

                console.error(
                    "localStorage rusak:",
                    error
                );


                loadJSON();

            }

        }

        else {

            loadJSON();

        }

    }


    /* =================================================
       LOAD DATA DARI JSON
    ================================================= */

    async function loadJSON() {

        try {

            /*
               Lokasi JSON:
               data/umkm.json
            */

            const response =
                await fetch(
                    "data/umkm.json",
                    {
                        cache: "no-store"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Gagal mengambil data/umkm.json"
                );

            }


            const data =
                await response.json();


            dataUMKM =
                Array.isArray(data)
                    ? data
                    : [];


            console.log(
                "Data UMKM dari umkm.json:",
                dataUMKM.length
            );


            saveLocalStorage();


            renderUMKM();

        }

        catch (error) {

            console.error(
                "Error load data/umkm.json:",
                error
            );


            dataUMKM = [];


            renderUMKM();

        }

    }


    /* =================================================
       SAVE LOCAL STORAGE
    ================================================= */

    function saveLocalStorage() {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(dataUMKM)
        );


        console.log(
            "Data UMKM berhasil disimpan ke localStorage."
        );

    }


    /* =================================================
       RENDER UMKM
    ================================================= */

    function renderUMKM() {

        const keyword =
            searchUMKM
                ? searchUMKM.value
                    .toLowerCase()
                    .trim()
                : "";


        const kategori =
            filterKategori
                ? filterKategori.value
                : "";


        const desa =
            filterDesa
                ? filterDesa.value
                : "";


        const hasil =
            dataUMKM.filter(
                function (umkm) {

                    const cocokNama =
                        String(
                            umkm.nama || ""
                        )
                        .toLowerCase()
                        .includes(keyword);


                    const cocokKategori =
                        !kategori ||
                        umkm.kategori === kategori;


                    const cocokDesa =
                        !desa ||
                        umkm.desa === desa;


                    return (
                        cocokNama &&
                        cocokKategori &&
                        cocokDesa
                    );

                }
            );


        daftarUMKM.innerHTML = "";


        if (hasil.length === 0) {

            if (emptyUMKM) {

                emptyUMKM.style.display =
                    "block";

            }

        }

        else {

            if (emptyUMKM) {

                emptyUMKM.style.display =
                    "none";

            }


            hasil.forEach(
                function (umkm) {

                    const card =
                        document.createElement("div");


                    card.className =
                        "umkm-card";


                    /*
                       Data yang ditampilkan
                    */

                    const kategoriText =
                        escapeHTML(
                            umkm.kategori ||
                            "Lainnya"
                        );


                    const namaText =
                        escapeHTML(
                            umkm.nama ||
                            "-"
                        );


                    const desaText =
                        escapeHTML(
                            umkm.desa ||
                            "-"
                        );


                    const produkText =
                        escapeHTML(
                            umkm.produk ||
                            "-"
                        );


                    const ratingText =
                        escapeHTML(
                            umkm.rating ||
                            "0"
                        );


                    /*
                       HTML kartu UMKM
                       sengaja menggunakan string biasa
                       agar tidak terjadi masalah backtick.
                    */

                    card.innerHTML =
                        '<span class="umkm-kategori">' +
                            kategoriText +
                        '</span>' +

                        '<h3>' +
                            namaText +
                        '</h3>' +

                        '<div class="umkm-info">' +
                            '📍 ' +
                            desaText +
                        '</div>' +

                        '<div class="umkm-info">' +
                            '🛍️ ' +
                            produkText +
                        '</div>' +

                        '<div class="umkm-rating">' +
                            '⭐ ' +
                            ratingText +
                        '</div>';


                    daftarUMKM.appendChild(
                        card
                    );

                }
            );

        }


        updateStatistik();
        updateFilterDesa();

    }


    /* =================================================
       UPDATE STATISTIK
    ================================================= */

    function updateStatistik() {

        if (totalUMKM) {

            totalUMKM.textContent =
                dataUMKM.length;

        }


        if (totalJasa) {

            totalJasa.textContent =
                dataUMKM.filter(
                    function (item) {

                        return (
                            item.kategori ===
                            "Jasa"
                        );

                    }
                ).length;

        }


        if (totalKuliner) {

            totalKuliner.textContent =
                dataUMKM.filter(
                    function (item) {

                        return (
                            item.kategori ===
                            "Kuliner"
                        );

                    }
                ).length;

        }


        if (totalPerdagangan) {

            totalPerdagangan.textContent =
                dataUMKM.filter(
                    function (item) {

                        return (
                            item.kategori ===
                            "Perdagangan"
                        );

                    }
                ).length;

        }

    }


    /* =================================================
       UPDATE FILTER DESA
    ================================================= */

    function updateFilterDesa() {

        if (!filterDesa) {
            return;
        }


        const desaSaatIni =
            filterDesa.value;


        const daftarDesa =
            [
                ...new Set(
                    dataUMKM
                        .map(
                            function (item) {
                                return item.desa;
                            }
                        )
                        .filter(Boolean)
                )
            ]
            .sort();


        filterDesa.innerHTML =
            '<option value="">Semua Desa</option>';


        daftarDesa.forEach(
            function (desa) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    desa;


                option.textContent =
                    desa;


                filterDesa.appendChild(
                    option
                );

            }
        );


        if (
            daftarDesa.includes(
                desaSaatIni
            )
        ) {

            filterDesa.value =
                desaSaatIni;

        }

    }


    /* =================================================
       BUKA MODAL
    ================================================= */

    function bukaModal() {

        if (!modalUMKM) {
            return;
        }


        modalUMKM.classList.add(
            "active"
        );


        const inputNama =
            document.getElementById(
                "namaUMKM"
            );


        if (inputNama) {

            inputNama.focus();

        }

    }


    /* =================================================
       TUTUP MODAL
    ================================================= */

    function tutupModal() {

        if (modalUMKM) {

            modalUMKM.classList.remove(
                "active"
            );

        }


        if (formUMKM) {

            formUMKM.reset();

        }


        const rating =
            document.getElementById(
                "ratingUMKM"
            );


        if (rating) {

            rating.value = "5";

        }

    }


    /* =================================================
       SIMPAN UMKM
    ================================================= */

    function simpanUMKM(event) {

        event.preventDefault();


        const namaElement =
            document.getElementById(
                "namaUMKM"
            );


        const kategoriElement =
            document.getElementById(
                "kategoriUMKM"
            );


        const desaElement =
            document.getElementById(
                "desaUMKM"
            );


        const produkElement =
            document.getElementById(
                "produkUMKM"
            );


        const ratingElement =
            document.getElementById(
                "ratingUMKM"
            );


        const whatsappElement =
            document.getElementById(
                "whatsappUMKM"
            );


        const deskripsiElement =
            document.getElementById(
                "deskripsiUMKM"
            );


        const nama =
            namaElement
                ? namaElement.value.trim()
                : "";


        const kategori =
            kategoriElement
                ? kategoriElement.value
                : "";


        const desa =
            desaElement
                ? desaElement.value.trim()
                : "";


        const produk =
            produkElement
                ? produkElement.value.trim()
                : "";


        const rating =
            ratingElement
                ? ratingElement.value
                : "5";


        const whatsapp =
            whatsappElement
                ? whatsappElement.value.trim()
                : "";


        const deskripsi =
            deskripsiElement
                ? deskripsiElement.value.trim()
                : "";


        /* ---------------------------------------------
           VALIDASI
        --------------------------------------------- */

        if (
            !nama ||
            !kategori ||
            !desa ||
            !produk
        ) {

            alert(
                "Mohon lengkapi data wajib UMKM."
            );

            return;

        }


        /* ---------------------------------------------
           ID OTOMATIS
        --------------------------------------------- */

        const idBaru =
            dataUMKM.length > 0
                ? Math.max(
                    ...dataUMKM.map(
                        function (item) {

                            return (
                                Number(
                                    item.id
                                ) || 0
                            );

                        }
                    )
                ) + 1
                : 1;


        /* ---------------------------------------------
           OBJECT UMKM
        --------------------------------------------- */

        const umkmBaru = {

            id: idBaru,

            nama: nama,

            kategori: kategori,

            desa: desa,

            produk: produk,

            rating: rating || "5",

            whatsapp: whatsapp,

            deskripsi: deskripsi

        };


        /* ---------------------------------------------
           TAMBAHKAN DATA
        --------------------------------------------- */

        dataUMKM.push(
            umkmBaru
        );


        /* ---------------------------------------------
           SIMPAN
        --------------------------------------------- */

        saveLocalStorage();


        /* ---------------------------------------------
           REFRESH TAMPILAN
        --------------------------------------------- */

        renderUMKM();


        /* ---------------------------------------------
           TUTUP FORM
        --------------------------------------------- */

        tutupModal();


        alert(
            "Data UMKM berhasil disimpan."
        );


        console.log(
            "UMKM baru:",
            umkmBaru
        );

    }


    /* =================================================
       ESCAPE HTML
    ================================================= */

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


    /* =================================================
       EVENT
    ================================================= */

    if (btnTambahUMKM) {

        btnTambahUMKM.addEventListener(
            "click",
            bukaModal
        );

    }


    if (btnTutupModal) {

        btnTutupModal.addEventListener(
            "click",
            tutupModal
        );

    }


    if (btnBatal) {

        btnBatal.addEventListener(
            "click",
            tutupModal
        );

    }


    if (formUMKM) {

        formUMKM.addEventListener(
            "submit",
            simpanUMKM
        );

    }


    if (searchUMKM) {

        searchUMKM.addEventListener(
            "input",
            renderUMKM
        );

    }


    if (filterKategori) {

        filterKategori.addEventListener(
            "change",
            renderUMKM
        );

    }


    if (filterDesa) {

        filterDesa.addEventListener(
            "change",
            renderUMKM
        );

    }


    /* =================================================
       TUTUP MODAL KLIK LUAR
    ================================================= */

    if (modalUMKM) {

        modalUMKM.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    modalUMKM
                ) {

                    tutupModal();

                }

            }
        );

    }


    /* =================================================
       START ENGINE
    ================================================= */

    loadData();


});
```
