const router = require("express").Router();
const passGen = require('generate-password');
const asyncWrapper = require("../helpers/async-wrapper").AsyncWrapper;
const DatabaseFunc = require('../services/db-functions')
const crudService = new DatabaseFunc;

const Authenticator = require('../middlewares/auth-middleware')
const Validator = require('../middlewares/input-validator')
const ImageUpload = require('../middlewares/file-handler').image
const CustomError = require('../middlewares/custom-error')


router.post('/auth', [],asyncWrapper(async(req, res) => {
    let user = await crudService.findOne('User', {email: req.body.email, active: true})
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

    let serialized = user.toWeb()
    var id = serialized.id
    
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
    res.json({message: 'User login successfull', result: data, token: token});
}))

router.post("/new", [ImageUpload.single('avatar')], asyncWrapper(async (req, res) => {
    var body = req.body
    body.role = "admin"
    var userExist = await crudService.exists('User', {email: body.email})
    if(userExist){
        throw new CustomError(422, 'email not available')
    }

    body.password = passGen.generate({length: 10, numbers: true, uppercase: false});
    console.log(body.password)
    if(req.file){
        body.avatar = req.file.url;
    }
    let user = await crudService.create('User', body)
    let serialized = user.toWeb()
    delete serialized.password
    delete serialized.id

    res.json({message: 'User created successfully', result: serialized});
}));

router.put("/update", [ImageUpload.single('avatar'), Validator('user', 'update')], asyncWrapper(async (req, res) => {
    var body = req.body

    if(req.file){
        body.avatar = req.file.url;
    }
    let success = await crudService.update('User', body, {id: body.id})
    res.json({message: 'User created successfully', result: success});
}));

router.post('/remove', [Authenticator.auth], asyncWrapper(async(req, res) => {
    let data = await crudService.delete('User', {id: req.body.id})
    res.json({message: 'All users', result: data});
}))

router.post('/single', [Authenticator.auth], asyncWrapper(async(req, res) => {
    console.log(req.body.id)
    let data = await crudService.findOne('User', {id: req.body.id})
    data.password = "*****"
    res.json({message: 'All users', result: data});
}))

router.get('/list-admin', [Authenticator.auth], asyncWrapper(async(req, res) => {
    let data = await crudService.findAll('User', {role: 'admin'})
    data.map(item => item.password = "*****")
    res.json({message: 'All users', result: data});
}))
module.exports = router;


