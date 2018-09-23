"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
_1.rargb.list('20').then(result => {
    if (result.torrent_results[0].download) {
        console.log('👍 API::list');
    }
    else {
        console.log('👎 API::list');
    }
});
_1.rargb.search('silicon valley').then(result => {
    if (result.torrent_results[0].download) {
        console.log('👍 API::search');
    }
    else {
        console.log('👎 API::search');
    }
});
