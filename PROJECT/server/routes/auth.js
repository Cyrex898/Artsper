import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router();   // This peice of code will allow Express to identify that these routes will all be configured, while they are in seprate files

router.post("/login", login);
 
export default router;





