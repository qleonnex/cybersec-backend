import { Router } from 'express';
import PostsController from './posts.controller.js';
import { postCreateValidate, postUpdateValidate } from '../../middlewares/validates/posts.validate.js';

const route = Router();

route.get('/', PostsController.getAll);
route.get('/:id', PostsController.getById);
route.post('/', postCreateValidate, PostsController.create);
route.delete('/:id', PostsController.delete);
route.patch('/:id', postUpdateValidate, PostsController.update);

export default route;