const queryString = require('querystring');

const cacheService = require('./cache.service');
const { isMeaningfulQuery, getQueriedItems } = require('./data.service');

const EXACT_PRODUCT_PROPS = ['vendor'];

function getProducts(query){

    const queryItems = queryString.parse(query);

    let optionalFilter;
    if(isMeaningfulQuery(query)){
        optionalFilter = function(prod){
            return Object.entries(queryItems).every(([prop, value]) => {
                let rgxString = value.toLowerCase();

                if(EXACT_PRODUCT_PROPS.includes(prop)){
                    rgxString = `^${rgxString}$`;
                }

                const propRgx = new RegExp(rgxString);

                return propRgx.test(prod[prop].toLowerCase());
            });
        }
    }

    return getQueriedItems('products', optionalFilter);
}

function getProductsFromCache(query, cacheTimeout){
    return cacheService.get(query, cacheTimeout).catch((err) => {
        if(err === cacheService.CONSTS.ERRORS.NO_ITEM){
            return cacheService.set(query, getProducts(query), cacheTimeout).then((data) => {
                return data;
            });
        }
    });
}

function getPromotions(){
    const promotions = getQueriedItems('promotion');
    return Array.isArray(promotions) ? promotions : [promotions];
}

function getVendors(){
    return getQueriedItems('vendors');
}

module.exports = {
    getProductsFromCache,
    getPromotions,
    getVendors
}