"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
_1.rargb.list().then(result => {
    console.log('👍 API::list');
}).catch(console.error);
_1.rargb.search('silicon valley').then(result => {
    console.log('👍 API::search');
}).catch(console.error);
