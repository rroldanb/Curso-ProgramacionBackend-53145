 class CustomError {
    static createError({name='Error', cause, message, code=1}){
        const error = new Error(message)
        error.name = name
        error.code = code
        error.cause = cause
        throw error
    }
}

module.exports = CustomError


// class CustomError extends Error {
//     constructor({ name, cause, message, code }) {
//         super(message);
//         this.name = name;
//         this.cause = cause;
//         this.code = code;
//     }

//     static createError({ name, cause, message, code }) {
//         throw new CustomError({ name, cause, message, code });
//     }
// }

// module.exports = CustomError;