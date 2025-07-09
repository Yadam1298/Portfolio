const About = require('../models/About');

exports.getAbout = async (req, res) => {
    try {
        const about = await About.findOne();
        if (!about) {
            return res.status(404).json({ message: "About info not found" });
        }
        res.status(200).json(about);
    } catch (error) {
        console.error("Error fetching about info:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.postAbout = async (req, res) => {
    try {
        const { aboutMe, sections } = req.body;

        let about = await About.findOne();
        if (about) {
            about.aboutMe = aboutMe;
            about.sections = sections;
        } else {
            about = new About({ aboutMe, sections });
        }

        await about.save();
        res.status(200).json({ message: "About information saved successfully" });
    } catch (error) {
        console.error("Error saving about info:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
