let characters = JSON.parse(localStorage.getItem('user_archive')) || [];
let currentImageData = "placeholder.jpg"; 

// --- SECTION NAVIGATION ---
function showSection(id) {
    document.querySelectorAll('.site-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
}

// --- OPEN DOSSIER (VIEWING MODE) ---
function openDossier(index) {
    const char = characters[index];
    
    // Identity & Portrait
    document.getElementById('view-name').innerText = char.name;
    document.getElementById('view-class').innerText = char.class || "UNCATEGORIZED";
    document.getElementById('view-bio').innerText = char.bio;
    document.getElementById('view-img').src = char.img || 'placeholder.jpg';
    
    // BIOGRAPHICAL DATA
    document.getElementById('view-age').innerText = char.age || "-";
    document.getElementById('view-bday').innerText = char.birthday || "-";
    document.getElementById('view-source').innerText = char.source || "-";
    document.getElementById('view-extra').innerText = char.extra || "-";

    // Moodboard Update
    const moodIframe = document.getElementById('mood-iframe');
    if (moodIframe && moodIframe.contentWindow) {
        moodIframe.contentWindow.postMessage({ images: [char.mood1, char.mood2] }, "*");
    }

    // Redact Button logic
    const redactBtn = document.getElementById('redact-btn');
    if (redactBtn) {
        redactBtn.onclick = () => redactRecord(index);
    }

    document.getElementById('dossier-overlay').style.display = 'flex';
}

// --- SAVE RECORD (SUBMISSION MODE) ---
document.getElementById('oc-form').onsubmit = function(e) {
    e.preventDefault();
    
    const charData = {
        name: document.getElementById('new-name').value,
        class: document.getElementById('new-class').value,
        bio: document.getElementById('new-bio').value,
        mood1: document.getElementById('new-mood1').value,
        mood2: document.getElementById('new-mood2').value,
        img: currentImageData,
        age: document.getElementById('in-age').value,
        birthday: document.getElementById('in-bday').value,
        source: document.getElementById('in-source').value,
        extra: document.getElementById('in-extra').value
    };

    characters.push(charData);
    localStorage.setItem('user_archive', JSON.stringify(characters));
    
    this.reset();
    currentImageData = "placeholder.jpg"; 
    document.getElementById('form-preview').src = "placeholder.jpg"; 
    
    showSection('gallery');
    renderGallery();
};

// --- RENDER GALLERY CARDS ---
function renderGallery() {
    const hub = document.getElementById('character-hub');
    if (!hub) return;
    
    hub.innerHTML = '';
    characters.forEach((char, index) => {
        const card = document.createElement('div');
        card.className = 'char-card';
        card.onclick = () => openDossier(index);
        card.innerHTML = `
            <div class="card-content">
                <img src="${char.img || 'placeholder.jpg'}">
                <h3>${char.name}</h3>
                <p style="color:var(--gold)">${char.class || ''}</p>
            </div>
        `;
        hub.appendChild(card);
    });
}

// --- SEARCH LOGIC ---
function searchArchive() {
    const query = document.getElementById('archive-search').value.toLowerCase();
    const cards = document.querySelectorAll('.char-card');
    
    cards.forEach((card, index) => {
        const name = characters[index].name.toLowerCase();
        const classification = (characters[index].class || "").toLowerCase();
        if (name.includes(query) || classification.includes(query)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

function closeDossier() { 
    document.getElementById('dossier-overlay').style.display = 'none'; 
}

document.getElementById('new-portrait').addEventListener('change', function(e) {
    const reader = new FileReader();
    if (e.target.files[0]) {
        reader.onload = function(event) {
            document.getElementById('form-preview').src = event.target.result;
            currentImageData = event.target.result; 
        };
        reader.readAsDataURL(e.target.files[0]);
    }
});

function redactRecord(index) {
    if (confirm("Are you sure you wish to PERMANENTLY REDACT this file?")) {
        characters.splice(index, 1);
        localStorage.setItem('user_archive', JSON.stringify(characters));
        closeDossier();
        renderGallery();
    }
}

window.onload = renderGallery;
