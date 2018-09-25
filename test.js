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
describe('rarbg API tests', function () {
    it('connection', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const result = request('https://torrentapi.org').get('/pubapi_v2.php?get_token=get_token&app_id=node-rarbg-api-ts');
        });
    });
    it('list', function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.timeout(15000);
            const result = yield _1.rarbg.list();
            expect(result).to.exist;
            expect(result[0]).to.exist;
            expect(result[0].filename).to.exist;
            expect(result[0].download).to.exist;
            expect(result[0].category).to.exist;
        });
    });
    it('search', function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.timeout(15000);
            const result = yield _1.rarbg.search('silicon valley');
            expect(result).to.exist;
            expect(result[0]).to.exist;
            expect(result[0].filename).to.exist;
            expect(result[0].download).to.exist;
            expect(result[0].category).to.exist;
            expect(result[0].seeders).not.to.exist;
        });
    });
    it('search extended', function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.timeout(15000);
            const result = yield _1.rarbg.search('silicon valley', { format: _1.rarbg.enums.FORMAT.EXTENDED });
            expect(result).to.exist;
            expect(result[0]).to.exist;
            expect(result[0].download).to.exist;
            expect(result[0].filename).not.to.exist;
            expect(result[0].category).to.exist;
            expect(result[0].seeders).to.exist;
        });
    });
});
_1.rarbg.default.category = _1.rarbg.enums.CATEGORY.TV;
