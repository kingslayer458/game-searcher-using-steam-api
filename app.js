const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");
const gameList = document.getElementById("game-list");
const gameDetails = document.getElementById("game-details");
const detailsContent = document.getElementById("details-content");
const backButton = document.getElementById("back-button");

// Fetch and display game list
async function fetchGames(query) {
    try {
        const response = await fetch(`/search?q=${query}`);
        const games = await response.json();

        gameList.innerHTML = games.map(game => `
            <div class="game" data-id="${game.steam_appid}">
                <img src="${game.header_image}" alt="${game.name}" />
                <h3>${game.name}</h3>
            </div>
        `).join("");

        attachGameClickHandlers();
    } catch (error) {
        console.error("Error fetching games:", error);
    }
}

// Attach click handlers to game cards
function attachGameClickHandlers() {
    const gameCards = document.querySelectorAll(".game");
    gameCards.forEach(card => {
        card.addEventListener("click", () => {
            const gameId = card.dataset.id;
            fetchGameDetails(gameId);
        });
    });
}

// Fetch and display game details
async function fetchGameDetails(gameId) {
    try {
        const response = await fetch(`/search?q=${searchBar.value}`);
        const games = await response.json();
        const game = games.find(g => g.steam_appid == gameId);

        if (game) {
            gameDetails.classList.add("visible");
            gameList.innerHTML = ""; // Hide game list

            detailsContent.innerHTML = `
                <h2>${game.name}</h2>
                <img src="${game.header_image}" alt="${game.name}" />
                <p>${game.short_description}</p>
                <p><strong>Release Date:</strong> ${game.release_date?.date || "Unknown"}</p>
                <p><strong>Developer:</strong> ${game.developers?.join(", ") || "Unknown"}</p>
                <p><strong>Price:</strong> ${game.is_free ? "Free" : game.price_overview?.final_formatted || "N/A"}</p>
            `;
        }
    } catch (error) {
        console.error("Error fetching game details:", error);
    }
}

// Event listeners
searchButton.addEventListener("click", () => {
    const query = searchBar.value.trim();
    if (query) fetchGames(query);
});

backButton.addEventListener("click", () => {
    gameDetails.classList.remove("visible");
    detailsContent.innerHTML = ""; // Clear details
});
