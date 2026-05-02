const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const API = process.env.API_URL || "http://54.164.114.50:8000";

app.get("/", async (req, res) => {
    try {
        const expenses = await axios.get(`${API}/expenses`);
        const summary = await axios.get(`${API}/summary`);

        res.render("index", {
            expenses: expenses.data,
            summary: summary.data
        });
    } catch (error) {
        console.error("Backend error:", error.message);

        res.render("index", {
            expenses: [],
            summary: []
        });
    }
});

app.post("/add", async (req, res) => {
    try {
        await axios.post(`${API}/expenses`, {
            amount: req.body.amount,
            category: req.body.category
        });
    } catch (error) {
        console.error("Add error:", error.message);
    }
    res.redirect("/");
});

app.get("/delete/:id", async (req, res) => {
    try {
        await axios.delete(`${API}/expenses/${req.params.id}`);
    } catch (error) {
        console.error("Delete error:", error.message);
    }
    res.redirect("/");
});

app.listen(3000, "0.0.0.0", () => {
    console.log("Frontend running on 3000");
});