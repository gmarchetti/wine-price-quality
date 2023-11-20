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

    it('Should return wine with id 42', async function(){
        let wine42 = await wineDao.getWineById("42")

        console.log(wine42)

        assert.equal(wine42.ctId, "42")
    })

    it('Should not erase quality rating if it exists', async function(){
        let wine42 = new Wine("42", "test-wine", "0.99", "5.0")
        let wine42b = new Wine("42", "test-wine", "0.99")

        await wineDao.saveWine(wine42)
        await wineDao.saveWine(wine42b)
        
        let wineFromDB = await wineDao.getWineById("42")

        console.log(wineFromDB)
        assert.notEqual(wineFromDB.quality, null)    
    })

    it('Price should change after update', async function(){
        let wine42 = new Wine("42", "test-wine", "1.99")
        await wineDao.saveWine(wine42)

        let wineFromDB = await wineDao.getWineById("42")

        console.log(wineFromDB)
        assert.equal(wineFromDB.price, "1.99")    
    })

    afterEach(async function(){
        await wineDao.closeConnection()
    });
  });

});