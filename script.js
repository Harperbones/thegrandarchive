let characters = JSON.parse(localStorage.getItem('user_archive')) || [];
let currentImageData = "michelangelo.jpg"; 

// Section Toggle
function showSection(id) {
    document.querySelectorAll('.site-section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// File Upload to Base64
document.getElementById('new-portrait').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        currentImageData = event.target.result;
        document.getElementById('form-preview').src = currentImageData;
    };
    if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
});

// Render Main Archive
function renderGallery() {
    const hub = document.getElementById('character-hub');
    hub.innerHTML = '';
    
    if (characters.length === 0) {
        hub.innerHTML = "<p style='grid-column: 1/-1; text-align: center; opacity: 0.5;'>The Archive is currently empty...</p>";
    }

    characters.forEach((char, index) => {
        const card = document.createElement('div');
        card.className = 'char-card';
        card.innerHTML = `
            <div class="card-content" onclick="openDossier(${index})">
                <img src="${char.img}">
                <h3>${char.name}</h3>
            </div>
            <div class="card-btns">
                <button onclick="prepareEdit(${index})">Edit</button>
                <button onclick="shareCharacter(${index})">Share</button>
                <button onclick="deleteChar(${index})">Delete</button>
            </div>
        `;
        hub.appendChild(card);
    });
}

// Open Dossier View
function openDossier(index) {
    const char = characters[index];
    document.getElementById('view-name').innerText = char.name;
    document.getElementById('view-class').innerText = char.class;
    document.getElementById('view-bio').innerText = char.bio;
    document.getElementById('view-img').src = char.img;
    document.getElementById('dossier-overlay').style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
}

function closeDossier() {
    document.getElementById('dossier-overlay').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Form Handling
document.getElementById('oc-form').onsubmit = function(e) {
    e.preventDefault();
    const id = document.getElementById('editing-id').value;
    const charData = {
        name: document.getElementById('new-name').value,
        class: document.getElementById('new-class').value,
        bio: document.getElementById('new-bio').value,
        img: currentImageData
    };

    if (id !== "") characters[id] = charData;
    else characters.push(charData);

    localStorage.setItem('user_archive', JSON.stringify(characters));
    this.reset();
    document.getElementById('editing-id').value = "";
    document.getElementById('form-preview').src = "michelangelo.jpg";
    document.getElementById('form-title').innerText = "New Entry Registration";
    showSection('gallery');
    renderGallery();
};

function prepareEdit(index) {
    const char = characters[index];
    document.getElementById('new-name').value = char.name;
    document.getElementById('new-class').value = char.class;
    document.getElementById('new-bio').value = char.bio;
    document.getElementById('editing-id').value = index;
    currentImageData = char.img;
    document.getElementById('form-preview').src = char.img;
    document.getElementById('form-title').innerText = "Update Record";
    showSection('submit');
}

function deleteChar(index) {
    if(confirm("Permanently incinerate this record?")) {
        characters.splice(index, 1);
        localStorage.setItem('user_archive', JSON.stringify(characters));
        renderGallery();
    }
}

function shareCharacter(index) {
    const char = characters[index];
    const charString = btoa(encodeURIComponent(JSON.stringify(char)));
    const shareUrl = window.location.origin + window.location.pathname + "?view=" + charString;
    navigator.clipboard.writeText(shareUrl);
    alert("Record URL copied to clipboard!");
}

window.onload = renderGallery;