const express = require('express');
const router = express.Router();
const cardService = require('./cards.service');

// routes
router.post('/register', registerCard);
router.post('/balance', authenticate);
router.post('/withdraw', withdraw)
router.post('/deposit', deposit)

module.exports = router;


function registerCard(req, res, next) {
    cardService.registerCard(req.body)
        .then(() => res.json({message: "Card Details saved successfully."}))
        .catch(err => next(err));
}

function authenticate(req, res, next) {
    cardService.authenticate(req.body)
        .then(card => card ? res.json(card) : res.status(400).json({ message: 'Card No or PIN is incorrect' }))
        .catch(err => next(err));
}

function deposit(req, res, next) {
    cardService.deposit(req.body)
        .then((obj) => res.json(obj))
        .catch(err => next(err));
}

function withdraw(req, res, next) {
    cardService.withdraw(req.body)
        .then((obj) => res.json(obj))
        .catch(err => next(err));
}
