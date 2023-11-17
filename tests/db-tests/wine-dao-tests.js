import assert, { doesNotMatch } from 'assert';
import WineInfoDao from '../../daos/wine-dao.js';
import Wine from '../../models/wine.js'
import { it } from 'mocha';

describe('WineDao', function () {

  describe('Connection tests', function() {
    const wineDao = new WineInfoDao("wine-info", "127.0.0.1", "guilherme", "admin")

    beforeEach(async function(){
        await wineDao.openConnection()
    });

    it('Can connect to Db', async function() {
        const time = await wineDao.getTime()
        console.log(time)
        assert.notEqual(time, null)
    });

    afterEach(async function(){
        wineDao.closeConnection()
    });
  });

  describe('CRUD tests', function() {
    let wineDao = new WineInfoDao("wine-info", "127.0.0.1", "guilherme", "admin", "test")
    const wine = new Wine("42", "test-wine", "0.99", "5.0")

    beforeEach(async function(){
        wineDao = new WineInfoDao("wine-info", "127.0.0.1", "guilherme", "admin", "test")
        await wineDao.openConnection()
    });

    it('Should save wine object on DB', async function() {
        await wineDao.saveWine(wine)
    });

    it('Should retrieve 2 wines', async function() {
        await wineDao.saveWine(wine)
        await wineDao.saveWine(new Wine("43", "test-wine-2", "1.99", "1.0"))

        const result = await wineDao.getAllWines()

        assert.equal(result.length, 2)
    })

    afterEach(async function(){
        await wineDao.closeConnection()
    });
  });

});