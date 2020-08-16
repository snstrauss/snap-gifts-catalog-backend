const { getQueriedItems, isMeaningfulQuery } = require('../services/data.service');
const DATA = require('../data/data.json');

describe('Data Service', () => {
    describe('isMeaningfulQuery(q: string)', () => {
        test(`returns 'true' on non-empty strings`, () => {
            const isMeaningful = isMeaningfulQuery('string');
            expect(isMeaningful).toEqual(true);
        });

        test(`returns 'false' on empty strings`, () => {
            const isMeaningful = isMeaningfulQuery('');
            expect(isMeaningful).toEqual(false);
        });

        test(`returns 'false' on empty argument`, () => {
            const thing = isMeaningfulQuery();
            expect(thing).toEqual(false);
        });
    });

    describe('getQueriedItems(field: string, filterCB?: function)', () => {
        test(`returns 'vendors' when requested`, () => {

            const { vendors: localVendors } = DATA;
            const serviceVendors = getQueriedItems('vendors');

            expect(serviceVendors).toEqual(localVendors);
        });

        test(`returns 'promotions' when requested`, () => {

            const { promotions: localPromos } = DATA;
            const servicePromos = getQueriedItems('promotions');

            expect(servicePromos).toEqual(localPromos);
        });

        test(`returns all products when not passing filter callback`, () => {

            const { products: localProducts } = DATA;
            const serviceProducts = getQueriedItems('products');

            expect(serviceProducts).toEqual(localProducts);
        });

        test(`filters the received products according to provided callback`, () => {

            function providedFilter(item){
                return /coffee/.test(item.name.toLowerCase());
            }

            const { products: localProducts } = DATA;
            const serviceProducts = getQueriedItems('products', providedFilter)

            const filteredLocal = localProducts.filter(providedFilter);

            expect(serviceProducts).toEqual(filteredLocal);
        });
    });
});