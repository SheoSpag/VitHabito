import db from "../db/database.js"
import randomId from "../utils/randomId.js"
import CustomError from "../error/CustomError.js"

const habitService = {}

habitService.getAllHabits = async () => {
    const allHabits = await db.habit.findMany()
    return allHabits
}

habitService.getHabitsByUserId = async (userId) => {
    const habitsByUserId = await db.user.findUnique({
        where: {
            id: userId
        },
        include: {
            days: {
                include: {
                    habits: true,
                },
            },
        },
    });

    if (!habitsByUserId) {
        throw new CustomError(404, `User with id ${userId} not found`);
    }

    return habitsByUserId.days.flatMap(day => day.habits);
}

habitService.getHabitsByDayId = async (dayId) => {
    const habitsByDayId = await db.day.findFirst({
        where: {
            id: dayId
        },
        include: {
            habits: true
        }
    })

    return habitsByDayId.habits
}

habitService.deleteHabitsByDayId = async (id) => {
    const serchedDay = await db.day.findFirst({
        where: {
            id
        },
        include:{
            habits: true
        }
    })

    if (!serchedDay) {
        throw new CustomError(404, `We cant find the day with id ${id}`)
    }

    const deletedHabits = await db.habit.deleteMany({
        where: {
            dayId: id
        }
    })

    return serchedDay.habits

}

habitService.deleteHabitsByHabitId = async (habitId) => {
    const serchedHabit = await db.habit.findFirst({
        where: {
            id: habitId
        }
    })

    if (!serchedHabit) {
        throw new CustomError(404, `We cant find the habit with id ${id}`)
    }

    const deletedHabit = await db.habit.delete({
        where: {
            id: habitId
        }
    })

    return deletedHabit
}


habitService.createHabit = async (data, dayId) => {
    const updatedData = {
        ...data,
        id: randomId.generate(),
        dayId
    }
    const createdHabit = await db.habit.create({
        data: updatedData
    })

    return createdHabit
}

habitService.changeStateByHabitId = async (id) => {
    const serchedHabit = await db.habit.findFirst({
        where: {
            id
        }
    })

    if (!serchedHabit) {
        throw new CustomError(404, `We coudnt find the habit with id ${id}`)
    }

    const updatedHabit = await db.habit.update({
        where:{
            id
        },
        data: {
            completed: !serchedHabit.completed
        }
    })

    return updatedHabit
}



export default habitService