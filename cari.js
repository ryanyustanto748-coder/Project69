function truncateText(text, maxLength = 40) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

let currentPage = 1;
let currentKeyword = '';

async function fetchSearchResults(keyword, page = 1, button = null) {
    const hasilContainer = document.getElementById('hasil_pencarian');
hasilContainer.innerHTML = `
  <div class="valign-wrapper" style="height:40vh;justify-content:center;">
    <div class="center-align">
      <div class="preloader-wrapper big active">
        <div class="spinner-layer spinner-pink-only">
          <div class="circle-clipper left"><div class="circle"></div></div>
          <div class="gap-patch"><div class="circle"></div></div>
          <div class="circle-clipper right"><div class="circle"></div></div>
        </div>
      </div>
      <p class="bold-text" style="margin-top:15px">
        Sedang Mencari Bokep yg lu mau ...
      </p>
    </div>
  </div>
`;

    // Atur tombol saat proses
    let originalText = '';
    if (button) {
        originalText = button.innerText;
        button.disabled = true;
        button.innerText = 'Sabar lagi nyari...';
    }

    try {
        const response = await fetch(`https://avdbapi.com/api.php/provide/vod?ac=detail&pagesize=100&wd=${encodeURIComponent(keyword)}&pg=${page}`);
        const data = await response.json();

        if (!data.list || data.list.length === 0) {
            hasilContainer.innerHTML = '<p class="red-text center-align">❌ Tidak ada video ditemukan.</p>';
            return;
        }

        const totalResults = data.total;
        const pageCount = data.pagecount;

        hasilContainer.innerHTML = `
            <h6 class="bold-text center-align">Total Ditemukan: ${totalResults} Video</h6>
            <h6 class="bold-text center-align">Halaman ${page} dari ${pageCount}</h6>
            <div class="row" id="search-results-list"></div>
            <div class="center-align" style="margin-top: 20px;">
                <button id="prevPage" class="btn waves-effect pink" ${page <= 1 ? 'disabled' : ''}>⬅ Previous</button>
                <button id="nextPage" class="btn waves-effect pink" ${page >= pageCount ? 'disabled' : ''}>Next ➡</button>
            </div>
        `;

        const listContainer = document.getElementById('search-results-list');

        data.list.forEach(video => {
            const videoItem = document.createElement('div');
            videoItem.className = 'col s6 m3 l3';
      videoItem.style.padding = '0';

            const title = truncateText(video.name || 'Tanpa Judul');
            const thumb = video.thumb_url || '';
            const actor = (video.actor || []).join(', ');

            let linkEmbed = '';
            try {
                linkEmbed = video.episodes?.server_data?.Full?.link_embed || '';
            } catch (e) {
                console.warn('link_embed tidak ditemukan:', video);
            }

            const encodedLink = encodeURIComponent(linkEmbed);

            videoItem.innerHTML = `
                <div class="card waves-effect">
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

            listContainer.appendChild(videoItem);
        });

        // Pagination
        document.getElementById('prevPage').onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                fetchSearchResults(currentKeyword, currentPage, button);
            }
        };

        document.getElementById('nextPage').onclick = () => {
            if (currentPage < pageCount) {
                currentPage++;
                fetchSearchResults(currentKeyword, currentPage, button);
            }
        };
    } catch (error) {
        hasilContainer.innerHTML = '<p class="red-text center-align">❌ Gagal mengambil data pencarian.</p>';
        console.error(error);
    } finally {
        // Aktifkan kembali tombol
        if (button) {
            button.disabled = false;
            button.innerText = originalText;
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const cariInput = document.getElementById('keywordInput');
    const cariBtn = document.getElementById('searchBtn');

    cariBtn.addEventListener('click', function () {
        const keyword = cariInput.value.trim();
        if (keyword.length === 0) return;

        currentKeyword = keyword;
        currentPage = 1;
        fetchSearchResults(keyword, currentPage, cariBtn);
    });

    cariInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            cariBtn.click();
        }
    });
});
