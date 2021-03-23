const router = require("express").Router();
const passGen = require('generate-password');
const asyncWrapper = require("../helpers/async-wrapper").AsyncWrapper;

const AccountService = require('../services/accounts-service')
const DatabaseFunc = require('../services/db-functions')
const crudService = new DatabaseFunc;
const accountService =  new AccountService;

const Authenticator = require('../middlewares/auth-middleware')
const Validator = require('../middlewares/input-validator')
const ImageUpload = require('../middlewares/file-handler').image
const DocumentUpload = require("../middlewares/file-handler").doc
const FileHandler = require('../middlewares/file-handler')
const CustomError = require('../middlewares/custom-error')


router.post("/download", [Authenticator.auth], asyncWrapper(async (req, res) => {
    var body = req.body
    let program = await crudService.findOne('Program', {id: body.id})
    let file = await FileHandler.downloadDoc(program.course)
    
    res.json({message: 'User created successfully', result: program});
}));

router.get("/list-programs", [Authenticator.auth], asyncWrapper(async (req, res) => {
    var body = req.body
    body.addedBy = req.account.id
    let program = await crudService.findAll('Program')
    
    res.json({message: 'User created successfully', result: program});
}));

module.exports = router;


