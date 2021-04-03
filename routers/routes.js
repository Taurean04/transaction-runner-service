const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const { validations } = require("../middleware");
const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const AuthController = require("../controllers/AuthController");
const UserController = require('../controllers/UserController');
const TransactionController = require('../controllers/TransactionController');
const TestController = require('../controllers/TestController');

const validate = validations => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(422).json({ errors: errors.array() });
    };
};

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
    next();
    });
};

// Auth Routes
// login User
router.route('/user/login', verifySignUp).post(validate(validations('loginUser')), AuthController.login);

// Logut User
router.get('/user/logout', AuthController.logout);

// User Routes

// Create a new User
router.route('/user/create', verifySignUp).post(validate(validations('createUser')), verifySignUp.checkDuplicateUsernameOrEmail, UserController.createUser);

// Retrieve a single user with id
router.get('/user/find/:id', [authJwt.verifyToken], UserController.getUserById);

// Update a User with id
router.route('/user/update/:id').put([authJwt.verifyToken], validate(validations('userId')), UserController.updateUser);

// Delete a User with id
router.route('/user/delete/:id').delete([authJwt.verifyToken], validate(validations('userId')), UserController.deleteUser);


// Transaction Routes

// Create a new transaction
router.route('/transaction/create', [authJwt.verifyToken]).post(TransactionController.createTransaction);

// Retrieve a single user with id
router.get('/transaction/find/:id', [authJwt.verifyToken], TransactionController.getTransactionById);

// Retrieve all Transactions
router.get('/user/transactions/:userId', [authJwt.verifyToken] ,TransactionController.getAllUserTransactions);


// Test Routes

// Create access
router.route('/test/all',[verifySignUp]).post(TestController.allAccess);

// Check access
router.get('/test/user', [authJwt.verifyToken], TestController.userBoard);  

module.exports = router;