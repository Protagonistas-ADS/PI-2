import { Request, Response, NextFunction } from "express";
import AdminService from "../services/admin.service";

const AdminController = {

    async BuscarResumo(req: Request, res: Response, next: NextFunction) {
        try {
            const resumo = await AdminService.BuscarResumo();

            res.status(200).json(resumo);

        } catch (error) {
            next(error);
        }
    }
};

export default AdminController;
