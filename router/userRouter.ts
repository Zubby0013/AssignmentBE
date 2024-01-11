import { Router } from "express";
import { createUser, getAllUser, getOneUser, verifyUser } from "../controller/userController";


const router:Router = Router();

router.route('/create-user').post(createUser);
router.route('/get-all-user').get(getAllUser);
router.route('/get-one-user/:userID').get(getOneUser);
router.route('/verify-user').patch(verifyUser);

export default router;