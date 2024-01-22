import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import myHotelRoutes from "./routes/my-hotels";
import hotelRoutes from "./routes/hotels";
import bookingRoutes from "./routes/my-bookings";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

// initialize cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// connect to the mongoDB database
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

// create new express instance as app
const app = express();
// use cookie parser to add type cookie req body in the endpoint in middleware
app.use(cookieParser());

// convert body of API requests to json
app.use(express.json());
// parde url
app.use(express.urlencoded({ extended: true }));
// secure the app
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Specify the allowed origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

//go to the frontend dist folder and in the dist folder find and serve the static assets (html, css, js files)
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

// Handling preflight requests
app.options("*", cors());

// endpoint for express users api
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);

// catch all route
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

// start the server
app.listen(7000, () => {
  console.log("server running on localhost:7000");
});

