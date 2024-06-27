import { v2 as cloudinary } from "cloudinary";

export function cdConnect(name, key, secret) {
	cloudinary.config({
		cloud_name: name,
		api_key: key,
		api_secret: secret,
		secure: true
	});
}