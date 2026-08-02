fetch('data/desa.json')
.then(res => res.json())
.then(data => {

    let html = "";

    data.forEach(desa => {

        html += `

        <div class="col-lg-4 col-md-6 mb-4">

            <div class="card desa-card h-100 shadow">

                <img src="${desa.gambar}" class="card-img-top">

                <div class="card-body">

                    <h4>${desa.nama}</h4>

                    <p>${desa.potensi}</p>

                    <a href="${desa.link}" class="btn btn-primary">

                        Lihat Profil

                    </a>

                </div>

            </div>

        </div>

        `;

    });

    document.getElementById("desaContainer").innerHTML = html;

});