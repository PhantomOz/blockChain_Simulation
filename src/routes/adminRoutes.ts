import { Router } from "express";
import admin_routes from "../handlers/admin";

const router = Router();
admin_routes(router);
export default router;
