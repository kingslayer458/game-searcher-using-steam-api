const express = require("express");
const axios = require("axios");
require("dotenv").config();
const path = require("path");

const app = express();
const PORT = 3000;
const STEAM_API_KEY = process.env.STEAM_API_KEY;

// Serve static files from the root folder
app.use(express.static(path.join(__dirname)));

// Fetch game data from Steam API
app.get("/search", async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    try {
        // Fetch game data
        const response = await axios.get(
            `https://api.steampowered.com/ISteamApps/GetAppList/v2/`
        );

        const games = response.data.applist.apps.filter(game =>
            game.name.toLowerCase().includes(query.toLowerCase())
        );

        const gameDetails = await Promise.all(
            games.slice(0, 10).map(async (game) => {
                try {
                    const detailsResponse = await axios.get(
                        `https://store.steampowered.com/api/appdetails?appids=${game.appid}`
                    );
                    return detailsResponse.data[game.appid]?.data || null;
                } catch {
                    return null;
                }
            })
        );

        res.json(gameDetails.filter(game => game));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch data from Steam API" });
    }
});

// Serve the main HTML file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


