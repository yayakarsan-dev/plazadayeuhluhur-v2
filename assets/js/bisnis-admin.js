/* =====================================================
   INIT BISNIS ADMIN
===================================================== */

async function initBisnisAdmin() {

    console.log("====================================");
    console.log("BISNIS ADMIN V1");
    console.log("Inisialisasi halaman...");
    console.log("====================================");

    try {

        /* =========================================
           1. LOAD DATA
        ========================================= */

        console.log("STEP 1: Memuat data bisnis...");

        await loadBisnisData();

        console.log(
            "STEP 1 BERHASIL:",
            dataBisnis
        );


        /* =========================================
           2. UPDATE STATISTIK
        ========================================= */

        console.log("STEP 2: Update statistik...");

        updateStatistics();

        console.log(
            "STEP 2 BERHASIL"
        );


        /* =========================================
           3. RENDER TABLE
        ========================================= */

        console.log("STEP 3: Render tabel...");

        if (typeof renderTable === "function") {

            renderTable();

            console.log(
                "STEP 3 BERHASIL"
            );

        } else {

            console.warn(
                "STEP 3: renderTable() belum tersedia."
            );

        }


        /* =========================================
           4. BIND EVENTS
        ========================================= */

        console.log("STEP 4: Bind events...");

        if (typeof bindEvents === "function") {

            bindEvents();

            console.log(
                "STEP 4 BERHASIL"
            );

        } else {

            console.warn(
                "STEP 4: bindEvents() belum tersedia."
            );

        }


        console.log(
            "===================================="
        );

        console.log(
            "BISNIS ADMIN: INISIALISASI BERHASIL"
        );

        console.log(
            "Total data:",
            dataBisnis.length
        );

        console.log(
            "===================================="
        );


    } catch (error) {

        console.error(
            "===================================="
        );

        console.error(
            "BISNIS ADMIN: ERROR"
        );

        console.error(
            error
        );

        console.error(
            "===================================="
        );


        /*
         * Jangan lagi menampilkan
         * "Data bisnis gagal dimuat"
         * karena error bisa terjadi pada
         * statistik / tabel / event.
         */

        const tbody =
            document.getElementById(
                "bisnisTableBody"
            );


        if (tbody) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="8"
                        class="text-center py-5"
                    >

                        <div class="alert alert-warning mb-0">

                            <i class="fa-solid fa-triangle-exclamation me-2"></i>

                            Terjadi kesalahan pada modul
                            Bisnis Admin.

                            <br>

                            <small>
                                Silakan cek Console (F12)
                                untuk melihat detail error.
                            </small>

                        </div>

                    </td>

                </tr>

            `;

        }

    }

}