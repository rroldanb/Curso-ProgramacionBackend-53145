// const EErrors = require("../../utils/errors/enums")

// const errorHandler = () => (error, req, res, next) => {
    
//     switch (error.code) {
//         case EErrors.INVALID_TYPES_ERROR:
//             return res.send({status: 'error', error: error.name})            
//             break;
//         case EErrors.ROUTING_ERROR:
//             return res.send({status: 'error', error: error.name})            
//             break;
    
//         default:
//             return res.send({status: 'error', error: 'Unhandled error'})
//             break;
//     }
//     next()
// }

// module.exports = errorHandler



const EErrors = require("../../utils/errors/enums");

const handleErrors = () => (error, req, res, next) => {
    switch (error.code) {
        case EErrors.INVALID_TYPES_ERROR:
            return res.status(400).send({ status: "error", error: error.message, cause: error.cause });
        case EErrors.ROUTING_ERROR:
            return res.status(404).send({ status: "error", error: error.message, cause: error.cause });
        case EErrors.MISSING_FIELD:
            return res.status(400).send({ status: "error", error: error.message, cause: error.cause });
        default:
            return res.status(500).send({ status: "error", error: "Unhandled error", cause: error.message });
    }
};

module.exports = handleErrors;