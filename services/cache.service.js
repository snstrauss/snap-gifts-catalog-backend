/**
 * cache service uses Promises to mock async behavior
 */
const CACHE = {};

const CONSTS = {
    ERRORS: {
        NO_ITEM: 'No Item Found With Specified Key'
    },
    DEFAULT: {
        CACHE_KEY: 'ALL'
    }
};

function normalizeKey(key){
    return key.split('&').sort().join('&');
}

function set(rawKey, data, time){
    const key = normalizeKey(rawKey)

    CACHE[key] = data;

    if(time){
        setTimeout(() => {
            remove(key);
        }, time);
    }

    return Promise.resolve(CACHE[key]);
}

function get(rawKey){
    return new Promise((resolve, reject) => {
        const key = normalizeKey(rawKey);

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