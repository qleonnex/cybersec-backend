import dotenv from "dotenv";
import PostsService from './Posts.service.js';

dotenv.config();
const URL = process.env.URL;
const PORT = process.env.PORT;

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
		const path = `/public/${image.name}`;

		try {
			image.mv(`.${path}`);
			const post = await PostsService.create(
				`http://${URL}:${PORT + path}`,
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
		const image = req.files.image;
		const path = `/public/${image.name}`;

		try {
			image.mv(`.${path}`);
			const post = await PostsService.update(
				id,
				`http://${URL}:${PORT + path}`,
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