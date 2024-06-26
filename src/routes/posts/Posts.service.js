import mongoose from 'mongoose';
import { PostModel } from '../../models/Post.model.js';

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
		await doc.save();
		return doc;
	}

	async create(imageUrl, title, content) {
		const doc = new this.Model({ imageUrl, title, content });
		await doc.save();

		return doc;
	}

	async delete(id) {
		await this.Model.findByIdAndDelete(id);
	}

	async update(id, imageUrl, title, content) {
		return await this.Model.findByIdAndUpdate(
			id, { imageUrl, title, content }, { new: true }
		);
	}
}

export default new PostsService();