import db from "../db/database.js"
import CustomError from "../error/CustomError.js"
import idRandom from "../utils/randomId.js"

const dayService = {}

dayService.getAllDays = async () => {
  const allDays = await db.day.findMany()
  return allDays

}

dayService.getDayByDayId =  async (dayId) => {
  const serchedDay = await db.day.findFirst({
    where: {
      id: dayId
    }
  })

  if (!serchedDay) {
    throw new CustomError(404, `We couldnt find the day with de id ${dayId}`)
  }

  return serchedDay
}

dayService.getDaysByUserId = async (userId) => {
  const serchedUser = await db.user.findFirst({
    where: {
      id: userId
    },
    include: {
      days: true
    }
  })

  if (!serchedUser) {
    throw new CustomError(404, `Cant find the user with id ${userId}`)
  }

  return serchedUser.days

}

dayService.createDays = async (userId) => {
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = {
        id: idRandom.generate(),
        dayOfWeek: i,
        userId: userId
      };
      days.push(day);
    }
  
    await db.day.createMany({
      data: days
    });

    const createdDays = await db.day.findMany({
        where: {
            userId
        }
    })

    return createdDays
}

dayService.getEffectivenessForDay = async (userId, currentDay) => {

  const days = await db.day.findMany({
    where: {
      userId,
      dayOfWeek: {
        lte: currentDay
      }
    },
    include: {
      habits: true
    }
  })

  let totalHabits = 0
  let completedHabits = 0

  days.forEach(day => {
    totalHabits += day.habits.length
    completedHabits += day.habits.filter(habits => habits.completed).length
  })

  const effectiveness = (totalHabits > 0) ? (completedHabits / totalHabits) * 100 : 0;

  return effectiveness
}

export default dayService