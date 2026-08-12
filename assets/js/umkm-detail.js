/* =====================================================
   PLAZA DAYEUHLUHUR
   HOME SLIDER
   slider.js — FINAL
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const sliderContainer =
        document.getElementById("homeSlider");

    if (!sliderContainer) {

        console.warn(
            "Element #homeSlider tidak ditemukan."
        );

        return;
    }


    /* =================================================
       LOAD DATA
    ================================================= */

    fetch("data/slider.json")

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "slider.json gagal dimuat. Status: " +
                    response.status
                );

            }

            return response.json();

        })


        .then(function (data) {

            if (!Array.isArray(data) || data.length === 0) {

                throw new Error(
                    "Data slider kosong."
                );

            }

            renderSlider(data);

        })


        .catch(function (error) {

            console.error(
                "SLIDER ERROR:",
                error
            );


            sliderContainer.innerHTML = `

                <div class="slider-error">

                    <i class="fa-solid fa-image"></i>

                    <h3>
                        Informasi sedang disiapkan
                    </h3>

                    <p>
                        Konten promosi Plaza Dayeuhluhur
                        akan segera hadir.
                    </p>

                </div>

            `;

        });


    /* =================================================
       RENDER SLIDER
    ================================================= */

    function renderSlider(data) {

        let slides = "";
        let indicators = "";


        data.forEach(function (item, index) {

            const active =
                index === 0
                    ? "active"
                    : "";


            const nomor =
                String(index + 1).padStart(2, "0");


            slides += `

                <div
                    class="carousel-item ${active}">

                    <div
                        class="home-slide"
                        style="
                            background-image:
                            linear-gradient(
                                90deg,
                                rgba(0,0,0,.78) 0%,
                                rgba(0,0,0,.55) 45%,
                                rgba(0,0,0,.15) 100%
                            ),
                            url('${escapeAttribute(item.gambar)}');
                        ">


                        <div
                            class="container">

                            <div
                                class="home-slide-content">


                                <div
                                    class="home-slide-label">

                                    <span></span>

                                    ${escapeHTML(
                                        item.label || ""
                                    )}

                                </div>


                                <h1>

                                    ${escapeHTML(
                                        item.judul || ""
                                    )}

                                </h1>


                                <p>

                                    ${escapeHTML(
                                        item.deskripsi || ""
                                    )}

                                </p>


                                <a
                                    href="${escapeAttribute(
                                        item.link || "#"
                                    )}"
                                    class="btn
                                           btn-success
                                           btn-lg
                                           rounded-pill
                                           px-4">


                                    ${escapeHTML(
                                        item.tombol ||
                                        "Selengkapnya"
                                    )}


                                    <i
                                        class="fa-solid
                                               fa-arrow-right
                                               ms-2">
                                    </i>


                                </a>


                            </div>

                        </div>


                        <div
                            class="slide-number">

                            ${nomor}
                            <span>/ ${String(data.length).padStart(2, "0")}</span>

                        </div>


                    </div>

                </div>

            `;


            indicators += `

                <button
                    type="button"
                    data-bs-target="#plazaHomeSlider"
                    data-bs-slide-to="${index}"
                    class="${active}"
                    aria-label="Slide ${index + 1}">
                </button>

            `;

        });


        sliderContainer.innerHTML = `

            <div
                id="plazaHomeSlider"
                class="carousel slide
                       carousel-fade"
                data-bs-ride="carousel"
                data-bs-interval="5000">


                <!-- SLIDES -->

                <div
                    class="carousel-inner">

                    ${slides}

                </div>


                <!-- INDICATORS -->

                <div
                    class="carousel-indicators">

                    ${indicators}

                </div>


                <!-- PREVIOUS -->

                <button
                    class="carousel-control-prev"
                    type="button"
                    data-bs-target="#plazaHomeSlider"
                    data-bs-slide="prev">


                    <span
                        class="carousel-control-prev-icon"
                        aria-hidden="true">
                    </span>


                    <span class="visually-hidden">
                        Sebelumnya
                    </span>


                </button>


                <!-- NEXT -->

                <button
                    class="carousel-control-next"
                    type="button"
                    data-bs-target="#plazaHomeSlider"
                    data-bs-slide="next">


                    <span
                        class="carousel-control-next-icon"
                        aria-hidden="true">
                    </span>


                    <span class="visually-hidden">
                        Berikutnya
                    </span>


                </button>


            </div>

        `;

    }


    /* =================================================
       ESCAPE HTML
    ================================================= */

    function escapeHTML(value) {

        return String(value || "")

            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =================================================
       ESCAPE ATTRIBUTE
    ================================================= */

    function escapeAttribute(value) {

        return escapeHTML(value);

    }

});