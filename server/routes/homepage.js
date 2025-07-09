const express = require("express");
const router = express.Router();
const HomeModel = require("../models/home");

// GET Home data
router.get("/", async (req, res) => {
    try {
        let homeData = await HomeModel.findOne();
        if (!homeData) {
            // If no Home exists, create default
            homeData = new HomeModel();
            await homeData.save();
        }
        res.json(homeData);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// PUT update Home data
router.put("/", async (req, res) => {
    try {
        let homeData = await HomeModel.findOne();
        if (!homeData) {
            homeData = new HomeModel();
        }

        // Update fields from req.body
        homeData.name = req.body.name || homeData.name;
        homeData.roles = req.body.roles || homeData.roles;
        homeData.about = req.body.about || homeData.about;
        homeData.resumeLink = req.body.resumeLink || homeData.resumeLink;
        homeData.profilePicUrl = req.body.profilePicUrl || homeData.profilePicUrl;
        homeData.contacts = req.body.contacts || homeData.contacts;

        await homeData.save();
        res.json({ message: "Home updated successfully", homeData });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
