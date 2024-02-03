import express from "express";
import path from "path";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import customerRoutes from "./routes/doc.routes.js";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { requestLogger } from './controllers/logger.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();



const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// middlewares
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
// Use the requestLogger middleware
app.use(requestLogger);

// routes
app.use(customerRoutes);

// static files
app.use(express.static(path.join(__dirname, "public")));

// starting the server
export default app;
