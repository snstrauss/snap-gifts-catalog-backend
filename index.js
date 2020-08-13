const express = require('express');

const cacheService = require('./services/cache.service');
const { getProductsFromCache, getPromotions, getVendors } = require('./services/product.service');

const PORT = 5000;
const CACHE_TIMEOUT_MINS = 5;
const CACHE_TIMEOUT = CACHE_TIMEOUT_MINS * 60 * 1000;

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/products', (req, res) => {
    const query = req.query.query.length ? req.query.query : cacheService.CONSTS.DEFAULT.CACHE_KEY;

    getProductsFromCache(query, CACHE_TIMEOUT).then(productsData => {
        res.json(productsData);
    });
});

app.get('/promotions', (_, res) => {
    res.json(getPromotions());
});

app.get('/vendors', (_, res) => {
    res.json(getVendors());
});

app.listen(process.env.PORT || PORT, () => {
    console.log('backend now running on port ' + PORT);
});