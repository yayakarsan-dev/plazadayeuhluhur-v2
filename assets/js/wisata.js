fetch('data/wisata.json')
.then(res => res.json())
.then(data => {

    let html = "";

    data.forEach(item => {

        html += `
        <div class="col-lg-4 col-md-6 mb-4">

            <div class="card wisata-card h-100">

                <img src="${item.gambar}" class="card-img-top" alt="${item.nama}">

                <div class="card-body">

                    <span class="badge bg-success mb-2">
                        ${item.kategori}
                    </span>

                    <h5>${item.nama}</h5>

                    <p>
                        <i class="fa-solid fa-location-dot text-danger"></i>
                        ${item.desa}
                    </p>

                    <p class="text-warning">
                        ⭐ ${item.rating}
                    </p>

                    <div class="d-grid gap-2">

                        <a href="#" class="btn btn-primary">
                            <i class="fa-solid fa-eye"></i>
                            Lihat Detail
                        </a>

                        <a href="${item.maps}"
                           target="_blank"
                           class="btn btn-success">

                            <i class="fa-solid fa-map-location-dot"></i>
                            Google Maps

                        </a>

                    </div>

                </div>

            </div>

        </div>
        `;

    });

    document.getElementById("wisataContainer").innerHTML = html;

})
.catch(error => {

    console.error("Gagal membaca data wisata :", error);

});