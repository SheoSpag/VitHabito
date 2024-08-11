import dayService from "../services/dayService.js";

const dayController = {}

dayController.getDay = async (req, res, next) => {
    try {
        const { dayId, userId } = req.query
        
        let response 

        if (dayId) {
            response = await dayService.getDayByDayId(dayId)
        }else if(userId) {
            response = await dayService.getDaysByUserId(userId)
        }else{
            response = await dayService.getAllDays()
        }

        if (response.length == 0) {
            return res.status(204).send(response)
        }
        res.status(200).send(response)

    } catch (error) {
        next(error)
    }
}



export default dayController