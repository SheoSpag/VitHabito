import userService from "../services/userService.js"
import jwt from 'jsonwebtoken';


const userController = {}

userController.getUser = async (req, res, next) => {
    try {
        const { userId } = req.query
        let response
        if (userId) {
            response = await userService.getUserById(userId)
        }else{
            response = await userService.getAllUsers()   
        }

        if (!response) {
            return res.status(204).send(response)  
        }
        res.status(200).send(response)

    } catch (error) {
        next(error)
    }
}

userController.getAllUsers = async (req, res) => {
    try {
        const allUsers = await userService.getAllUsers()

        if (allUsers.length == 0) {
           return res.status(204).send(allUsers)
        }
        res.status(200).send(allUsers)
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor'})
    }
}

userController.getUserById = async (req, res, next) => {
    try {
        const { userId } = req.params
        const serchedUser = await userService.getUserById(id)
        res.status(200).send(serchedUser)
    } catch (error) {
        next(error)
    }

    
}

userController.updateUser = async (req, res, next) => {
    try {
        const data = req.body
        const { userId } = req.params

        const updatedUser = await userService.updateUser(id, data)
        res.status(200).send(updatedUser)
    } catch (error) {
        next(error)
    }
} 

userController.createUser = async (req, res, next) => {
    try {
        const data = req.body
        const createdUser = await userService.createUser(data)
        res.status(200).send(createdUser)
    } catch (error) {
        next(error)
    }
}

userController.deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params
        const deletedUser = await userService.deleteUser(id)
        res.status(200).send(deletedUser)  
    } catch (error) {
        next(error)
    } 
}

userController.login = async (req, res, next) => {
    try {

        const { email, password } = req.body
        const logedUser = await userService.login(email, password)
        const token = jwt.sign({ userId: logedUser.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ token })

    } catch (error) {
        next(error)
    }
}

export default userController