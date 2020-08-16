const DATA = require('../data/data.json');
const { getProductsFromCache, getPromotions, getVendors } = require('../services/product.service');

describe('Product Service', () => {

    describe('getVendors()', () => {
        test('returns the full list of vendors', () => {

            const { vendors: local } = DATA;
            const service = getVendors();

            expect(service).toEqual(local);
        });
    });

    describe('getPromotions()', () => {
        test('returns the full list of promotions, always as an array', () => {

            const { promotion: local } = DATA;
            const service = getPromotions();

            expect(Array.isArray(service)).toBe(true);
            expect(service).toEqual([local]);
        });
    });

    describe('getProductsFromCache(query: string, cacheTimeout: number)', () => {

        test('is an async function - returns a promise', () => {
            const promise = getProductsFromCache('');
            expect(promise instanceof Promise).toBeTruthy();
        });

        test('returns full list of products when query is empty', (done) => {
            const { products: local } = DATA;
            getProductsFromCache('').then(fromService => {
                expect(fromService).toEqual(local);
                done();
            }).catch(done);
        });

        test('returns filtered products when provided with query string', (done) => {

            function coffeeFilter(product){
                return product.name && /coffee/.test(product.name.toLowerCase())
            };

            const { products: local } = DATA;
            const filtered = local.filter(coffeeFilter);

            getProductsFromCache('name=coffee').then((products) => {
                expect(products).toEqual(filtered);
                done();
            });
        });
    });

});