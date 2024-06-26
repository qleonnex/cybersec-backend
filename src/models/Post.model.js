import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

export const PostModel = new mongoose.Schema({
	imageUrl: String,
	title: String,
	content: String,
	created_at: {
		type: Date,
		default: Date.now()
	},
	views: {
		type: Number,
		default: 0
	}
});