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

// This listens for when you select a file
document.getElementById('new-portrait').addEventListener('change', function(e) {
    const reader = new FileReader();
    
    reader.onload = function(event) {
        // This updates the actual image source in your preview frame
        const preview = document.getElementById('form-preview');
        preview.src = event.target.result;
        
        // This saves the data to a variable so your "Seal Record" function can use it
        currentImageData = event.target.result; 
    };
    
    // This reads the file you just picked
    if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
    }
});

// Function to delete (Redact) a record
function redactRecord(index) {
    if (confirm("Are you sure you wish to PERMANENTLY REDACT this file?")) {
        characters.splice(index, 1); // Remove from array
        localStorage.setItem('user_archive', JSON.stringify(characters)); // Update storage
        closeDossier();
        renderGallery(); // Refresh the list
    }
}

// Update your openDossier function slightly to pass the current index to the button
function openDossier(index) {
    const char = characters[index];
    
    // ... all your existing view-name, view-bio code ...

    // Set the Redact button to point to this specific character's index
    const redactBtn = document.getElementById('redact-btn');
    if (redactBtn) {
        redactBtn.onclick = () => redactRecord(index);
    }

    document.getElementById('dossier-overlay').style.display = 'flex';
}

// The Instant Redaction Function
function redactRecord(index) {
    // 1. Remove the entry from the array immediately
    characters.splice(index, 1);
    
    // 2. Overwrite the storage with the new, shorter list
    localStorage.setItem('user_archive', JSON.stringify(characters));
    
    // 3. Wipe the screen clean
    closeDossier();
    renderGallery();
}

// Ensure the button is linked every time a dossier opens
function openDossier(index) {
    const char = characters[index];
    
    // ... (Your code to fill Name, Bio, Stats) ...

    const redactBtn = document.getElementById('redact-btn');
    if (redactBtn) {
        // Direct assignment: Click -> Delete.
        redactBtn.onclick = () => redactRecord(index);
    }

    document.getElementById('dossier-overlay').style.display = 'flex';
}

window.onload = renderGallery;
