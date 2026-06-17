const container = document.getElementById("voe-indo");

// ================= PRELOADER =================
container.innerHTML = `
  <div class="col s12 center" style="margin-top:40px">
    <div class="preloader-wrapper big active">
      <div class="spinner-layer spinner-pink-only">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div>
        <div class="gap-patch">
          <div class="circle"></div>
        </div>
        <div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>
    <p class="pink-text fw-bold" style="margin-top:10px">
      Memuat video VOE...
    </p>
  </div>
`;

// ===== REQUEST 1: ambil TOTAL & PER_PAGE =====
fetch(`${voe_api}/file/list?key=${voe_api_key}&page=1`)
  .then(res => res.json())
  .then(meta => {
    const total   = meta.result.total;
    const perPage = meta.result.per_page;
    const maxPage = Math.ceil(total / perPage);

    const randomPage = Math.floor(Math.random() * maxPage) + 1;

    // ===== REQUEST 2 =====
    return fetch(
      `${voe_api}/file/list?key=${voe_api_key}&page=${randomPage}`
    );
  })
  .then(res => res.json())
  .then(data => {
    // HAPUS PRELOADER
    container.innerHTML = "";

    data.result.data.forEach(item => {
      let thumb = "";
      if (item.thumbnails?.length) {
        thumb = item.thumbnails[item.thumbnails.length - 1].url;
      }

      const embedUrl  = `${voe_player}/${item.filecode}`;
      const encodeUrl = encodeURIComponent(embedUrl);

      const html = `
        <div class="col s6 m3 l3">
          <div class="card">
            <div class="card-image">
              <img src="${thumb}" alt="${item.title}">
            </div>

            <div class="card-content" style="padding:8px">
              <span class="fw-bold pink-text truncate" style="font-size:14px">
                ${item.title}
              </span>
              <p style="font-size:12px">Server : VOE</p>
            </div>

            <div style="display:flex;justify-content:flex-end;padding:4px">
              <a 
                href="/index.html?video=${encodeUrl}"
                class="btn pink fw-bold waves-effect">
                Nonton
              </a>
            </div>
          </div>
        </div>
      `;

      container.insertAdjacentHTML("beforeend", html);
    });
  })
  .catch(err => {
    console.error(err);
    container.innerHTML = `
      <div class="col s12">
        <div class="card red lighten-5">
          <div class="card-content red-text center">
            <b>Gagal memuat video 😢</b>
          </div>
        </div>
      </div>
    `;
  });
