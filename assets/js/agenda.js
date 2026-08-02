fetch('data/agenda.json')
.then(res => res.json())
.then(data => {

    let html = "";

    data.forEach(item => {

        html += `
        <div class="col-lg-4 col-md-6 mb-4">

            <div class="agenda-card">

                <div class="agenda-icon">

                    <i class="fa-solid ${item.icon}"></i>

                </div>

                <h5>${item.judul}</h5>

                <p class="text-primary">
                    <i class="fa-solid fa-calendar-days"></i>
                    ${item.tanggal}
                </p>

                <p>
                    <i class="fa-solid fa-location-dot text-danger"></i>
                    ${item.lokasi}
                </p>

                <span class="badge bg-success">
                    ${item.kategori}
                </span>

            </div>

        </div>
        `;

    });

    document.getElementById("agendaContainer").innerHTML = html;

});