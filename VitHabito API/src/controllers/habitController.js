import CustomError from "../error/CustomError.js"
import habitService from "../services/habitService.js"
import dayService from "../services/dayService.js"
import userService from "../services/userService.js"

const habitControler = {}

habitControler.getHabits = async (req, res, next) => {
    const { dayId, userId } = req.query 

    try {
        let habits
        if (userId) {
            habits = await habitService.getHabitsByUserId(userId)
        }else if(dayId) {
            habits = await habitService.getHabitsByDayId(dayId)
        }else{
            habits = await habitService.getAllHabits()
        }

        if (habits.length == 0) {
            return res.status(204).send(habits)
        }
        res.status(200).send(habits)

    } catch (error) {
        next(error)
    }
}

habitControler.getAllHabits = async (req, res, next) => {
    try {
        const allHabits = await habitService.getAllHabits()

        if (allHabits.length == 0) {
           return res.status(204).send(allHabits)
        }
        res.status(200).send(allHabits)
    } catch (error) {
        next(error)
    }
}

habitControler.deleteHabit = async (req, res, next) => {
    try {
        const { habitId, dayId } = req.query

        if (!habitId && !dayId) {
            throw new CustomError(400, "Query parameters needed to delete an habit")
        }

        let response
        if (habitId) {
            response = await habitService.deleteHabitsByHabitId(habitId)
        }else if (dayId) {
            response = await habitService.deleteHabitsByDayId(dayId)
        }

        res.status(200).send(response)

    } catch (error) {
        next(error)
    }
}

habitControler.createHabit = async (req, res, next) => {
    try {
        const data = req.body
        const { dayId } = req.params
        const createdHabit = await habitService.createHabit(data, dayId)
        res.status(200).send(createdHabit)
    } catch (error) {
        next(error)
    }
} 

habitControler.changeStateByHabitId = async (req, res, next) => {
    try {
        const { habitId } = req.params
        const changedHabit = await habitService.changeStateByHabitId(habitId)
        res.status(200).send(changedHabit)
    } catch (error) {
        next(error)
    }
}

habitControler.getEffectivenessForDay = async (req, res, next) => {
    try {
        const { userId } = req.params
        const currentDay = new Date().getDay()
        const effectiveness = await dayService.getEffectivenessForDay(userId, currentDay)
        res.status(200).send({ currentEffectiveness: effectiveness })
    } catch (error) {
        next(next)
    }
}

habitControler.getWeeklyEffectiveness = async (req, res, next) => {
    try {
        const { userId } = req.params
        const effectiveness = await userService.getWeeklyEffectiveness(userId)
        res.status(200).send({ totalEffectiveness: effectiveness})
    } catch (error) {
        next(error)
    }
}

export default habitControler