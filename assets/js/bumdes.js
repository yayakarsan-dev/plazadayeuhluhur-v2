fetch('../data/bumdes.json')
<<<<<<< HEAD

.then(response => response.json())

.then(data => {

let html = "";
=======
.then(res => res.json())
.then(data => {

let html = "";

data.forEach(item => {

html += `
>>>>>>> c43d0d9 (sprint sesi berita)

data.forEach(item => {

html += `

<<<<<<< HEAD
<div class="col-lg-4 col-md-6 mb-4">

<div class="card shadow h-100 desa-card">

=======
>>>>>>> c43d0d9 (sprint sesi berita)
<img src="../${item.gambar}" class="card-img-top">

<div class="card-body">

<span class="badge bg-success">

${item.status}

</span>

<h4 class="mt-3">

${item.nama}

</h4>

<p class="text-muted">

📍 ${item.desa}

</p>

<div class="row">

<div class="col-6">

<div class="stat-box">

🏢

<b>${item.unit}</b>

Unit Usaha

</div>

</div>

<div class="col-6">

<div class="stat-box">

🛍

<b>${item.produk}</b>

Produk

</div>

</div>

<div class="col-6">

<div class="stat-box">

👤

<b>${item.direktur}</b>

Direktur

</div>

</div>

<div class="col-6">

<div class="stat-box">

✅

<b>${item.status}</b>

Status

</div>

</div>

</div>

<a href="${item.link}"

class="btn btn-success w-100 mt-4">

Lihat Profil

</a>

</div>

</div>

</div>

`;

});

document.getElementById("bumdesContainer").innerHTML = html;

})
<<<<<<< HEAD

=======
>>>>>>> c43d0d9 (sprint sesi berita)
.catch(error => console.log(error));