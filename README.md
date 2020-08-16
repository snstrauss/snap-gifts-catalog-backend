# snap-gifts-catalog-backend
A simple backend for the snap-gifts-catalog example.

---
## Installation

clone this repo, and then -
```
$ npm install
$ npm run dev
```
Server will run on ```localhost:5000```.

---
## Run Tests
```npm run test```

---
## Usage - endpoints
### GET /products
returns a list of all the products, filtered by the following parameters:
- ```name``` - filter to leave only products that has given string in their name.
- ```vendor``` - filter to leave only products provided by given vendor.
### GET /vendors
returns an array of all vendor names.
### GET /promotions
returns an array of all available promotions.

---
# Structure
```
index.js
|-> product.service.js
    |-> data.service.js
    |-> cache.service.js
```
The app is made of 3 simple endpoints, that return the requested data to the client.
These 3 endpoints all use methods defined on product.service.js, which in turn calls methods defined on data.service.js and cache.service.js

### Product Service
In charge of all things related to the idea of 'product'. It implements 2 simple getter functions for the vendors, and the promotions, and another getter for the products.
Since the product requests should be cached, this method will call the data.service only if the requested resource is not cached already.

### Data Service
A very simple service, consisting of just 2 methods - one for validating queries, and one for retreiving data from a specified field.

### Cache Service
Simple cache, implements a 'get', 'set', and 'clear' methods. After a specified amount of time, the value will be removed from the cache.