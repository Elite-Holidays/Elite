import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import 'dotenv/config';
import connectDB from "./utils/db.js";
import connectCloudinary from './utils/cloudinary.js';
import { clerkClient } from "@clerk/express";

// Import Routes
import heroSlideRoutes from "./routes/heroSlideRoutes.js";
import travelPackageRoutes from "./routes/travelPackageRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import featureRoutes from "./routes/featureRoutes.js";
import statisticRoutes from "./routes/statisticRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import aboutUsRoutes from "./routes/aboutUsRoutes.js"; 
import officeRoutes from "./routes/officeRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

const app = express();
const port = process.env.PORT || 8000;

// Connect Cloudinary and MongoDB
connectCloudinary();
connectDB()
    .then(() => {
        console.log("✅ MongoDB connected successfully");

        // Middleware Setup
        app.use(express.json());
        app.use(urlencoded({ extended: true }));
        app.use(cookieParser());
        app.use(cors({ origin: "*", credentials: true })); // Update if needed

        // Test Route - Fetch Users
        app.get("/", async (req, res) => {
            try {
                const getUsers = await clerkClient.users.getUserList({
                    orderBy: "+created_at",
                });
        
                //console.log("Fetched Users from Clerk:", getUsers); // Debugging
        
                return res.status(200).json({
                    message: "Backend connection done",
                    success: true,
                    users: getUsers.data || [], // Ensure it's an array
                });
            } catch (error) {
                return res.status(500).json({
                    message: "Error fetching users",
                    success: false,
                    error: error.message,
                });
            }
        });
        

        // API Routes
        app.use("/api/heroslides", heroSlideRoutes);
        app.use("/api/travelpackages", travelPackageRoutes);
        app.use("/api/reviews", reviewRoutes);
        app.use("/api/features", featureRoutes);
        app.use("/api/statistics", statisticRoutes);
        app.use("/api/groups", groupRoutes);
        app.use("/api/about-us", aboutUsRoutes);
        app.use("/api/offices", officeRoutes);
        app.use("/api/chatbot", chatbotRoutes);
        app.use("/api/contacts", contactRoutes);
        app.use("/api/bookings", bookingRoutes);

        // Start Server
        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("❌ Database connection failed:", err);
    });
