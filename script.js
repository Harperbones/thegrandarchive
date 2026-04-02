let characters = JSON.parse(localStorage.getItem('user_archive')) || [];
let currentImageData = "michelangelo.jpg"; 

function showSection(id) {
    document.querySelectorAll('.site-section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function toggleAudio() {
    document.querySelector('.audio-controller').classList.toggle('hidden');
}

function openDossier(index) {
    const char = characters[index];
    document.getElementById('view-name').innerText = char.name;
    document.getElementById('view-class').innerText = char.class || "UNCATEGORIZED";
    document.getElementById('view-bio').innerText = char.bio;
    document.getElementById('view-img').src = char.img;
    
    // Stats
    document.getElementById('view-str').innerText = char.stats?.str || "-";
    document.getElementById('view-dex').innerText = char.stats?.dex || "-";
    document.getElementById('view-int').innerText = char.stats?.int || "-";
    document.getElementById('view-cha').innerText = char.stats?.cha || "-";

    // Moodboard Update
    const moodIframe = document.getElementById('mood-iframe');
    moodIframe.contentWindow.postMessage({ images: [char.mood1, char.mood2] }, "*");

    // Spotify Global Update
    if (char.spotify && char.spotify.includes('spotify.com')) {
        const embedUrl = char.spotify.replace("/track/", "/embed/track/").replace("/playlist/", "/embed/playlist/");
        document.getElementById('bg-spotify').src = `${embedUrl}?utm_source=generator&theme=0`;
    }

    document.getElementById('dossier-overlay').style.display = 'flex';
}

document.getElementById('oc-form').onsubmit = function(e) {
    e.preventDefault();
    const charData = {
        name: document.getElementById('new-name').value,
        class: document.getElementById('new-class').value,
        bio: document.getElementById('new-bio').value,
        spotify: document.getElementById('new-spotify').value,
        mood1: document.getElementById('new-mood1').value,
        mood2: document.getElementById('new-mood2').value,
        img: currentImageData,
        stats: {
            str: document.getElementById('in-str').value,
            dex: document.getElementById('in-dex').value,
            int: document.getElementById('in-int').value,
            cha: document.getElementById('in-cha').value
        }
    };
    characters.push(charData);
    localStorage.setItem('user_archive', JSON.stringify(characters));
    this.reset();
    showSection('gallery');
    renderGallery();
};

function renderGallery() {
    const hub = document.getElementById('character-hub');
    hub.innerHTML = '';
    characters.forEach((char, index) => {
        const card = document.createElement('div');
        card.className = 'char-card';
        card.onclick = () => openDossier(index);
        card.innerHTML = `
            <div class="card-content">
                <img src="${char.img}">
                <h3>${char.name}</h3>
                <p style="color:var(--gold)">${char.class || ''}</p>
            </div>
        `;
        hub.appendChild(card);
    });
}

function closeDossier() { document.getElementById('dossier-overlay').style.display = 'none'; }

window.onload = renderGallery;
