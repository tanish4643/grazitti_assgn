Assumptions & Configurations:

1. Supported Notes are 2000, 500, 200 & 100.
2. User creates a card using cardno, pin and optional parameters (firstname & lastname).
3. Balance can be checked using "/balance", by providing cardno & pin.
4. Cards registered are in the array maintained in the app code and not on some DB, in order to save the
time for DB setup during your Testing.
5. At the start of the server, all the note count will be 0. Hence card registration and deposit API needs to be
used in order to test the Withdrawl functionality.

For Deployment

Prior to Run the App:
Installation of Node and Npm is required.

Project Setup: 

1. Go to root folder of the project from command line and run "npm install"
2. After the command has completed, run "npm start".

wait for the message "running server on port 4000"

-> Information: Note Count is managed in the server only and not in DB, hence the note count & ATM Balance will be 0 when server is started. 
-> Card creation is needed prior, in order to test Withdraw and Deposit API

API Routes:

1. Register Card

Endpoint: '/register'
Method: 'POST'
Params: {
	cardno
	pin,
	firstname,
	lastname
}

2. Check Balance

Endpoint: '/balance'
Method: 'POST'
Params: {
	cardno,
	pin
}

3. Withdraw Money

Endpoint: '/withdraw'
Method: 'POST'
Params: {
	cardno,
	pin,
	amount,
	preferred
}

preferred --> (Optional) => 2000/500/200/100
Any particular currency value

When some preferred currency is passed, the algorithm makes sure those notes are includes in the cash tendered
provided the atm has those notes.

4. Deposit Money

Endpoint: '/deposit'
Method: 'POST'
Params: {
	cardno,
	pin,
	2000,
	500,
	200,
	100
}

2000/500/200/100 --> (Optional) => Any number denoting the notes deposited of that currency value
For Example: User deposits 1500 Rs
			 2 Notes of 500
			 1 Note of 200
			 3 Notes of 100
So the params are: 
{
	cardno,
	pin,
	500: 2,
	200: 1,
	100: 3
}