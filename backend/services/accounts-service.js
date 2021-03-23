const Account = require('../models').Account
const Management = require('../models').Management
const Employee = require('../models').Employee
const Business = require('../models').Company
const Department = require('../models').Department

const Sequelize            =  require('sequelize');
const Op                   = Sequelize.Op
const moment = require('moment')

module.exports = class AccountService {
    async AllManagement(condition){
        condition.role = 'management'
        
        var data = await Account.findAll({
            where: condition,
            include: [{
                model: Management,
                as: 'management',
                required: false,
            }],
        })
        return data
    }

    async AllManagement(condition){
        condition.role = 'management'
        
        console.log(condition)
        var data = await Account.findAll({
            where: condition,
            include: [{
                model: Management,
                as: 'management',
                required: false,
            }],
        })

        return data
    }

    async AllAssociates(condition){
        condition.role = 'employee'

        var data = await Account.findAll({
            where: condition,
            include: [
                {
                    model: Employee,
                    as: 'profile',
                    required: false,
                    include: [
                    {
                        model: Department,
                        as: 'department',
                        required: false,
                    }
                ]
            }],
        })
        return data
    }
}  
