import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import RecipientsController from './app/controllers/RecipientsController';
import DeliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';
import OrderController from './app/controllers/OrderController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryProblemsController from './app/controllers/DeliveryProblemsController';

import authMiddleware from './app/middlewares/auth';

const routes = Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.get('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/recipients', RecipientsController.store);
routes.put('/recipients', RecipientsController.update);
routes.delete('/recipients', RecipientsController.delete);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/deliveryman', DeliverymanController.store);
routes.get('/deliveryman', DeliverymanController.index);
routes.put('/deliveryman', DeliverymanController.update);
routes.delete('/deliveryman', DeliverymanController.delete);

routes.post('/order', OrderController.store);
routes.get('/order', OrderController.index);
routes.put('/order', OrderController.update);
routes.delete('/order', OrderController.delete);

routes.get('/deliveryman/:deliverymanId/deliveries', DeliveryController.index);
routes.put(
  '/deliveryman/:deliverymanId/deliveries/:orderId',
  DeliveryController.startDelivery
);

routes.get('/delivery/problems', DeliveryProblemsController.index);
routes.get('/delivery/:orderId/problems', DeliveryProblemsController.index);
routes.post('/delivery/:orderId/problems', DeliveryProblemsController.store);

routes.delete('/problem/:problemId/cancel-delivery', OrderController.delete);

export default routes;
