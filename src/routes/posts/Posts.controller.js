import PostsService from './Posts.service.js';
import { v2 as cloudinary } from 'cloudinary';

class PostsController {
	async getAll(_, res) {
		try {
			const posts = await PostsService.getAll();
			res.status(200).json(posts);
		} catch (err) {
			res.status(500).json({ message: err.errors });
		}
	}

	async getById(req, res) {
		const { id } = req.params;

		try {
			const posts = await PostsService.getById(id);
			res.status(200).json(posts);
		} catch (err) {
			res.status(500).json({ message: err.errors });
		}
	}

	async create(req, res) {
		const { title, content } = req.body;
		const image = req.files.image;

		try {
			const uploadedData = await new Promise((res, rej) => {
				cloudinary.uploader.upload_stream((error, result) => {
					if (error) rej(error);
					if (!error) res(result);
				}).end(image.data);
			});
			const post = await PostsService.create(
				uploadedData.url,
				title,
				content
			);

			res.status(201).json(post);
		} catch (err) {
			res.status(500).json({ message: err });
		}
	}

	async delete(req, res) {
		const { id } = req.params;

		try {
			await PostsService.delete(id);
			res.status(200).json({ message: "Успешно удален!" });
		} catch (err) {
			res.status(500).json({ message: err.errors });
		}
	}

	async update(req, res) {
		const { id } = req.params;
		const { title, content } = req.body;
		const image = req.files?.image;

		try {
			if (image) {
				const uploadedData = await new Promise((res, rej) => {
					cloudinary.uploader.upload_stream((error, result) => {
						if (error) rej(error);
						if (!error) res(result);
					}).end(image.data);
				});

				const post = await PostsService.update(
					id,
					uploadedData.url,
					title,
					content
				);

				return res.status(200).json(post);
			}

			const post = await PostsService.update(
				id,
				undefined,
				title,
				content
			);

			res.status(200).json(post);
		} catch (err) {
			res.status(500).json({ message: err });
		}
	}
}

export default new PostsController();