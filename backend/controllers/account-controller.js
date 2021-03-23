const router = require("express").Router();
const passGen = require('generate-password');
const asyncWrapper = require("../helpers/async-wrapper").AsyncWrapper;

const DatabaseFunc = require('../services/db-functions')
const crudService = new DatabaseFunc;

const Authenticator = require('../middlewares/auth-middleware')
const ImageUpload = require('../middlewares/file-handler').image
const CustomError = require('../middlewares/custom-error')
const Emailer = require('../middlewares/emailer')
const template = require('../templates/index')

/** 
 * functionality LOGIN
 * route: accounts/auth
*/
router.post('/auth', asyncWrapper(async(req, res) => {
    let user = await crudService.findOne('Account', {email: req.body.email, active: true})
    if(user){
        var result = await user.comparePassword(req.body.password)
        if(result == null){
            console.log('Password id not correct')
            throw new CustomError(422, 'Account does not exist')
        }
    }else{
        console.log('User not found ')
        throw new CustomError(422, 'Account does not exist')
    }

    let accountRole = (user.role) ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '';
    let profile;
    if(accountRole != ''){
        profile = await crudService.findOne(accountRole, {accountId: user.id})
        user.setDataValue('profile', profile)
        console.log(profile)
    }    
    let serialized = user.toWeb()
    delete serialized.password
    delete serialized.id
    let data = {
        type: 'user',
        result: serialized
    }
        
    let requestOption = {
        issuer: 'blossom eNPS',
        audience: 'blossom'
    }

    let token = user.getJWT(requestOption)
    res.json({message: 'Login successfull', result: data, token: token});
}))


router.get('/auth-data', [Authenticator.auth],asyncWrapper(async(req, res) => {

    let user = await crudService.findOne('Account', {id: req.account.id})
    let accountRole = (user.role) ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '';
    let profile;
    if(accountRole != ''){
        profile = await crudService.findOne(accountRole, {accountId: user.id})
        user.setDataValue('profile', profile)
        console.log(profile)
    }    
    let serialized = user.toWeb()
    serialized.password = '*****'
 
    res.json({message: 'Login successfull', result: serialized});
}))

/** 
 * functionality ADD COMPANY
 * route: accounts/add-company
**/
router.post("/add-company", [ ImageUpload.single('image')], asyncWrapper(async (req, res) => {
    var body = req.body
    if(req.file){
        body.logo = req.file.url;
    }
    let company = await crudService.create('Company', body)
    res.json({message: 'Company created successfully', result: company});

}))

/** 
 * functionality UPDATE COMPANY
 * route: accounts/update-company
**/
router.post("/update-company", [ ImageUpload.single('image')], asyncWrapper(async (req, res) => {
    var body = req.body
    if(req.file){
        body.logo = req.file.url;
    }
    let company = await crudService.update('Company', body, {id: body.postId})
    res.json({message: 'Company created successfully', result: company});

}))

/** 
 * functionality NEW ACCOUNT
 * route: accounts/new-account
**/
router.post("/new-account", [Authenticator.optionalAuth], asyncWrapper(async (req, res) => {
    var body = req.body
    var userExist = await crudService.exists('Account', {email: body.email})
    if(userExist){
        throw new CustomError(422, 'email not available')
    }
    if(!body.companyId){
        body.companyId = req.account.companyId
    }
    if(!body.departmentId){
        throw new CustomError(422, 'Employee should be associated to a department')
    }
    console.log(body)
    body.password = await passGen.generate({length: 10, numbers: true, uppercase: false});
    Logger.info(body.password)
    let user = await crudService.create('Account', body)
    if(user){
        var company = await crudService.findOne('Company', {id: body.companyId})
        var data = {
            to: user.email,
            logo: company.logo,
            company: company.name,
            name: user.firstname,
            pass: body.password,
            title: user.title,
            invitor: req.assoc.firstname
        }
        Emailer(data, template.account, "Account created")
    }
    user.password ="*****"
    res.json({message: 'User created successfully', result: user});
}));

/** 
 * functionality UPDATE ACCOUNT
 * route: accounts/update-account
**/
router.post("/update-account", [Authenticator.optionalAuth], asyncWrapper(async (req, res) => {
    var body = req.body
    var userExist = await crudService.exists('Account', {id: body.id})
    if(userExist){
        throw new CustomError(404, 'account does not exit')
    }
    let user = await crudService.update('Account', body, {id: body.id})
    res.json({message: 'Account updated successfully', result: user});
}));

/** 
 * functionality ADD EMPLOYEE
 * route: accounts/add-employee
**/
router.post("/add-employee", [ImageUpload.single('image')], asyncWrapper(async (req, res) => {
    let body = req.body
    if(!body.accountId){
        body.accountId = body.id
    }
    if(req.file){
        body.avatar = req.file.url;
    }
    let result = await crudService.create('Employee', body)

    res.json({message: 'Employee added successfully', result});
}));

/** 
 * functionality ADD MANAGEMENT
 * route: accounts/add-management
**/
router.post("/add-management", [ImageUpload.single('image')], asyncWrapper(async (req, res) => {
    let body = req.body
    if(!body.accountId){
        body.accountId = body.id
    }
    if(req.file){
        body.avatar = req.file.url;
    }
    let result = await crudService.create('Management', body)

    res.json({message: 'Management added successfully', result});
}));

/** 
 * functionality UPDATE PROFILE
 * route: accounts/update-profile
**/
router.post("update-profile", asyncWrapper(async(res, req) => {
    var body = req.body
    var Model = req.role.charAt(0).toUpperCase() + req.role.substring(1);
    var profileExist = await crudService.exists(Model, {id: body.id})
    if(profileExist){
        throw new CustomError(404, 'not found')
    }
    await crudService.update(Model, body, {id: body.id})
    res.json({message: Model+' updated successfully', result: user});
}))

/** 
 * functionality NEW REGISTRATION
 * route: accounts/new
**/
router.post("/new", [ ImageUpload.single('image')], asyncWrapper(async (req, res) => {
    var body = req.body
    var userExist = await crudService.exists('Account', {email: body.email})
    if(userExist){
        throw new CustomError(422, 'Email not available')
    }

    if(req.file){
        body.logo = req.file.url;
    }
    let company = await crudService.create('Company', body)
    let user;
    if(company){
        body.companyId = company.id
        body.active = true;
        body.role = 'management'
        user = await crudService.create('Account', body)
    }

    res.json({message: 'Company created successfully', result: company});

}))

/** 
 * functionality ADD PROFILE
 * route: accounts/new-profile
**/
router.post("/add-profile", [Authenticator.auth, ImageUpload.single('avatar')], asyncWrapper(async (req, res) => {
    var body = req.body
    body.accountId = req.account.id
    if(req.file){
        body.avatar = req.file.url;
    }
    console.log(body)
    var account;
    if(body.type == 'employee'){
        account = await crudService.create('Employee', body)   
    }else if(body.type == 'management'){
       account = await crudService.create('Management', body)
    }
    res.json({message: 'Account profile added', result: account});
}))
module.exports = router;


