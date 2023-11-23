import { Router } from 'express';
import UserController from '../controllers/userController.js';

const router = Router();

router.get('/', UserController.getAllUsers);
router.post('/local', UserController.createUserLocal);
router.get('/current', UserController.getCurrentUser);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUserById);
router.delete('/:id', UserController.deleteUserById);

//  Input : username, email, password via body;
//  HTTP Success : 200 and message.
//  HTTP Errors : 400,500.
// router.post("/register", UserController.postUser);

// Delete user with the email if is unverified
//  Input : email via body;
//  HTTP Success : 200 and message.
//  HTTP Errors : 400, 404, 500.
// router.post("/register/cancel", UserController.postUserCancel);

export default router;
