import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    template: {
        type: String,
        enum: ["modern", "executive", "compact", "clean"],
        default: "modern"
    },
    isProTemplate: {
        type: Boolean,
        default: false
    },
    personalInfo: {
        fullName: String,
        jobTitle: String,
        email: String,
        phone: String,
        location: String,
        linkedin: String,
        github: String,
        portfolio: String,
        summary: String
    },
    skills: {
        languages: String,
        frameworks: String,
        databases: String,
        tools: String
    },
    experience: [{
        company: String,
        position: String,
        location: String,
        startDate: String,
        endDate: String,
        current: Boolean,
        bullets: [String]
    }],
    projects: [{
        title: String,
        techStack: String,
        link: String,
        github: String,
        bullets: [String]
    }],
    education: [{
        institution: String,
        degree: String,
        fieldOfStudy: String,
        location: String,
        startDate: String,
        endDate: String,
        gpa: String
    }],
    certifications: [{
        name: String,
        issuer: String,
        date: String
    }],
    atsScore: {
        type: Number,
        default: 85
    }
}, { timestamps: true });

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;