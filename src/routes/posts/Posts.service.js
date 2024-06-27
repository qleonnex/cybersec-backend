import mongoose from 'mongoose';
import { PostModel } from '../../models/Post.model.js';
import { v2 as cloudinary } from 'cloudinary';

class PostsService {
	Model = mongoose.model("Post", PostModel);

	async getAll() {
		const docs = await this.Model.find();
		return docs;
	}

	async getById(id) {
		const doc = await this.Model.findByIdAndUpdate(
			id, { $inc: { views: 1 } }, { new: true }
		);
		if (!doc) return false;
		await doc.save();

		return doc;
	}

	async create(imageUrl, title, content) {
		const doc = new this.Model({ imageUrl, title, content });
		await doc.save();

		return doc;
	}

	async delete(id) {
		return await this.Model.findByIdAndDelete(id);
	}

	async update(id, imageUrl, title, content) {
		const oldDoc = await this.Model.findById(id);

		if (!oldDoc) return false;

		const doc = await this.Model.findByIdAndUpdate(
			id, { imageUrl, title, content, updated_at: Date.now() }, { new: true }
		);

		if (imageUrl) {
			const imageParts = oldDoc.imageUrl.split('/');
			const imageLastIndex = imageParts[imageParts.length - 1];
			const imagePrefix = imageLastIndex.split('.')[0];
			await cloudinary.api.delete_resources_by_prefix(imagePrefix);
		}

		return doc;
	}
}

export default new PostsService();