const DATA = require('../data/data.json');;

function isMeaningfulQuery(q){
    return !!(q && q.length);
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