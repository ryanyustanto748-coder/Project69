  function truncateText(text, maxLength = 40) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  async function loadRandomVideos({ append = false } = {}) {
    try {
      const btnTambah = document.getElementById('tambahvideolagi');
      const videoContainer = document.getElementById('random-video-container');

      if (!append) {
        document.getElementById('preloader-random').style.display = 'flex';
        videoContainer.innerHTML = '';
      } else {
        btnTambah.disabled = true;
        btnTambah.innerText = 'Sedang menambahkan video bentar...';
      }

      // Ambil page count
      const resInit = await fetch(`${base_api}/vod?ac=detail&pagesize=100`);
      const initData = await resInit.json();
      const totalPages = initData.pagecount;

      // Ambil random page
      const randomPage = Math.floor(Math.random() * totalPages) + 1;
      const res = await fetch(`${base_api}/vod?ac=detail&pagesize=100&pg=${randomPage}`);
      const data = await res.json();

      data.list.forEach(video => {
        const videoItem = document.createElement('div');
        videoItem.className = 'col s6 m3 l3';
        // HILANGKAN PADDING COL
      videoItem.style.padding = '0';
      videoItem.style.margin = '0';

        const title = truncateText(video.name || 'Tanpa Judul');
        const actor = video.actor || '';
        const thumb = video.thumb_url || '';

        let linkEmbed = '';
        try {
          linkEmbed = video.episodes?.server_data?.Full?.link_embed || '';
        } catch (e) {}

        const encodedLink = encodeURIComponent(linkEmbed);

        videoItem.innerHTML = `
          <div class="card waves waves-effect">
            <div>
              <img style="width:100%" src="${thumb}" alt="Poster">
            </div>
            <div class="container">
              <span class="pink-text bold-text">${title}</span>
              <p class="bold-text">Artis : ${actor}</p>
            </div>
            <div style="display:flex;justify-content:flex-end">
              <a href="/index.html?video=${encodedLink}" class="btn pink waves-effect">Nonton</a>
            </div>
          </div>
        `;

        videoContainer.appendChild(videoItem);
      });

      document.getElementById('preloader-random').style.display = 'none';
      document.getElementById('content').style.display = 'block';

      if (append) {
        btnTambah.disabled = false;
        btnTambah.innerText = 'Tambah Video Lagi Bang';
      }
    } catch (err) {
      console.error('Gagal load video:', err);
      document.getElementById('preloader-random').innerHTML = '<p class="red-text">Gagal memuat video. Silakan coba lagi.</p>';
    }
  }

  // Saat halaman dimuat
  document.addEventListener('DOMContentLoaded', function () {
    loadRandomVideos();

    // Event tombol tambah
    const btnTambah = document.getElementById('tambahvideolagi');
    if (btnTambah) {
      btnTambah.addEventListener('click', function () {
        loadRandomVideos({ append: true });
      });
    }
  });
