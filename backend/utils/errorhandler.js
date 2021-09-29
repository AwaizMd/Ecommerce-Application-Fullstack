class ErrorHander extends Error{   //Errorhandler is a default class of node
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode;

        Error.captureStackTrace(this,this.constructor);
        
    }

}

module.exports = ErrorHander;