import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { AdminRepository } from "../repositories/AdminRepositoy";
import { AdminInteractor } from "../interactors/AdminInteractor";
import { protectAdmin } from "../middlewares/authMiddleware";
import { MessageBroker } from "../external-libraries/messageBroker";
const adminRouter = Router()

const adminRepository = new AdminRepository()
const broker = new MessageBroker()
const adminInteractor = new AdminInteractor(adminRepository, broker)
const adminController = new AdminController(adminInteractor)


adminRouter.post('/login', adminController.verifyLogin.bind(adminController));
// adminRouter.get('/users', protectAdmin, adminController.getUsers.bind(adminController));
adminRouter.get('/users', protectAdmin, adminController.getUsers.bind(adminController));

adminRouter.post("/refresh-token", adminController.refreshAccessToken.bind(adminController));
adminRouter.patch('/users/:id/block', protectAdmin, adminController.blockUnblockUser.bind(adminController));


adminRouter.get('/fetch-reports', protectAdmin,adminController.fetchReports.bind(adminController));
adminRouter.patch('/resolve-report/:postId', protectAdmin, adminController.resolveReport.bind(adminController));
adminRouter.patch('/delete-post/:postId', protectAdmin, adminController.deleteReportedPost.bind(adminController));


adminRouter.post('/sponsored-posts', protectAdmin,adminController.createSponsoredPost.bind(adminController));
adminRouter.get('/sponsored-posts', protectAdmin,adminController.getSponsoredPosts.bind(adminController));
adminRouter.put('/sponsored-posts/:id', protectAdmin,adminController.updateSponsoredPost.bind(adminController));
adminRouter.delete('/sponsored-posts/:id', protectAdmin,adminController.deleteSponsoredPost.bind(adminController));

export default adminRouter