/* tslint:disable:no-unused-expression */

import { rargb, Itorrent, ItorrentExtended } from '.'

import * as chai from 'chai'
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const { should, expect, request } = chai

describe('rargb API tests', function () {

  it('connection', async function () {
    const result = request('https://torrentapi.org').get('/pubapi_v2.php?get_token=get_token&app_id=node-rargb-api-ts')
  })

  it('list', async function () {
    this.timeout(15000)
    const result = await rargb.list()
    expect(result).to.exist
    expect(result[0]).to.exist
    expect(result[0].filename).to.exist
    expect(result[0].download).to.exist
    expect(result[0].category).to.exist
  })

  it('search', async function () {
    this.timeout(15000)
    const result: any = await rargb.search('silicon valley')
    expect(result).to.exist
    expect(result[0]).to.exist
    expect(result[0].filename).to.exist
    expect(result[0].download).to.exist
    expect(result[0].category).to.exist

    expect(result[0].seeders).not.to.exist
  })

  it('search extended', async function () {
    this.timeout(15000)
    const result: any = await rargb.search('silicon valley', { format: rargb.enums.FORMAT.EXTENDED })
    expect(result).to.exist
    expect(result[0]).to.exist
    expect(result[0].download).to.exist
    expect(result[0].filename).not.to.exist
    expect(result[0].category).to.exist

    expect(result[0].seeders).to.exist
  })
})
