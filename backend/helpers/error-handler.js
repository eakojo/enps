class ErrorHandler extends Error {
    constructor(statusCode, message) {
      super();
      this.statusCode = statusCode;
      this.message = message;
    }
}

const handleError = (err, res) => {
    const { statusCode, message } = err;
    if(statusCode){
      res.status(statusCode).json({
        status: "error",
        message
      });
    }else{
      Logger.error({message})
      res.status(500).json({
        status: "error",
        message:'Internal error'
      });
    }
  };

module.exports = {
    ErrorHandler,
    handleError
}
