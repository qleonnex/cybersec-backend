import { validationResult } from 'express-validator';
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
			const post = await PostsService.getById(id);

			if (!post)
				return res.status(404).json({ error: "Пост не найден!" });

			res.status(200).json(post);
		} catch (err) {
			res.status(500).json({ error: err });
		}
	}

	async create(req, res) {
		const { title, content } = req.body;
		const image = req.files?.image;

		const { errors } = validationResult(req);

		if (errors.length)
			return res.status(500).json({ errors });

		try {
			let uploadedData;
			if (image) {
				uploadedData = await new Promise((res, rej) => {
					cloudinary.uploader.upload_stream((error, result) => {
						if (error) rej(error);
						if (!error) res(result);
					}).end(image.data);
				});
			}

			const post = await PostsService.create(
				uploadedData?.url ?? null,
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
			const post = await PostsService.delete(id);

			if (!post)
				return res.status(404).json({ error: "Пост не найден!" });

			const imageParts = post.imageUrl.split('/');
			const imageLastIndex = imageParts[imageParts.length - 1];
			const imagePrefix = imageLastIndex.split('.')[0];
			await cloudinary.api.delete_resources_by_prefix(imagePrefix);

			res.status(200).json({ message: "Успешно удален!" });
		} catch (err) {
			res.status(500).json({ message: err });
		}
	}

	async update(req, res) {
		const { id } = req.params;
		const { title, content } = req.body;
		const image = req.files?.image;

		const { errors } = validationResult(req);

		if (errors.length)
			return res.status(500).json({ errors });

		try {
			let uploadedImage = undefined;

			if (image) {
				uploadedImage = await new Promise((resolve, reject) => {
					cloudinary.uploader.upload_stream((error, result) => {
						if (error) {
							return reject(error);
						};
						resolve(result);
					}).end(image.data);
				});
			}

			const post = await PostsService.update(
				id,
				uploadedImage?.url,
				title,
				content
			);

			if (!post) {
				cloudinary.api.delete_resources_by_prefix(uploadedImage.display_name);
				return res.status(404).json({ error: "Пост не найден!" });
			}


			res.status(200).json(post);
		} catch (err) {
			res.status(500).json({ error: err });
		}
	}
}

export default new PostsController();