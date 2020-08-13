const express = require('express');
const DATA = require('./data.json');

const PORT = 5000;
const CACHE_TIMEOUT_MINS = 5;
const CACHE_TIMEOUT = CACHE_TIMEOUT_MINS * 60 * 1000;
const DEFAULT_CACHE_KEY = 'ALL';

const QUERY_CACHE = {};

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


function isMeaningfulQuery(q){
    return q !== DEFAULT_CACHE_KEY;
}

function getProducts(query){
    const queryRgx = new RegExp(query.toLowerCase());

    console.log('GET PRODUCTS: ' + query);

    return isMeaningfulQuery(query)
            ? DATA.products.filter(prod => queryRgx.test(prod.name.toLowerCase()))
            : DATA.products;
}

function clearCache(name){

    console.log('DELETE CACHE: ' + name);

    delete QUERY_CACHE[name];
}

app.get('/products', (req, res) => {

    const query = req.query.query.length ? req.query.query : DEFAULT_CACHE_KEY;

    if(!QUERY_CACHE[query]){
        // using Promise.resolve to simulate data coming from DB,
        // and to use it for caching
        QUERY_CACHE[query] = Promise.resolve(getProducts(query));
    }

    if(isMeaningfulQuery(query)){
        setTimeout(() => {
            clearCache(query);
        }, CACHE_TIMEOUT);
    }

    QUERY_CACHE[query].then(cachedResponse => {
        res.json(cachedResponse);
    });
});

app.get('/promotions', (req, res) => {
    res.json(Array.isArray(DATA.promotion) ? DATA.promotion : [DATA.promotion]);
});

app.get('/vendors', (req, res) => {
    res.json(DATA.vendors);
});

app.listen(process.env.PORT || PORT, () => {
    console.log('backend now running on port ' + PORT);
});