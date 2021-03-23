const User = require('../models/user')
const {ErrorHandler} = require('../helpers/error-handler')

let validators = {
    'user': {
        scopes: {
            register: User.RegisterValidationScema,
            login: User.LoginValidationScema,
            update: User.UpdateValidationScema
        }
    }
}


function scopeExists(validator, scope) {
    return Object.keys(validator.scopes).find(key => key == scope) != undefined;
}

function getSchema(model, scope) {
    let validator = validators[model];
    if (!validator) {
        throw new Error("Validator does not exist");
    }

    if(validator.scopes) {
        if(scope) {
            if(!scopeExists(validator, scope)) {
                throw new Error(`Scope ${scope} does not exist in ${model} validator`);
            }
            else {
                return validator.scopes[scope];
            }
        }
        else {
            return validator.scopes.default;
        }
    }
    else {
        return validator;
    }
}

function validate(model, object, scope) {
    var modelSchema = getSchema(model, scope)
    return modelSchema.validate(object);
}

module.exports = function ValidationMiddleware(model, scope) {
    return (req, res, next) => {
        const validationResult = validate(model, req.body, scope);
        if(validationResult.error) {
            let message = validationResult.error.message
            message  = message.replace(/"/g,"");
            throw new ErrorHandler(422, message)
        }
        else {
            next();
        }
    };
}