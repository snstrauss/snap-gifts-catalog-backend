const { CONSTS, get, set, clear } = require('../services/cache.service.js');

describe('Cache Service', () => {

    const KEY = 'product-key';
    const VALUE = {
        val: 12
    };
    const TIME = 8 * 1000;

    describe('CONSTS', () => {
        test('returns a consts object', () => {
            const mock = {
                ERRORS: {
                    NO_ITEM: 'No Item Found With Specified Key'
                },
                DEFAULT: {
                    CACHE_KEY: 'ALL'
                }
            };

            expect(CONSTS).toEqual(mock);
        });
    });

    describe('get(rawKey: string, cacheTimeout: number) without setting values before', () => {
        beforeEach(() => {
            clear();
        });

        test('is async - returns a promise', () => {
            const promise = get('name=coffee', 1000);
            expect(promise instanceof Promise).toBeTruthy();
        });

        test('throws error if item not found in cache', (done) => {
            get('not-found')
            .then((result) => {
                console.log('shouldnt be here');
            }).catch((err) => {
                expect(err).toEqual(CONSTS.ERRORS.NO_ITEM);
                done();
            });
        });

        afterAll(() => {
            clear();
        });
    });

    describe('get(rawKey: string, cacheTimeout: number)', () => {

        beforeEach((done) => {
            set(KEY, VALUE, TIME).then(_ => {
                done();
            });
        });

        afterEach(clear);

        test('returns value after being set', (done) => {
            get(KEY, TIME).then(value => {
                expect(value).toEqual(VALUE);
                done();
            });
        });

        test('value stays in cache for specified amount of time', (done) => {
            get(KEY, TIME).then(firstValue => {
                jest.useFakeTimers();
                setTimeout(() => {
                    get(KEY, TIME).then(cachedValue => {
                        expect(cachedValue).toEqual(firstValue);
                        expect(cachedValue).toEqual(VALUE);
                        done();
                    })
                }, 100);
                jest.runAllTimers();
            });
        });

        test('cached value is removed after specified amount of time', (done) => {

            get(KEY, TIME).then(firstValue => {
                expect(firstValue).toEqual(VALUE);
                jest.useFakeTimers();
                setTimeout(() => {
                    get(KEY, TIME)
                    .catch(err => {
                        expect(err).toBe(CONSTS.ERRORS.NO_ITEM);
                        done();
                    });
                }, TIME * 2);

                jest.runAllTimers();
            });

        });
    });

    describe('set(rawKey: string, cacheTimeout: number)', () => {

        beforeEach(clear);

        afterEach(clear);

        test('returns a promise - is async', () => {
            const promise = set(KEY, VALUE, TIME);
            expect(promise instanceof Promise).toBeTruthy();
        });

        test('returns a promise that resolves to the given value', () => {
            set(KEY, VALUE, TIME).then(value => {
                expect(value).toEqual(VALUE);
            });
        });

        test('value stays in cache for specified amount of time', (done) => {
            set(KEY, VALUE, TIME).then(_ => {
                jest.useFakeTimers();
                setTimeout(() => {
                    get(KEY, TIME).then(value => {
                        expect(value).toEqual(VALUE);
                        done();
                    });
                }, TIME / 2)
                jest.runAllTimers();
            });
        });

        test('value is removed after specified time', (done) => {
            set(KEY, VALUE, TIME).then(_ => {
                jest.useFakeTimers();
                setTimeout(() => {
                    get(KEY, VALUE)
                    .catch(err => {
                        expect(err).toBe(CONSTS.ERRORS.NO_ITEM);
                        done();
                    })
                }, TIME * 2);
                jest.runAllTimers();
            });
        });

    });

    describe('clear()', () => {
        beforeEach(clear);

        test('clear the cache completely', (done) => {
            set(KEY, VALUE, TIME).then(_ => {
                clear();

                get(KEY, VALUE, TIME)
                .catch(err => {
                    expect(err).toBe(CONSTS.ERRORS.NO_ITEM);
                    done();
                })
            });
        });
    });

});