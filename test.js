"use strict";
/* tslint:disable:no-unused-expression */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const chai = require("chai");
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { should, expect, request } = chai;
describe('rargb API tests', function () {
    it('connection', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const result = request('https://torrentapi.org').get('/pubapi_v2.php?get_token=get_token&app_id=node-rargb-api-ts');
        });
    });
    it('list', function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.timeout(15000);
            const result = yield _1.rargb.list();
            expect(result).to.exist;
            expect(result.torrent_results).to.exist;
            expect(result.torrent_results[0]).to.exist;
            expect(result.torrent_results[0].filename).to.exist;
            expect(result.torrent_results[0].download).to.exist;
            expect(result.torrent_results[0].category).to.exist;
        });
    });
    it('search', function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.timeout(15000);
            const result = yield _1.rargb.search('silicon valley');
            expect(result).to.exist;
            expect(result.torrent_results).to.exist;
            expect(result.torrent_results[0]).to.exist;
            expect(result.torrent_results[0].filename).to.exist;
            expect(result.torrent_results[0].download).to.exist;
            expect(result.torrent_results[0].category).to.exist;
            const extended = result.torrent_results;
            expect(extended.category).not.to.exist;
            expect(extended.seeders).not.to.exist;
        });
    });
    it('search extended', function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.timeout(15000);
            const result = yield _1.rargb.search('silicon valley', { format: _1.rargb.enums.FORMAT.EXTENDED });
            expect(result).to.exist;
            expect(result.torrent_results).to.exist;
            expect(result.torrent_results[0]).to.exist;
            expect(result.torrent_results[0].download).to.exist;
            expect(result.torrent_results[0].filename).not.to.exist;
            const extended = result.torrent_results[0];
            expect(extended.category).to.exist;
            expect(extended.seeders).to.exist;
        });
    });
});
