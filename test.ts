/* tslint:disable:no-unused-expression */

import { rarbg, Itorrent, ItorrentExtended } from '.'

import * as chai from 'chai'
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { should, expect, request } = chai

describe('rarbg API tests', function () {

  it('connection', async function () {
    const result = request('https://torrentapi.org').get('/pubapi_v2.php?get_token=get_token&app_id=node-rarbg-api-ts')
  })

  it('list', async function () {
    this.timeout(15000)
    const result = await rarbg.list()
    expect(result).to.exist
    expect(result[0]).to.exist
    expect(result[0].filename).to.exist
    expect(result[0].download).to.exist
    expect(result[0].category).to.exist
  })

  it('search', async function () {
    this.timeout(15000)
    const result: any = await rarbg.search('silicon valley')
    expect(result).to.exist
    expect(result[0]).to.exist
    expect(result[0].filename).to.exist
    expect(result[0].download).to.exist
    expect(result[0].category).to.exist

    expect(result[0].seeders).not.to.exist
  })

  it('search extended', async function () {
    this.timeout(15000)
    const result: any = await rarbg.search('silicon valley', { format: rarbg.enums.FORMAT.EXTENDED })
    expect(result).to.exist
    expect(result[0]).to.exist
    expect(result[0].download).to.exist
    expect(result[0].filename).not.to.exist
    expect(result[0].category).to.exist

    expect(result[0].seeders).to.exist
  })
})

rarbg.default.category = rarbg.enums.CATEGORY.TV
