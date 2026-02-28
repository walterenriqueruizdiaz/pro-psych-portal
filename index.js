const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("SERVER IS RUNNING");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("SERVER STARTED ON PORT", PORT);
});