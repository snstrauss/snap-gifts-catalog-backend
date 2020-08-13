
const CACHE = {};

const CONSTS = {
    ERRORS: {
        NO_ITEM: 'No Item Found With Specified Key'
    },
    DEFAULT: {
        CACHE_KEY: 'ALL'
    }
}

function set(key, data, time){

    CACHE[key] = data;

    if(time){
        setTimeout(() => {
            remove(key);
        }, time);
    }

    return CACHE[key];
}

function get(key){
    return new Promise((resolve, reject) => {
        if(key in CACHE){
            resolve(CACHE[key]);
        } else {
            reject(CONSTS.ERRORS.NO_ITEM);
        }
    });
}

function remove(key){
    delete CACHE[key];
}


module.exports = {
    set,
    get,
    CONSTS
}