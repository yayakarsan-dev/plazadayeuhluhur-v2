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

                    <h5 class="fw-bold">
                        ${item.nama}
                    </h5>

                    <p class="text-muted mb-2">
                        <i class="fa-solid fa-location-dot text-danger"></i>
                        ${item.desa}
                    </p>

                    <p>
                        ${item.deskripsi}
                    </p>

                    ${
                        item.verified ?
                        `
                        <div class="mb-3">

                            <span class="badge bg-success">

                                <i class="fa-solid fa-circle-check"></i>

                                Verified by PLAZA DAYEUHLUHUR

                            </span>

                        </div>
                        `
                        : ""
                    }

                    <a
                        href="https://wa.me/${item.wa}?text=${encodeURIComponent(item.pesan)}"
                        target="_blank"
                        class="btn btn-success w-100">

                        ${item.cta}

                    </a>

                </div>

            </div>

        </div>

        `;

    });

    document.getElementById("bisnisContainer").innerHTML = html;

})
.catch(error => console.error(error));