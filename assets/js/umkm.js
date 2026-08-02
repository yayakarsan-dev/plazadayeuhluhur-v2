fetch('data/umkm.json')
.then(res => res.json())
.then(data => {

    let html = "";

    data.forEach(item => {

        html += `
        <div class="col-lg-4 col-md-6 mb-4">

            <div class="card umkm-card h-100 shadow-sm">

                <img src="${item.gambar}" class="card-img-top" alt="${item.nama}">

                <div class="card-body">

                    <span class="badge bg-success mb-2">
                        ${item.kategori}
                    </span>

                    <h5 class="fw-bold">
                        ${item.nama}
                    </h5>

                    <h4 class="text-primary mb-3">
                        ${item.harga}
                    </h4>

                    <p class="mb-1">
                        <i class="fa-solid fa-store text-success"></i>
                        <strong>UMKM :</strong> ${item.umkm}
                    </p>

                    <p class="text-muted">
                        <i class="fa-solid fa-location-dot text-danger"></i>
                        ${item.desa}
                    </p>

                    <div class="d-grid gap-2 mt-3">

                        <a href="${item.link}"
                           class="btn btn-outline-primary">

                           <i class="fa-solid fa-circle-info"></i>
                           Detail Produk

                        </a>

                        <a href="https://wa.me/${item.wa}?text=Halo,%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(item.nama)}"
                           target="_blank"
                           class="btn btn-success">

                           <i class="fa-brands fa-whatsapp"></i>
                           Beli via WA

                        </a>

                    </div>

                </div>

            </div>

        </div>
        `;

    });

    document.getElementById("umkmContainer").innerHTML = html;

})
.catch(error => console.error(error));