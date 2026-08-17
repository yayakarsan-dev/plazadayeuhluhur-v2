/* =====================================================
   INDEX — KALENDER HAJATAN
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const container =
        document.getElementById(
            "indexUndanganGrid"
        );

    const jumlah =
        document.getElementById(
            "jumlahHajatanIndex"
        );

    if (!container) return;


    fetch("data/undangan.json")
        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Gagal membaca undangan.json"
                );
            }

            return response.json();

        })

        .then(data => {

            const today =
                new Date();

            today.setHours(
                0,
                0,
                0,
                0
            );


            const events =
                data
                    .filter(item =>
                        item.status !== "nonaktif"
                    )
                    .filter(item => {

                        const date =
                            new Date(
                                item.tanggal +
                                "T00:00:00"
                            );

                        return date >= today;

                    })
                    .sort((a, b) => {

                        return new Date(
                            a.tanggal
                        ) - new Date(
                            b.tanggal
                        );

                    });


            if (jumlah) {

                jumlah.textContent =
                    events.length;

            }


            /*
             * INDEX HANYA MENAMPILKAN
             * 15 EVENT
             */

            const tampil =
                events.slice(0, 15);


            if (!tampil.length) {

                container.innerHTML = `
                    <div class="col-12">

                        <div
                            class="kalender-loading"
                        >

                            <i
                                class="bi bi-calendar-x"
                                style="
                                    font-size:35px;
                                "
                            ></i>

                            <p>
                                Belum ada hajatan
                                mendatang.
                            </p>

                        </div>

                    </div>
                `;

                return;

            }


            container.innerHTML =
                tampil
                    .map(item =>
                        createIndexCard(item)
                    )
                    .join("");

        })

        .catch(error => {

            console.error(error);

            container.innerHTML = `
                <div class="col-12">

                    <div
                        class="kalender-loading"
                    >

                        <i
                            class="bi bi-exclamation-triangle"
                        ></i>

                        <p>
                            Data kalender hajatan
                            belum dapat dimuat.
                        </p>

                    </div>

                </div>
            `;

        });


    function createIndexCard(item) {

        const date =
            new Date(
                item.tanggal +
                "T00:00:00"
            );


        const day =
            String(
                date.getDate()
            );


        const month =
            date.toLocaleDateString(
                "id-ID",
                {
                    month: "short"
                }
            );


        const tanggal =
            date.toLocaleDateString(
                "id-ID",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );


        const image =
            item.gambar ||
            "assets/images/default.jpg";


        return `

            <div
                class="
                    index-undangan-col
                "
            >

                <article
                    class="index-undangan-card"
                >

                    <div
                        class="index-undangan-image"
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


                        <div
                            class="index-undangan-date"
                        >

                            <strong>
                                ${day}
                            </strong>

                            <span>
                                ${month}
                            </span>

                        </div>


                        <div
                            class="index-undangan-type"
                        >

                            ${escapeHTML(
                                item.jenis ||
                                "Hajatan"
                            )}

                        </div>

                    </div>


                    <div
                        class="index-undangan-body"
                    >

                        <h3>
                            ${escapeHTML(
                                item.nama ||
                                "Keluarga"
                            )}
                        </h3>


                        <div
                            class="index-undangan-title"
                        >
                            ${escapeHTML(
                                item.judul ||
                                "Undangan Hajatan"
                            )}
                        </div>


                        <div
                            class="index-undangan-info"
                        >

                            <i
                                class="bi bi-calendar3"
                            ></i>

                            <span>
                                ${tanggal}
                            </span>

                        </div>


                        <div
                            class="index-undangan-info"
                        >

                            <i
                                class="bi bi-clock"
                            ></i>

                            <span>
                                ${escapeHTML(
                                    item.waktu ||
                                    "-"
                                )}
                            </span>

                        </div>


                        <div
                            class="index-undangan-info"
                        >

                            <i
                                class="bi bi-geo-alt"
                            ></i>

                            <span>
                                ${escapeHTML(
                                    item.desa ||
                                    "-"
                                )}
                            </span>

                        </div>


                        ${
                            item.hiburan
                                ? `
                                <div
                                    class="
                                        index-undangan-info
                                    "
                                >

                                    <i
                                        class="
                                            bi
                                            bi-music-note-beamed
                                        "
                                    ></i>

                                    <span>
                                        ${escapeHTML(
                                            item.hiburan
                                        )}
                                    </span>

                                </div>
                                `
                                : ""
                        }

                    </div>


                    <div
                        class="
                            index-undangan-footer
                        "
                    >

                        <a
                            href="undangan.html"
                            class="
                                btn
                                btn-index-undangan
                            "
                        >

                            <i
                                class="
                                    bi
                                    bi-envelope-open
                                    me-1
                                "
                            ></i>

                            Lihat Undangan

                        </a>

                    </div>

                </article>

            </div>

        `;

    }


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

});