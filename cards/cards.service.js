const config = require('config.json');
const bcrypt = require('bcryptjs');
const { param } = require('./cards.controller');

var atm = {
    2000: 0,
    500: 0,
    200: 0,
    100: 0
};
var cards = [];
var cardnos = [];
var numericCurrencies = [2000,500,200,100];

module.exports = {
    registerCard,
    authenticate,
    deposit,
    withdraw
};

async function authenticate({ cardno, pin }) {
    const card = await cards.find(o => o.cardno == cardno);
    if (card && bcrypt.compareSync(pin, card.pin)) {
        const { pin, ...cardWithoutHash } = card;
        return {
            ...cardWithoutHash
        };
    }

    throw "Card Details Not Found";
}

async function registerCard(cardParam) {
    if (await cards.find(o => o.cardno == cardParam.cardno )) {
        throw 'Card No: "' + cardParam.cardno + '" is already present';
    }

    if(cardParam.pin.trim().length != 4)
         throw 'PIN length should not be greater than or less than 4';

    const card = {
        id: cards.length,
        cardno: cardParam.cardno,
        firstname: cardParam.firstname,
        lastname: cardParam.lastname,
        balance: 0,
    };
    card.pin = bcrypt.hashSync(cardParam.pin, 10);
    cardnos.push(card.cardno);
    cards.push(card);
    return card;
}

async function deposit(params) {
    const card = await cards.find(o => o.cardno == params.cardno);
    if (!card) throw 'Card not found';
    if(!params.pin || !bcrypt.compareSync(params.pin, card.pin)) throw 'Invalid PIN';

    let notes = Object.keys(params);
    let total = 0, temp;
    let atmLocal = JSON.parse(JSON.stringify(atm));

    for(var i=0; i<notes.length; i++){
        if(params[notes[i]]){
            temp = parseInt(notes[i]);
        
            if(numericCurrencies.includes(temp) && !isNaN(params[notes[i]])){
                total += temp * params[notes[i]];
                atmLocal[temp] += parseInt(params[temp]);
            }
        }
    }

    if(total == 0) throw 'Invalid amount provided to deposit';
    atm = JSON.parse(JSON.stringify(atmLocal));
    card.balance += total;
    return {message: "Amount deposited successfully.", balance: card.balance}
}

function ValidateNotes(amount, atmLocal, preferred, temp){
    if(preferred == 500)
        return true;
}

async function withdraw(params) {
    const card = await cards.find(o => o.cardno == params.cardno);
    
    if (!card) throw 'Card not found';
    if(!params.pin || !bcrypt.compareSync(params.pin, card.pin)) throw 'Invalid PIN';
    if (isNaN(params.amount)) throw 'Invalid Amount Provided';
    if(card.balance < params.amount) throw 'Infufficient Balance in your account';

    let notes, temp, flag = true, amount, atmLocal, n=0;
    
    if(params.preferred && !isNaN(params.preferred)){
        let tempCurr = parseInt(params.preferred);
        numericCurrencies.splice(numericCurrencies.indexOf(tempCurr),1);
        numericCurrencies.unshift(tempCurr);
    }

    while(n<2){
        amount = params.amount;
        atmLocal = JSON.parse(JSON.stringify(atm));
        notes = {};

        for(var i=0; i < numericCurrencies.length; i++){
            temp = Math.floor(amount / numericCurrencies[i]);
            temp = atmLocal[numericCurrencies[i]] < temp
                    ? atmLocal[numericCurrencies[i]] : temp;
            
            notes[numericCurrencies[i]] = temp;
            amount -= (temp * numericCurrencies[i]);
            atmLocal[numericCurrencies[i]] -= temp;
        }
        
        numericCurrencies.sort((a,b) => b-a);
        n++;

        if(amount == 0)
            break;
    }
    
    if(amount != 0) throw 'Cannot Dispense due to inappropriate denominations';
    card.balance -= params.amount;
    atm = JSON.parse(JSON.stringify(atmLocal));
    
    return {
        message: "Amount Withdrawn successfully.",
        notes: notes,
        balance: card.balance
    };
}