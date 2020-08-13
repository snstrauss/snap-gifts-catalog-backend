const cacheService = require('./cache.service');
const { isMeaningfulQuery, getQueriedItems } = require('./data.service');

function getProducts(query){

    const queryRgx = new RegExp(query.toLowerCase());

    let optionalFilter;
    if(isMeaningfulQuery(query)){
        optionalFilter = function(prod){
            return queryRgx.test(prod.name.toLowerCase());
        }
    }

    return getQueriedItems('products', optionalFilter);
}

function getProductsFromCache(query, cacheTimeout){
    return cacheService.get(query).catch((err) => {
        if(err === cacheService.CONSTS.ERRORS.NO_ITEM){
            const timeToRemove = isMeaningfulQuery(query) && cacheTimeout;

            cacheService.set(query, Promise.resolve(getProducts(query)), timeToRemove);

            return getProductsFromCache(query);
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