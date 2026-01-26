// --- DOM ELEMENTS ---
const feedContainer = document.getElementById('meme-feed');
const toastContainer = document.getElementById('toast-container');
const themeBtn = document.getElementById('theme-toggle-li');

// New Elements for View Switching & Discussions
const storiesContainer = document.getElementById('stories-container');
const discussionFeed = document.getElementById('discussion-feed');
const viewFeed = document.getElementById('view-feed');
const viewDiscuss = document.getElementById('view-discussion');
const navHome = document.getElementById('nav-home');
const navDiscuss = document.getElementById('nav-discuss');

// --- 1. RENDER STORIES (New Feature) ---
function renderStories() {
    // Check if element exists to avoid errors on pages without stories
    if(!storiesContainer) return; 

    // Using storiesData from data.js
    storiesContainer.innerHTML = storiesData.map((story, index) => `
        <div class="story-item" onclick="showToast('Viewing story of ${story.user}')">
            <div class="story-ring ${index === 0 ? 'add-story' : ''}">
                <img src="${story.img}">
            </div>
            <div class="story-user">${story.user}</div>
        </div>
    `).join('');
}

// --- 2. RENDER DISCUSSIONS (New Feature) ---
function renderDiscussions() {
    if(!discussionFeed) return;

    discussionFeed.innerHTML = discussionData.map(disc => `
        <div class="discussion-card" onclick="showToast('Opening thread: ${disc.title}...')">
            <div class="discuss-meta">
                <span style="color:var(--accent-color)">#${disc.topic}</span> • Posted by ${disc.user}
            </div>
            <div class="discuss-title">${disc.title}</div>
            <div class="discuss-snippet">${disc.snippet}</div>
            <div class="discuss-footer">
                <span><i class="fa-regular fa-comment-dots"></i> ${disc.replies} Replies</span>
                <span><i class="fa-regular fa-eye"></i> ${disc.views} Views</span>
            </div>
        </div>
    `).join('');
}

// --- 3. VIEW SWITCHING LOGIC (New Feature) ---
function switchView(viewName) {
    if (viewName === 'feed') {
        viewFeed.classList.remove('hidden');
        viewDiscuss.classList.add('hidden');
        if(navHome) navHome.classList.add('active');
        if(navDiscuss) navDiscuss.classList.remove('active');
    } else {
        viewFeed.classList.add('hidden');
        viewDiscuss.classList.remove('hidden');
        if(navHome) navHome.classList.remove('active');
        if(navDiscuss) navDiscuss.classList.add('active');
    }
}

// Attach Event Listeners for Nav
if(navHome) navHome.addEventListener('click', () => switchView('feed'));
if(navDiscuss) navDiscuss.addEventListener('click', () => switchView('discuss'));


// --- 4. RENDER MEME FEED (Existing Logic) ---
function renderFeed() {
    if(!feedContainer) return;
    feedContainer.innerHTML = '';
    memeData.forEach(post => {
        const card = document.createElement('div');
        card.classList.add('meme-card');
        card.innerHTML = `
            <div class="card-header">
                <img src="${post.avatar}" class="user-avatar">
                <div><h4>${post.user}</h4><span style="color:grey; font-size:12px">${post.time}</span></div>
            </div>
            <div class="meme-content">
                <p style="margin-bottom:10px">${post.caption}</p>
                <div class="meme-image-container"><img src="${post.image}" class="meme-img"></div>
            </div>
            <div class="action-bar">
                <button class="action-btn like-btn ${post.isLiked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
                    <i class="${post.isLiked ? 'fa-solid' : 'fa-regular'} fa-heart"></i> ${post.likes}
                </button>
                <button class="action-btn" onclick="openComments(${post.id})"><i class="fa-regular fa-comment"></i> ${post.comments.length}</button>
                <button class="action-btn" onclick="showToast('Link copied!')"><i class="fa-solid fa-share-nodes"></i></button>
            </div>
        `;
        feedContainer.appendChild(card);
    });
}

// --- INTERACTIONS & UTILS ---
window.toggleLike = function(id) {
    const post = memeData.find(p => p.id === id);
    if (post) { post.isLiked = !post.isLiked; post.likes += post.isLiked ? 1 : -1; renderFeed(); }
};

window.showToast = function(msg) {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${msg}`;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

if(themeBtn) {
    themeBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Stop anchor jump
        document.body.classList.toggle('matrix-mode');
        showToast(document.body.classList.contains('matrix-mode') ? "Matrix Mode 🕶️" : "Neon Mode 🤖");
    });
}

// --- UPLOAD LOGIC ---
const uploadModal = document.getElementById('upload-modal');
const fileInput = document.getElementById('meme-file-input');
const previewCont = document.getElementById('preview-container');
const fabBtn = document.getElementById('fab-create');
const closeUploadBtn = document.getElementById('close-upload-btn');
const publishBtn = document.getElementById('publish-btn');
let currentFile = null;

if(fabBtn) fabBtn.addEventListener('click', () => { uploadModal.classList.remove('hidden'); setTimeout(() => uploadModal.classList.add('active'), 10); });
if(closeUploadBtn) closeUploadBtn.addEventListener('click', () => { uploadModal.classList.remove('active'); setTimeout(() => uploadModal.classList.add('hidden'), 300); });

if(fileInput) {
    fileInput.addEventListener('change', function() {
        if (this.files[0]) {
            currentFile = this.files[0];
            const reader = new FileReader();
            reader.onload = (e) => previewCont.innerHTML = `<img src="${e.target.result}" class="preview-img">`;
            reader.readAsDataURL(currentFile);
        }
    });
}

if(publishBtn) {
    publishBtn.addEventListener('click', () => {
        const captionVal = document.getElementById('upload-caption').value;
        if (!currentFile) return showToast("No image selected!");
        
        memeData.unshift({
            id: Date.now(), user: "You", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
            time: "Just now", caption: captionVal,
            image: URL.createObjectURL(currentFile), likes: 0, isLiked: false, comments: []
        });
        
        renderFeed();
        
        // Reset Inputs
        document.getElementById('upload-caption').value = '';
        previewCont.innerHTML = '';
        currentFile = null;
        fileInput.value = '';

        closeUploadBtn.click();
        showToast("Meme Posted! 🎉");
    });
}

// --- COMMENTS LOGIC ---
const commentOverlay = document.getElementById('comment-overlay');
const commentsList = document.getElementById('comments-list');
const closeCommentBtn = document.getElementById('close-modal-btn');
const sendCommentBtn = document.getElementById('send-comment-btn');
let activePostId = null;

window.openComments = function(id) {
    activePostId = id;
    const post = memeData.find(p => p.id === id);
    if(commentsList) {
        commentsList.innerHTML = post.comments.map(c => `
            <div class="comment-item">
                <div class="comment-bubble">
                    <span style="color:var(--accent-color); font-weight:bold">${c.user}</span><br>
                    ${c.text}
                </div>
            </div>`).join('');
    }
    const countSpan = document.getElementById('modal-comment-count');
    if(countSpan) countSpan.innerText = `(${post.comments.length})`;
    
    if(commentOverlay) {
        commentOverlay.classList.remove('hidden'); 
        setTimeout(() => commentOverlay.classList.add('active'), 10);
    }
};

if(closeCommentBtn) closeCommentBtn.addEventListener('click', () => { 
    commentOverlay.classList.remove('active'); 
    setTimeout(() => commentOverlay.classList.add('hidden'), 300); 
});

if(sendCommentBtn) {
    sendCommentBtn.addEventListener('click', () => {
        const input = document.getElementById('new-comment-input');
        const txt = input.value;
        if (txt) {
            memeData.find(p => p.id === activePostId).comments.push({user: "You", text: txt});
            openComments(activePostId);
            renderFeed();
            input.value = '';
        }
    });
}

// --- INITIALIZATION ---
// Render everything on load
document.addEventListener('DOMContentLoaded', () => {
    renderStories();
    renderDiscussions();
    renderFeed();
});