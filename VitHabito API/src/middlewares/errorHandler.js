import CustomError from "../error/CustomError.js"

const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomError) {
        return res.status(err.status).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
};

export default errorHandler;
