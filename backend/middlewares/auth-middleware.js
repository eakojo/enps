const CustomError = require('../middlewares/custom-error')
const DatabaseFunc = require('../services/db-functions')
const JwtService = require('../services/auth-service')

const Crud = new DatabaseFunc()
async function getMember (id) {
    let result
    result = await memberService.memberData({id: id})
    if(!result) {
       return null
    };
    return result
}

async function getAccount (id) {
    let result
    result = await Crud.findOne('Account',{id: id})
    if(!result) {
       return null
    };
    return result
}

async function getAccountAssoc (id, role) {
    let result
    let Model = role.charAt(0).toUpperCase() + role.substring(1);
    result = await Crud.findOne(Model,{accountId: id})
    if(!result) {
       return null
    };
    return result
}

function getTokenFromHeaders (req){
    const { headers: { authorization } } = req;

    if(authorization && authorization.split(' ')[0] === 'Token') {
        return authorization.split(' ')[1]; 
    }
    return null;
}

let requestOption = {
    issuer: 'blossom eNPS',
    audience: 'blossom'
}

const authenticate = async (req, res, next) => {
    
    var payload = {}
    var token = getTokenFromHeaders(req)
    var paths = req.originalUrl.split('/')

    if(token === null) {
        throw new CustomError(401, 'access denied')
    }

    payload = await JwtService.verify(token, requestOption)
    if(payload === false) {
        throw new CustomError(401, 'access denied')
    }
   
    var account = await getAccount(payload._id)
    if(account.role == 'management' || account.role == 'employee'){ 
        let assoc = await getAccountAssoc(payload._id, account.role)
        req.assoc = assoc
    }

    if(account == null) {
        return res.status(403).send('invalid account details denied').end();
    }
    
    req.account = account
    next()
}
module.exports.auth = authenticate  

const optionalAuth = async (req, res, next) => {
    
    var payload = {}
    var token = getTokenFromHeaders(req)
    var paths = req.originalUrl.split('/')

    if(token == null) {
        next()
    }

    payload = await JwtService.verify(token, requestOption)
    if(payload === false) {
        throw new CustomError(401, 'access denied')
    }
   
    var account = await getAccount(payload._id)

    if(account.role == 'management' || account.role == 'employee'){ 
        let assoc = await getAccountAssoc(payload._id, account.role)
        req.assoc = assoc
    }

    if(account == null) {
        return res.status(403).send('invalid account details denied').end();
    }
    
    req.account = account
    next()
}
module.exports.optionalAuth = optionalAuth  
