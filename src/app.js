const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public/')));
app.use(express.urlencoded({extended: true}));

const accountData = fs.readFileSync(path.join(__dirname, 'json', 'accounts.json'), 'utf8');
const accounts  = JSON.parse(accountData);

const userData = fs.readFileSync(path.join(__dirname, 'json', 'users.json'), 'utf8');
const users = JSON.parse(userData)

app.get('/', (req, res) => {
  res.render('index', { title: 'Account Summary', accounts: accounts });
});

app.get('/savings', (req, res) => {
  res.render('account', { account: accounts.savings });
});

app.get('/checking', (req, res) => {
  res.render('account', { account: accounts.checking });
});

app.get('/credit', (req, res) => {
  res.render('account', { account: accounts.credit });
});

app.get('/profile', (req, res) => {
  res.render('profile', { user: users[0] });
});

app.get('/transfer', (req, res) => {
  res.render('transfer');
});

app.post('/transfer', (req, res) =>{
  const amt = parseInt(req.body.amount);
	accounts[req.body.from].balance = accounts[req.body.from].balance - amt;
  accounts[req.body.to].balance = accounts[req.body.to].balance + amt;
  const accountsJSON = JSON.stringify(accounts, null, 2);
  fs.writeFileSync(path.join(__dirname, 'json', 'accounts.json'), accountsJSON, 'utf8');
  res.render('transfer', { message: 'Transfer Completed' });
});

app.get('/payment', (req, res) => {
  res.render('payment', { account: accounts.credit });
});

app.post('/payment', (req, res) =>{
  const amt = parseInt(req.body.amount);
  accounts.credit.balance = accounts.credit.balance - amt;
  accounts.credit.available = accounts.credit.available + amt;
  const accountsJSON = JSON.stringify(accounts, null, 2);
  fs.writeFileSync(path.join(__dirname, 'json', 'accounts.json'), accountsJSON, 'utf8');
  res.render('payment', { account: accounts.credit, message: 'Payment Completed' });
});

app.listen(port, () => {
  console.log('PS Project Running on port 3000!')
});