const DATA = require('../data/data.json');;

const DEFAULT_CACHE_KEY = 'ALL';

function isMeaningfulQuery(q){
    return q !== DEFAULT_CACHE_KEY;
}

function getQueriedItems(field, filterCb){
    return filterCb
            ? DATA[field].filter(filterCb)
            : DATA[field];
}

module.exports = {
    getQueriedItems,
    isMeaningfulQuery
}