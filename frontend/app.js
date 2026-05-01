const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const API = "http://backend:8000";

app.get("/", async (req, res) => {
    const expenses = await axios.get(`${API}/expenses`);
    const summary = await axios.get(`${API}/summary`);

    res.render("index", {
        expenses: expenses.data,
        summary: summary.data
    });
});

app.post("/add", async (req, res) => {
    await axios.post(`${API}/expenses`, {
        amount: req.body.amount,
        category: req.body.category
    });
    res.redirect("/");
});

app.get("/delete/:id", async (req, res) => {
    await axios.delete(`${API}/expenses/${req.params.id}`);
    res.redirect("/");
});

app.listen(3000, () => console.log("Frontend running on 3000"));