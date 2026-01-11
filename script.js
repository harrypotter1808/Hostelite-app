// --- Firebase Configuration ---
// Paste your keys here
const firebaseConfig = {
    apiKey: "AIzaSyAefYF4yz-PV-UIvYjxshrwOfCSMFJr50I",
    authDomain: "hostelite-app.firebaseapp.com",
    databaseURL: "https://hostelite-app-default-rtdb.firebaseio.com/",
    projectId: "hostelite-app",
    storageBucket: "hostelite-app.firebasestorage.app",
    messagingSenderId: "629697145448",
    appId: "1:629697145448:web:7a4efd90681a48c70ae9dd",
    measurementId: "G-TXRCZT4F97"
};

// Initialize Firebase (Global Scope)
let db;
try {
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        db = firebase.database(); // Switch to Realtime Database
    } else {
        console.error("Firebase SDK not loaded! Check if script tags are in HTML.");
    }
} catch (e) {
    console.error("Firebase Init Error:", e);
}

// Roommate Modal Logic (Global Scope)
window.openRoommateModal = () => {
    const modal = document.getElementById('roommateModal');
    if (modal) {
        modal.classList.add('active');
        // Reset form state on open
        document.getElementById('formContent').style.display = 'block';
        document.getElementById('successAnim').style.display = 'none';
        document.getElementById('roommateForm').reset();
        document.querySelectorAll('.vibe-chip').forEach(c => c.classList.remove('selected'));
    }
};

window.closeRoommateModal = () => {
    const modal = document.getElementById('roommateModal');
    if (modal) modal.classList.remove('active');
};

// Vibe Chip Selection
// Vibe Chip Selection (Multi-Select)
window.selectVibe = (btn, value) => {
    // Determine input element
    const input = document.getElementById('rType');

    // Toggle visual state
    btn.classList.toggle('selected');

    // Collect all selected values
    const selectedChips = document.querySelectorAll('.vibe-chip.selected');
    const values = Array.from(selectedChips).map(chip => chip.innerText.trim().replace(/[^a-zA-Z\s]/g, '').trim()); // Clean emojis if needed, or keep them

    // Store as comma-separated string
    // We will just store the raw text from the buttons for simplicity
    const rawValues = Array.from(selectedChips).map(c => c.innerHTML.trim());

    if (input) input.value = rawValues.join(', ');
};

// Handle Roommate Form Submission (Realtime Database)
window.submitRoommateForm = async (e) => {
    e.preventDefault();
    if (!db) { alert("Database not connected!"); return; }

    const type = document.getElementById('rType').value;
    if (!type) {
        alert("Please select your vibe! (Click one of the chips)");
        return;
    }

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;

    const data = {
        name: document.getElementById('rName').value,
        contact: document.getElementById('rContact').value,
        type: type,
        requirements: document.getElementById('rReq').value,
        timestamp: Date.now()
    };

    btn.innerText = 'Sending... ⏳';
    btn.disabled = true;

    try {
        await db.ref('requests').push(data);

        // Show Success Animation instead of Alert
        document.getElementById('formContent').style.display = 'none';
        document.getElementById('successAnim').style.display = 'block';

        // Auto close after 2 seconds
        setTimeout(() => {
            closeRoommateModal();
            // Reset for next time after closing
            setTimeout(() => {
                document.getElementById('formContent').style.display = 'block';
                document.getElementById('successAnim').style.display = 'none';
                e.target.reset();
                document.querySelectorAll('.vibe-chip').forEach(c => c.classList.remove('selected'));
                btn.innerText = originalText;
                btn.disabled = false;
            }, 500);
        }, 2500);

    } catch (err) {
        console.error("Firebase Error:", err);
        alert('Error saving request: ' + err.message);
        btn.innerText = originalText;
        btn.disabled = false;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // console.log('Hostelite site loaded');

    // Only basic interactivity for now, smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Close roommate modal on outside click
    const roommateModal = document.getElementById('roommateModal');
    if (roommateModal) {
        roommateModal.addEventListener('click', (e) => {
            if (e.target.id === 'roommateModal') closeRoommateModal();
        });
    }

    // AI Search Interaction
    const searchBtn = document.querySelector('.search-btn');
    const resultsContainer = document.getElementById('search-results');

    // Consolidated Data for Search
    const searchData = [
        // PGs
        { title: 'Sai Student Hostel', type: 'PG', price: '₹3,500/mo', keywords: 'boys budget wifi engineering college', link: 'pg-listings.html', img: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=150&q=80' },
        { title: 'Stanza Living', type: 'PG', price: '₹9,000/mo', keywords: 'premium ac gym co-ed food comfort', link: 'pg-listings.html', img: 'https://images.unsplash.com/photo-1522771753033-6a9a695f1c96?auto=format&fit=crop&w=150&q=80' },
        { title: 'Sunrise Girls Residency', type: 'PG', price: '₹5,500/mo', keywords: 'girls safe food secure cctv', link: 'pg-listings.html', img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=150&q=80' },
        { title: '1BHK Student Flat', type: 'Flat', price: '₹12,000/mo', keywords: 'flat apartment kitchen independence private', link: 'pg-listings.html', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=150&q=80' },
        { title: 'Arnav Boys PG', type: 'PG', price: '₹2,500/mo', keywords: 'boys budget food cheap', link: 'pg-listings.html', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=150&q=80' },
        { title: 'Praacchi Borkarr PG', type: 'PG', price: '₹3,900/mo', keywords: 'co-ed wifi ac shared', link: 'pg-listings.html', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=150&q=80' },
        { title: 'Subhadra Girls Hostel', type: 'PG', price: '₹4,500/mo', keywords: 'girls safe clean ventilated', link: 'pg-listings.html', img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=150&q=80' },
        { title: 'Jhala Simplicity', type: 'Flat', price: '₹16,500/mo', keywords: 'luxury flat furnished premium', link: 'pg-listings.html', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=150&q=80' },
        { title: 'Magarpatta City PG', type: 'PG', price: '₹12,000/mo', keywords: 'professional premium single ac hadapsar', link: 'pg-listings.html', img: 'https://images.unsplash.com/photo-1522771753033-6a9a695f1c96?auto=format&fit=crop&w=150&q=80' },
        { title: 'Amanora Boys Hostel', type: 'PG', price: '₹7,000/mo', keywords: 'boys budget mall hadapsar mess', link: 'pg-listings.html', img: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=150&q=80' },
        { title: 'Undri Student Hub', type: 'PG', price: '₹8,500/mo', keywords: 'co-ed modern gym library undri', link: 'pg-listings.html', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=80' },
        { title: 'Indira Girls Residency', type: 'PG', price: '₹6,000/mo', keywords: 'girls safe transport undri', link: 'pg-listings.html', img: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=150&q=80' },
        { title: 'Meheriya Residency', type: 'Flat', price: '₹7,000/mo', keywords: 'flat 1bhk 2bhk silent cctv 24h water handewadi', link: 'pg-listings.html', img: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=150&q=80' },

        // Messes
        { title: 'Annapurna Mess', type: 'Mess', price: '₹2,800/mo', keywords: 'veg thali unlimited maharashtrian lunch dinner', link: 'mess-listings.html', img: 'https://images.unsplash.com/photo-1626500125627-c205632f91eb?auto=format&fit=crop&w=150&q=80' },
        { title: 'W S Tiffin Service', type: 'Mess', price: '₹3,500/mo', keywords: 'tiffin delivery veg non-veg home style', link: 'mess-listings.html', img: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=150&q=80' },
        { title: 'South Indian Amma', type: 'Mess', price: '₹100/meal', keywords: 'south indian dosa idli breakfast', link: 'mess-listings.html', img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=150&q=80' },
        { title: 'Hande Mess', type: 'Mess', price: '₹2,400/mo', keywords: 'budget home style zunka bhakar daily', link: 'mess-listings.html', img: 'https://images.unsplash.com/photo-1574484284008-81dcec18d3bf?auto=format&fit=crop&w=150&q=80' },
        { title: 'Radhakrishna Mess', type: 'Mess', price: '₹3,200/mo', keywords: 'dining veg non-veg premium restaurant', link: 'mess-listings.html', img: 'https://images.unsplash.com/photo-1613292443284-8d8595c1a858?auto=format&fit=crop&w=150&q=80' },
        { title: 'Mahakal Mess', type: 'Mess', price: '₹50/meal', keywords: 'mahakal home made budget handewadi lunch dinner', link: 'mess-listings.html', img: 'https://images.unsplash.com/photo-1574484284008-81dcec18d3bf?auto=format&fit=crop&w=150&q=80' }
    ];

    if (searchBtn && resultsContainer) {
        // Function to perform search
        const performSearch = () => {
            const input = document.querySelector('.search-input');
            const query = input.value.toLowerCase().trim();

            if (query) {
                // Simulate processing...
                searchBtn.textContent = 'Searching...';
                searchBtn.disabled = true;

                setTimeout(() => {
                    searchBtn.textContent = 'AI Match ✨';
                    searchBtn.disabled = false;

                    // Parse Price Query
                    let priceLimit = Infinity;
                    const priceMatch = query.match(/under\s*(\d+)k?|(\d+)k?/i);
                    if (priceMatch) {
                        const rawNum = priceMatch[1] || priceMatch[2];
                        if (rawNum) {
                            priceLimit = parseInt(rawNum) * (query.includes('k') ? 1000 : 1);
                        }
                    }

                    // Filter Data
                    const results = searchData.filter(item => {
                        const searchableText = `${item.title} ${item.keywords} ${item.type}`.toLowerCase();
                        const cleanQuery = query.replace(/under\s*\d+k?/i, '').trim();

                        // Tokenize query: Split by space and check if ALL tokens exist in text
                        const tokens = cleanQuery.split(/\s+/).filter(Boolean);
                        const matchesText = tokens.every(token => searchableText.includes(token));

                        // Price Check
                        const itemPrice = parseInt(item.price.replace(/[^\d]/g, ''));
                        const matchesPrice = itemPrice <= priceLimit;

                        return matchesText && matchesPrice;
                    });

                    // Generate HTML
                    let html = '';

                    if (results.length > 0) {
                        html = results.map(item => `
                            <a href="${item.link}" target="_blank" class="result-card-link" style="text-decoration: none; color: inherit;">
                                <div class="result-card">
                                    <img src="${item.img}" alt="${item.title}">
                                    <div class="result-info">
                                        <h3>${item.title}</h3>
                                        <p>${item.type} · Matches "${query}"</p>
                                        <div class="result-price">${item.price}</div>
                                    </div>
                                </div>
                            </a>
                        `).join('');
                    } else {
                        html = `<div style="padding: 1rem; text-align: center; color: #636e72;">No direct matches found on our site.</div>`;
                    }

                    // Append Global Search Fallback
                    const globalSearchLink = `https://www.google.com/search?q=${encodeURIComponent(query + ' hostel pg mess near me')}`;
                    html += `
                        <div class="global-search-fallback" style="padding: 1rem; border-top: 1px solid #dfe6e9; text-align: center; margin-top: 0.5rem;">
                            <p style="font-size: 0.9rem; margin-bottom: 0.5rem;">Not satisfied with these results?</p>
                            <a href="${globalSearchLink}" target="_blank" class="btn" style="padding: 0.5rem 1rem; font-size: 0.9rem; background-color: #2d3436;">🌏 Search Globally on Google</a>
                        </div>
                    `;

                    resultsContainer.innerHTML = html;
                    resultsContainer.classList.add('active');
                    // Scroll only if needed to show results, but keep input visible
                    // resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                }, 500); // 0.5s delay for realistic feel
            } else {
                input.focus();
            }
        };

        searchBtn.addEventListener('click', performSearch);

        // Allow Enter key to search
        document.querySelector('.search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });

        // Hide results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.ai-search-container') && !e.target.closest('.search-results')) {
                resultsContainer.classList.remove('active');
            }
        });
    }

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });
    }
    // AI Chat Bot Logic
    const chatWidget = document.getElementById('aiChatWidget');
    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const closeChatBtn = document.getElementById('closeChat');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    if (chatWidget && chatToggleBtn) {
        chatToggleBtn.onclick = () => chatWidget.classList.toggle('active');
        closeChatBtn.onclick = () => chatWidget.classList.remove('active');

        window.sendMessage = () => {
            const text = chatInput.value.trim();
            if (!text) return;

            // Add User Message
            addMessage(text, 'user-message');
            chatInput.value = '';

            // Simulate Thinking
            setTimeout(() => {
                const response = getAIResponse(text.toLowerCase());
                addMessage(response, 'bot-message');
            }, 600);
        };

        window.handleChatInput = (e) => {
            if (e.key === 'Enter') sendMessage();
        };

        function addMessage(text, className) {
            const div = document.createElement('div');
            div.className = `message ${className}`;

            // Allow basic link parsing (simple regex for demonstration)
            if (text.includes('http')) {
                div.innerHTML = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color: inherit; text-decoration: underline;">$1</a>');
            } else {
                div.textContent = text;
            }

            chatMessages.appendChild(div);
            // Auto scroll
            requestAnimationFrame(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            });
        }

        function getAIResponse(input) {
            // Simple Keyword Matching Intent
            if (input.includes('hello') || input.includes('hi')) return "Hey there! 👋 I can help you find PGs, Messes, or Flatmates. Try asking 'Best mess nearby' or 'Cheap PG'.";

            if (input.includes('mess') || input.includes('food') || input.includes('tiffin')) {
                if (input.includes('cheap') || input.includes('budget')) return "For budget food, I recommend **Mahakal Mess** (₹50/meal) or **South Indian Amma** (₹100/meal).";
                if (input.includes('healthy')) return "**Tiffit** is great for healthy, low-oil meals!";
                return "We have great Mess options! Check out **Annapurna Mess** for unlimited thali or **Radhakrishna** for premium dining.";
            }

            if (input.includes('pg') || input.includes('hostel') || input.includes('room')) {
                if (input.includes('girl')) return "Top picks for girls: **Sunrise Girls Residency** and **Subhadra Hostel**. Both are very safe!";
                if (input.includes('boy')) return "For boys, check out **Sai Student Hostel** (Budget) or **Amanora Boys Hostel** (Premium).";
                if (input.includes('cheap') || input.includes('budget')) return "**Arnav Boys PG** starts at just ₹2,500/mo. It's the cheapest option!";
                return "We have 15+ PGs listed. Are you looking for a 'boys', 'girls', or 'co-ed' PG?";
            }

            if (input.includes('flat') || input.includes('apartment')) return "Looking for privacy? Check out **Meheriya Residency** (1BHK) or **Jhala Simplicity** (Luxury).";

            if (input.includes('gym')) return "**Stanza Living** and **Undri Student Hub** both have in-house gyms! 💪";

            // Fallback to Global Maps Search
            const mapQuery = encodeURIComponent(input + ' near Handewadi Pune');
            const mapUrl = `https://www.google.com/maps/search/${mapQuery}`;
            return `I checked my list but didn't find specific matches. \n\nHere is a live map search for it: ${mapUrl}`;
        }
    }

    // Visitor Logging (Realtime Database)


    // Community Board Logic
    const initCommunityBoard = () => {
        const grid = document.getElementById('communityGrid');
        if (!grid || !db) return;

        // Show Skeleton / Loading State immediately
        grid.innerHTML = `
            <div class="student-card skeleton" style="opacity: 0.7; pointer-events: none;">
                <div class="student-header">
                    <div class="student-avatar" style="background:#e0e0e0; color:transparent;">?</div>
                    <div class="student-info">
                         <div class="student-name" style="background:#e0e0e0; color:transparent; width: 60%;">User</div>
                         <div class="student-vibe-tag" style="background:#e0e0e0; color:transparent;">Vibe</div>
                    </div>
                </div>
                <div class="student-req" style="background:#f5f5f5; color:transparent;">Loading description...</div>
            </div>
             <div class="student-card skeleton" style="opacity: 0.7; pointer-events: none;">
                <div class="student-header">
                     <div class="student-avatar" style="background:#e0e0e0; color:transparent;">?</div>
                    <div class="student-info">
                         <div class="student-name" style="background:#e0e0e0; color:transparent; width: 60%;">User</div>
                         <div class="student-vibe-tag" style="background:#e0e0e0; color:transparent;">Vibe</div>
                    </div>
                </div>
                <div class="student-req" style="background:#f5f5f5; color:transparent;">Loading description...</div>
            </div>
        `;

        // Fetch last 6 requests
        db.ref('requests').limitToLast(6).on('value', (snapshot) => {
            const data = snapshot.val();
            grid.innerHTML = '';

            if (data) {
                // Convert to array and reverse to show newest first
                const requests = Object.values(data).reverse();

                requests.forEach(req => {
                    const card = document.createElement('div');
                    card.className = 'student-card';
                    card.style.animation = 'fadeIn 0.5s ease-out';

                    // Privacy: Only show First Name
                    const displayName = req.name ? req.name.split(' ')[0] : 'Student';
                    const initials = displayName.substring(0, 1).toUpperCase();
                    const cleanPhone = req.contact ? req.contact.replace(/[^\d]/g, '') : '';

                    // Parse Vibe Tags (comma separated)
                    const rawType = req.type || 'Student';
                    const vibeTags = rawType.split(',').map(tag => tag.trim()).filter(Boolean);

                    const vibeHtml = vibeTags.map(tag => `<span class="student-vibe-tag">${tag}</span>`).join(' ');

                    // Random Gradient for Avatar based on name length (pseudo-random)
                    const hue = (displayName.length * 50) % 360;
                    const avatarStyle = `background: linear-gradient(135deg, hsl(${hue}, 70%, 60%), hsl(${hue + 40}, 70%, 50%));`;

                    card.innerHTML = `
                        <div class="student-header">
                            <div class="student-avatar" style="${avatarStyle}">
                                ${initials}
                            </div>
                            <div class="student-info">
                                <div class="student-name">${displayName}</div>
                                <div class="student-vibes-list" style="display:flex; flex-wrap:wrap; gap:5px;">
                                    ${vibeHtml}
                                </div>
                            </div>
                        </div>
                        
                        <div class="student-req">
                            "${req.requirements || 'Looking for a roommate!'}"
                        </div>
                        
                        <button onclick="window.open('https://wa.me/${cleanPhone}?text=Hi ${displayName}, saw you on Hostelite!', '_blank')" class="connect-btn">
                            💬 Connect
                        </button>
                    `;
                    grid.appendChild(card);
                });
            } else {
                grid.innerHTML = '<div style="text-align:center; padding:2rem; color:#636e72;">No requests yet. Be the first!</div>';
            }
        });
    };

    // Initialize board if element exists
    if (document.getElementById('communityGrid')) {
        initCommunityBoard();
    }
});
