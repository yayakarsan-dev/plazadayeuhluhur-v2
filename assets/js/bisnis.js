fetch('data/bisnis.json')
.then(res => res.json())
.then(data => {

    let html = "";

    data.forEach(item => {

        html += `
        <div class="col-lg-4 col-md-6 mb-4">

            <div class="card bisnis-card h-100 shadow-sm">

                <img src="${item.gambar}" class="card-img-top" alt="${item.nama}">

                <div class="card-body">

                    <span class="badge bg-primary mb-2">
                        ${item.kategori}
                    </span>

                    <h5 class="fw-bold d-flex align-items-center">

                        ${item.nama}

                        ${
                            item.verified
                            ?
                            `
                            <i class="fa-solid fa-circle-check verified-icon ms-2"
                               data-bs-toggle="tooltip"
                               data-bs-placement="top"
                               title="Verified by PLAZA DAYEUHLUHUR">
                            </i>
                            `
                            :
                            ""
                        }

                    </h5>

                    <p class="text-muted mb-2">

                        <i class="fa-solid fa-location-dot text-danger"></i>

                        ${item.desa}

                    </p>

                    <p class="small">

                        ${item.deskripsi}

                    </p>

                    <div class="d-grid mt-3">

                        <a
                            href="https://wa.me/${item.wa}?text=${encodeURIComponent(item.pesan)}"
                            target="_blank"
                            class="btn btn-success">

                            <i class="fa-brands fa-whatsapp"></i>

                            ${item.cta}

                        </a>

                    </div>

                </div>

            </div>

        </div>
        `;

    });

    document.getElementById("bisnisContainer").innerHTML = html;

    // Aktifkan Bootstrap Tooltip
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));

    tooltipTriggerList.map(function (tooltipTriggerEl) {

        return new bootstrap.Tooltip(tooltipTriggerEl);

    });

})
.catch(error => console.error(error));