fetch('data/newsflash.json')
.then(res => res.json())
.then(data => {

    let text = "";

    data.forEach(item=>{

        text += `
        <span class="news-item">

            <strong>${item.kategori}</strong>

            ${item.judul}

        </span>
        `;

    });

    document.getElementById("newsFlashContent").innerHTML=text;

});