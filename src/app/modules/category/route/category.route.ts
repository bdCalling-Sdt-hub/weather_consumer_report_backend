import express from 'express';
import { addCategoryController } from '../controller/addCategory.controller';
import { deleteCategoryController } from '../controller/deleteCategory.controller';
import { updateCategoryController } from '../controller/updateCategory.controller';
import { getCategoryController } from '../controller/getCategory.controller';
import { getSingleCategoryController } from '../controller/getSingleCategoryData.controller';

const categoryRouter = express.Router();

categoryRouter.get('/', getCategoryController);
categoryRouter.get('/:id', getSingleCategoryController);
categoryRouter.post('/add', addCategoryController);
categoryRouter.delete('/:id', deleteCategoryController);
categoryRouter.patch('/:id', updateCategoryController);

export { categoryRouter };
