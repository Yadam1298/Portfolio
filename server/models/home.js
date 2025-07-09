const mongoose = require("mongoose");

const homepageSchema = new mongoose.Schema({
    name: { type: String, default: "Your Name" },
    roles: { type: [String], default: [] },
    about: { type: String, default: "" },
    resumeLink: { type: String, default: "" },
    profilePicUrl: { type: String, default: "" },
    contacts: {
        email: { type: String, default: "" },
        github: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        whatsapp: { type: String, default: "" },
    },
});

module.exports = mongoose.model("homepage", homepageSchema);
