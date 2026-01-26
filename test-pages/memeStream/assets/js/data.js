// Global Variable for State

let memeData = [
    {
        id: 1, user: "TechBro_99", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tech",
        time: "2h ago", caption: "Why does it always work on localhost? 😭",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop", 
        likes: 124, isLiked: false, comments: [{user: "Dev", text: "It's a feature."}]
    },
    {
        id: 2, user: "Neon_Kat", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kat",
        time: "4h ago", caption: "Rate my setup! 🚀",
        image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1000&auto=format&fit=crop",
        likes: 856, isLiked: true, comments: []
    }
];

// --- NEW STORIES DATA ---
const storiesData = [
    { user: "You", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=You" },
    { user: "Elon_M", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elon" },
    { user: "CoderX", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Coder" },
    { user: "DesignG", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Des" },
    { user: "CryptoK", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cry" },
];

// --- NEW DISCUSSION DATA ---
const discussionData = [
    {
        id: 101, topic: "General Tech", title: "Is AI actually going to replace Junior Devs?",
        user: "ParanoidAndroid", replies: 42, views: 1205,
        snippet: "I've been reading about GPT-5 and I'm honestly scared. Should I switch to plumbing?"
    },
    {
        id: 102, topic: "Cybersecurity", title: "Best distro for CTF challenges?",
        user: "HackerMan", replies: 15, views: 340,
        snippet: "Kali is standard, but I hear good things about Parrot OS. Thoughts?"
    },
    {
        id: 103, topic: "Gaming", title: "Cyberpunk 2077 is finally playable.",
        user: "NightCity", replies: 89, views: 5000,
        snippet: "After the latest patch, the ray tracing looks insane. Here are my settings..."
    }
];