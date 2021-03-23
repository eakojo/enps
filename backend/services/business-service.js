const Account = require('../models').Account
const Management = require('../models').Management
const Department = require('../models').Department
const Employee = require('../models').Employee
const Business = require('../models').Company
const Survey = require('../models').Survey
const Question = require('../models').Question 
const Answer = require('../models').Answer

const Sequelize =  require('sequelize');
const Op = Sequelize.Op
const moment = require('moment')

module.exports = class AccountService {
    async AllDepartments(condition){
        
        var data = await Department.findAll({
            where: condition,
            include: [{
                model: Employee,
                as: 'employees',
                required: false,
            }],
        })
        return data
    }

    async AllSurveys(condition){
        
        var data = await Survey.findAll({
            where: condition,
            include: [
                {
                    model: Question,
                    as: 'questions',
                    required: false,
                },
                {
                    model: Department,
                    as: 'department',
                    required: false,
                }
            ],
        })
        return data
    }

    async SurveyQuestions(condition){
        var data = await Question.findAll({
            where: condition,
            include: [
                {
                    model: Answer,
                    as: 'answers',
                    required: false,
                },
            ],
        })
        return data
    }

    async AddSurvey(data){
        var survey = await Survey.create(data)
        if(survey && data.primary){
            baseQuestion.forEach(item => {
                item.surveyId = survey.id
                Question.create(item)
            })
        }
        return survey
    }

    async NPSstats(condition){
        var surveys = await Survey.findAll({
            where: {
                [Op.and]: [ { companyId: condition.company}]},
            include: [
                {
                    model: Question,
                    as: 'questions',
                    required: false,
                }
            ],
        })

        var newNPSSurvey = {}
        await Promise.all(surveys.map(item => {
            if(item.questions.map(q => {
                if(q.type == 'primary'){
                    newNPSSurvey = item
                }
            }));
        }))

        var data = {}
        if(!Object.keys(newNPSSurvey).length === 0){
            var answers = await Answer.findAll({
                where: {questionId: newNPSSurvey.questions[0].id}
            })

            if(answers.length > 0){
                var promoters = 0,
                    detractors = 0,
                    passive = 0;
                answers.forEach(answer => {
                    if(answer.choice > 8){
                        promoters = promoters + 1
                    }else if(answer.choice > 6 && answer.choice < 9){
                        passive = passive + 1
                    }else{
                        detractors = detractors + 1
                    }
                })

                data.promoters = promoters
                data.passive = passive
                data.detractors = detractors
                data.participants = answers.length
            }
        }

        return data
    }
}  

var baseQuestion = [
    {
        question: "On a scale of 0 to 10 how likely are you to recommend this company as a place to work?",
        type: 'primary',
        hearer: 'all'
    },
    {
        question: "What do you think is particularly good about being employed here?",
        type: 'followup',
        hearer: 'promoters'
    },
    {
        question: "What would make you move up to a 9 or 10 score?",
        type: 'followup',
        hearer: 'passives'
    },{
        question: "What do you think we could do better?",
        type: 'followup',
        hearer: 'detractors'
    }
]