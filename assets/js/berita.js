fetch('data/berita.json')
.then(res => res.json())
.then(data => {

let html = "";

data.forEach(item => {

html += `
<div class="col-lg-4 col-md-6 mb-4">

<div class="card berita-card h-100">

<img src="${item.gambar}" class="card-img-top" alt="${item.judul}">

<div class="card-body">

<span class="badge bg-danger mb-2">
${item.kategori}
</span>

<h5>${item.judul}</h5>

<p class="text-muted">
<i class="fa-solid fa-calendar-days"></i>
${item.tanggal}
</p>

<p>${item.ringkasan}</p>

<a href="#" class="btn btn-danger w-100">

<i class="fa-solid fa-book-open"></i>

Baca Selengkapnya

</a>

</div>

</div>

</div>
`;

});

document.getElementById("beritaContainer").innerHTML = html;

})
.catch(error => console.error(error));