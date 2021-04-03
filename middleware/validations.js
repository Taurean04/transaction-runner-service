const { body, param, query, validationResult } = require('express-validator');

module.exports = validate = (method) => {
    switch (method) {
        case 'createUser': {
            return [
                body('payload.firstName').isString(),
                body('payload.lastName').isString(),
                body('payload.password').isString()
            ]
        }
        case 'loginUser': {
            return [
                body('payload.email').isEmail(),
                body('payload.password').isString()
            ]
        }
        case 'userId': {
            return[
                param('id').isUUID()
            ]
        }
        case 'createTransaction': {
            return [
                body('payload.amount').isDecimal(),
                body('payload.comment').isString(),
                body('payload.transactionType').matches[/\b(?:credit|debit)\b/]
            ]
        }
        case 'transactionId': {
            return[
                param('id').isUUID()
            ]
        }
        case 'createUserWallet': {
            return [
                body('payload.').matches[/\b(?:NGN)\b/]
            ]
        }
        case 'userWalletId': {
            return[
                param('id').isUUID()
            ]
        }
    }
};