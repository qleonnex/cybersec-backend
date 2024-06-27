import { body, } from "express-validator";

export const postCreateValidate = [
	body("title", "Обязательное поле (string)!").isString(),
	body("content", "Обязательное поле (string)!").isString()
];

export const postUpdateValidate = [
	body("title", "Поле должно быть типа string!").isString().optional(),
	body("content", "Поле должно быть типа string!").isString().optional()
];