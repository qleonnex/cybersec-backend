import { Router } from 'express';
import PostsController from './posts.controller.js';

const route = Router();

route.get('/', PostsController.getAll);
route.get('/:id', PostsController.getById);
route.post('/', PostsController.create);
route.delete('/:id', PostsController.delete);
route.patch('/:id', PostsController.update);

export default route;