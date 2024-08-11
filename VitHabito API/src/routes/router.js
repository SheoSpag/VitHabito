import { Router } from "express";
import userController from "../controllers/userController.js";
import dayController from "../controllers/dayController.js";
import habitControler from "../controllers/habitController.js";
import authMiddleware    from "../middlewares/authMiddleware.js";

const router = Router()

//User routes
router.get('/user', authMiddleware, (req, res, next) => userController.getUser(req, res, next))
router.patch('/user/:userId', authMiddleware, (req, res, next) => userController.updateUser(req, res, next))
router.post('/user', (req, res, next) => userController.createUser(req, res, next))
router.delete('/user/:userId', authMiddleware, (req, res, next) => userController.deleteUser(req, res, next))
router.post('/user/login', (req,res, next) => userController.login(req, res, next))

// Day routes
router.get('/day', authMiddleware, (req, res, next) => dayController.getDay(req, res, next))

//Habit routes
router.get('/habit', authMiddleware, (req, res, next) => habitControler.getHabits(req, res, next))
router.get('/habit/dayEffectiveness', authMiddleware, (req, res, next) => habitControler.getEffectivenessForDay(req, res, next))
router.get('/habit/weekEffectiveness', authMiddleware, (req, res, next) => habitControler.getWeeklyEffectiveness(req, res, next))
router.post('/habit/:dayId', authMiddleware, (req, res, next) => habitControler.createHabit(req, res, next))
router.delete('/habit', authMiddleware, (req, res, next) => habitControler.deleteHabit(req, res, next))
router.patch('/habit/:habitId', authMiddleware, (req, res, next) => habitControler.changeStateByHabitId(req, res, next))
    
export default router 