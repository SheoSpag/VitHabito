import db from "../db/database.js"
import CustomError from "../error/CustomError.js"
import bcrypt from 'bcrypt'
import idRandom from "../utils/randomId.js"
import dayService from "./dayService.js"

const userService = {}

userService.getAllUsers = async () => {
    const allUsers = await db.user.findMany()
    return allUsers
}

userService.getUserById = async (id) => {
    const serchedUser = await db.user.findFirst({
        where: {
            id
        }
    })

    if (!serchedUser) {
        throw new CustomError(404, `Cant find the user with id ${id}`)
    }

    return serchedUser
}

userService.updateUser = async (id, data) => {

    const serchedUser = await db.user.findFirst({
        where: {
            id
        }
    })

    if (!serchedUser) {
        throw new CustomError(404, `Cant find the user with id ${id}`)
    }

    if (data.email) {
        const emailUser = await db.user.findFirst({
            where: {
                email: data.email
            }
        })

        if(emailUser){
            throw new CustomError(409, "Email already exist")
        }
    }

    const updatedUser = await db.user.update({
        where: {
            id
        },
        data
    })
    return updatedUser
} 

userService.createUser = async (data) => {

    const serchedUser = await db.user.findFirst({
        where: {
            email: data.email
        }
    })

    if (serchedUser) {
        throw new CustomError(409, "Email already exist")
    }

    const { password } = data

    const hasedPassword = await bcrypt.hash(password, 10)

    const userId = idRandom.generate()

    const updatedData = {
        ...data,
        id: userId,
        password: hasedPassword
    }


    const createdUser = await db.user.create({
        data: updatedData
    })

    const createdDays = await dayService.createDays(userId)

    const returnData = {
        ...createdUser,
        createdDays
    }
    return returnData
}

userService.deleteUser = async (id) => {

    const serchedUser = await db.user.findFirst({
        where: {
            id
        }
    })

    if (!serchedUser) {
        throw new CustomError(404, "Cant delete a user that doesnt exist")
    }

    const deletedUser = await db.user.delete({
        where: {
            id
        }
    })

    return deletedUser
}

userService.login = async (email, password) => {

    const serchedUser = await db.user.findFirst({
        where: {
            email
        }
    })

    if (!serchedUser) {
        throw new CustomError(404, "Email not found, go register")
    }

    const isSame = await bcrypt.compare(password, serchedUser.password)

    if (!isSame) {
        throw new CustomError(401, "Invalid email or password")
    }

    return serchedUser

}

userService.getWeeklyEffectiveness = async (userId) => {
    const days = await db.day.findMany({
        where: {
            userId
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

    const totalEffectiveness = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0

    return totalEffectiveness
}


export default userService