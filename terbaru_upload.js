function truncateText(text, maxLength = 40) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

// Fungsi khusus untuk terbaru upload (ganti nama)
async function fetchTerbaruVideos() {
    try {
        const response = await fetch(base_api + '/vod?ac=detail&pagesize=100');
        const data = await response.json();

        // Ganti ID container agar tidak bentrok
        const videoContainer = document.getElementById('terbaru-video-container');
        videoContainer.innerHTML = ''; // kosongkan dulu

        data.list.forEach(video => {
            const videoItem = document.createElement('div');
            videoItem.className = 'col s6 m3 l3';
      videoItem.style.padding = '0';

            const truncatedName = truncateText(video.name);

            // Ambil link_embed
                let linkEmbed = '';
                try {
                    linkEmbed = video.episodes?.server_data?.Full?.link_embed || '';
                } catch (e) {
                    console.warn('link_embed tidak ditemukan untuk video:', video);
                }

                const encodedLink = encodeURIComponent(linkEmbed);

            videoItem.innerHTML = `
                <div class="card waves waves-effect">
                    <div>
                        <img style="width:100%" src="${video.thumb_url}" alt="Poster">
                    </div>
                    <div class="container">
                        <span class="pink-text bold-text">${truncatedName}</span>
                        <p class="bold-text">Artis : ${video.actor}</p>
                        <p class="bold-text">upload tgl : ${video.created_at}</p>
                    </div>
                    <div style="display:flex;justify-content:flex-end">
                             <a href="/index.html?video=${encodedLink}" class="btn pink waves-effect">Nonton</a>
                        </div>
                </div>
            `;

            videoContainer.appendChild(videoItem);
        });

        // Sembunyikan preloader & tampilkan konten
        document.getElementById('preloader-terbaru').style.display = 'none';
        document.getElementById('content').style.display = 'block';
    } catch (error) {
        console.error('Error fetching video data (terbaru):', error);
        document.getElementById('preloader-terbaru').innerHTML = '<p class="red-text">Gagal memuat video. Silakan coba lagi.</p>';
    }
}

// Jalankan saat halaman siap
document.addEventListener('DOMContentLoaded', function () {
    fetchTerbaruVideos();
});
