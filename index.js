const express = require('express');
const PORT = 5000;

const DATA = require('./data.json');

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/products', (req, res) => {

    console.log('GET PRODUCTS.');
    console.log('query:');
    console.log(req.query.query);


    debugger;

    res.json(DATA.products);

});

app.get('/promotions', (req, res) => {


    debugger;

    res.json(Array.isArray(DATA.promotion) ? DATA.promotion : [DATA.promotion]);
});

app.get('/vendors', (req, res) => {

    debugger;

    res.json(DATA.vendors);
});

app.listen(process.env.PORT || PORT, () => {
    console.log('backend now running on port ' + PORT);
});