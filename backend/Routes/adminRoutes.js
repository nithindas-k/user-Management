import { Router } from "express";
import {
    login,
    deleteUser,
    updateUser,
    createUser,
    getAllUsers
} from "../controller/adminController.js";
import {
    decodeTokenMiddleware,
    authorizeRoles,
} from "../middleware/authMiddleware.js";

import { ROLES } from "../utils/constants.js";

const router = Router();

router.post("/login", login);

router.use(decodeTokenMiddleware, authorizeRoles([ROLES.ADMIN]));

router
    .route("/user/:id").delete(deleteUser).put(updateUser);
router.post("/user", createUser);
router.get("/users", getAllUsers);


export default router;
