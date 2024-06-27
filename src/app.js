import express from "express";
import dotenv from "dotenv";
import fileUpload from 'express-fileupload';

import PostsRoute from "./routes/posts/posts.route.js";
import { mgConnect } from './config/mgConnect.js';
import { cdConnect } from './config/cloundinaryConnect.js';

dotenv.config();
const URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;
const CLOUD_NAME = process.env.CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

const app = express();

app.use("/public", express.static("public"));
app.use(express.json());
app.use(fileUpload());
app.use("/posts", PostsRoute);

(async function run() {
	try {
		app.listen(PORT, () => (
			console.log(`🚀 localhost:${PORT} is listening now!`)
		));
		mgConnect(URI);
		cdConnect(CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET);
	} catch (err) {
		console.log(`⭕ ${err.message}`);
	}
})();