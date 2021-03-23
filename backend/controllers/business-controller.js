const router = require("express").Router();
const asyncWrapper = require("../helpers/async-wrapper").AsyncWrapper;
const DatabaseFunc = require('../services/db-functions')
const AccountService = require('../services/accounts-service')
const BusinessService = require('../services/business-service')

const accountService = new AccountService;
const businessService = new BusinessService;
const crudService = new DatabaseFunc;

const Authenticator = require('../middlewares/auth-middleware')



router.get('/single', [Authenticator.auth], asyncWrapper(async(req, res) => {
    console.log(req.body.id)
    let data = await crudService.findOne('Company', {id: req.account.companyId})
    data.password = "*****"
    res.json({message: 'All users', result: data});
}))

router.get('/list-management', [Authenticator.auth], asyncWrapper(async(req, res) => {
    
    let data = await accountService.AllManagement({companyId: req.account.companyId})
    data.password = "*****"
    res.json({message: 'All Managment', result: data});
}))


router.get('/list-associates', [Authenticator.auth], asyncWrapper(async(req, res) => {
    
    let data = await accountService.AllAssociates({companyId: req.account.companyId})
    data.password = "*****"
    res.json({message: 'All Managment', result: data});
}))
module.exports = router;

router.post('/new-department', [Authenticator.auth], asyncWrapper(async(req, res) => {
    var body = req.body
    if(!body.companyId){
        body.companyId = req.account.companyId
    }
    let data = await crudService.create('Department', body)
    res.json({message: 'Create Department', result: data});
}))
module.exports = router;

router.get('/list-department', [Authenticator.auth], asyncWrapper(async(req, res) => {
    let data = await businessService.AllDepartments({companyId: req.account.companyId})
    res.json({message: 'Create Department', result: data});
}))

router.get('/list-survey', [Authenticator.auth], asyncWrapper(async(req, res) => {
    let data = await businessService.AllSurveys({companyId: req.account.companyId})
    res.json({message: 'Create Department', result: data});
}))

router.post('/list-survey-questions', [Authenticator.auth], asyncWrapper(async(req, res) => {
    var body = req.body
    let data = await businessService.SurveyQuestions({surveyId: body.id})
    res.json({message: 'Create Department', result: data});
}))

router.post('/add-survey', [Authenticator.auth], asyncWrapper(async(req, res) => {
    var body = req.body
    body.companyId = req.account.companyId

    let data = await businessService.AddSurvey(body)

    res.json({message: 'Create Department', result: data});
}))


router.get('/chart-data', [Authenticator.auth], asyncWrapper(async(req, res) => {
    var body = req.body
    body.company = req.account.companyId

    let data = await businessService.NPSstats(body)

    res.json({message: 'Create Department', result: data});
}))
module.exports = router;

