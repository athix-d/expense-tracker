const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Use env for accessing backend IP
const API = process.env.API_URL;

// Log once at startup (VERY IMPORTANT for debugging)
console.log("Using Backend API:", API);

app.get("/", async (req, res) => {
    console.log("Incoming request: /");

    let expenses = [];
    let summary = [];

    try {
        const expRes = await axios.get(`${API}/expenses`, { timeout: 5000 });
        expenses = expRes.data;
    } catch (error) {
        console.error("Expenses API error:", error.message);
    }

    try {
        const sumRes = await axios.get(`${API}/summary`, { timeout: 5000 });
        summary = sumRes.data;
    } catch (error) {
        console.error("Summary API error:", error.message);
    }

    // 🔥 ALWAYS respond (prevents ERR_EMPTY_RESPONSE)
    res.render("index", { expenses, summary });
});

app.post("/add", async (req, res) => {
    try {
        await axios.post(`${API}/expenses`, {
            amount: req.body.amount,
            category: req.body.category
        }, { timeout: 5000 });
    } catch (error) {
        console.error("Add error:", error.message);
    }
    res.redirect("/");
});

app.get("/delete/:id", async (req, res) => {
    try {
        await axios.delete(`${API}/expenses/${req.params.id}`, { timeout: 5000 });
    } catch (error) {
        console.error("Delete error:", error.message);
    }
    res.redirect("/");
});

// MUST bind to 0.0.0.0 for Docker
app.listen(3000, "0.0.0.0", () => {
    console.log("Frontend running on 3000");
});