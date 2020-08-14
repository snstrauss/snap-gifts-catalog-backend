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

function setRemovalTimeout(cacheItem, key, time){
    clearTimeout(cacheItem.removeRef);
    cacheItem.removeRef = setTimeout(() => {
        remove(key);
    }, time);
}

function buildCacheItem(key, data, time){
    const cacheItem = { data };

    setRemovalTimeout(cacheItem, key, time);

    return cacheItem;
}

function set(rawKey, data, time){
    const key = normalizeKey(rawKey)

    CACHE[key] = buildCacheItem(key, data, time);

    return Promise.resolve(CACHE[key].data);
}

function get(rawKey, cacheTimeout){
    return new Promise((resolve, reject) => {
        const key = normalizeKey(rawKey);

        if(key in CACHE){
            setRemovalTimeout(CACHE[key], key, cacheTimeout);
            resolve(CACHE[key].data);
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