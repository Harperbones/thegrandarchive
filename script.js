let characters = JSON.parse(localStorage.getItem('user_archive')) || [];
let currentImageData = "michelangelo.jpg";

function showSection(id) {
    document.querySelectorAll('.site-section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// Image Handling
document.getElementById('new-portrait').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = (event) => {
        currentImageData = event.target.result;
        document.getElementById('form-preview').src = currentImageData;
    };
    reader.readAsDataURL(e.target.files[0]);
});

function renderGallery() {
    const hub = document.getElementById('character-hub');
    hub.innerHTML = '';
    characters.forEach((char, index) => {
        const card = document.createElement('div');
        card.className = 'char-card';
        card.innerHTML = `<div onclick="openDossier(${index})"><img src="${char.img}"><h3>${char.name}</h3></div><button onclick="deleteChar(${index})">Purge</button>`;
        hub.appendChild(card);
    });
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
    document.getElementById('view-con').innerText = char.stats?.con || "-";
    document.getElementById('view-int').innerText = char.stats?.int || "-";
    document.getElementById('view-wis').innerText = char.stats?.wis || "-";
    document.getElementById('view-cha').innerText = char.stats?.cha || "-";

    // Spotify
    const spotify = document.getElementById('spotify-container');
    if(char.spotify) {
        const embed = char.spotify.replace("/track/", "/embed/track/").split('?')[0];
        spotify.innerHTML = `<iframe src="${embed}" width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
    }

    // Mood Board Communication
    const moodFrame = document.getElementById('mood-iframe');
    moodFrame.contentWindow.postMessage({ images: char.moods }, "*");

    document.getElementById('dossier-overlay').style.display = 'flex';
}

document.getElementById('oc-form').onsubmit = function(e) {
    e.preventDefault();
    const charData = {
        name: document.getElementById('new-name').value,
        class: document.getElementById('new-class').value,
        spotify: document.getElementById('new-spotify').value,
        bio: document.getElementById('new-bio').value,
        img: currentImageData,
        moods: [document.getElementById('m-url1').value, document.getElementById('m-url2').value, document.getElementById('m-url3').value, document.getElementById('m-url4').value],
        stats: {
            str: document.getElementById('in-str').value, dex: document.getElementById('in-dex').value,
            con: document.getElementById('in-con').value, int: document.getElementById('in-int').value,
            wis: document.getElementById('in-wis').value, cha: document.getElementById('in-cha').value
        }
    };
    characters.push(charData);
    localStorage.setItem('user_archive', JSON.stringify(characters));
    showSection('gallery');
    renderGallery();
};

function closeDossier() { document.getElementById('dossier-overlay').style.display = 'none'; }
function deleteChar(i) { characters.splice(i, 1); localStorage.setItem('user_archive', JSON.stringify(characters)); renderGallery(); }
window.onload = renderGallery;
