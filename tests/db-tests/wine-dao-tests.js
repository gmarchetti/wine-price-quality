import assert, { doesNotMatch } from 'assert';
import WineInfoDao, { ORDER_ASC, ORDER_DESC, WINE_PRICE, WINE_QUALITY } from '../../daos/wine-dao.js';
import Wine from '../../models/wine.js'
import { expect } from 'chai';

describe('WineDao', function () {

  describe('Connection tests', function() {
    const wineDao = new WineInfoDao()

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
    let wineDao
    const wine = new Wine("42", "test-wine", "0.99", "5.0")

    beforeEach(async function(){
        wineDao = new WineInfoDao("test")
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

    it('Should retrieve 2 wines, higher quality at first row', async function() {
        await wineDao.saveWine(wine)
        await wineDao.saveWine(new Wine("43", "test-wine-2", "1.99", "1.0"))

        const result = await wineDao.getAllWines(WINE_QUALITY, ORDER_DESC)
        assert.equal(result.length, 2)
        expect(parseFloat(result[0].quality)).to.be.greaterThan(parseFloat(result[1].quality))
    })

    it('Should retrieve 2 wines, lower quality at first row', async function() {
        await wineDao.saveWine(wine)
        await wineDao.saveWine(new Wine("43", "test-wine-2", "1.99", "1.0"))

        const result = await wineDao.getAllWines(WINE_QUALITY, ORDER_ASC)
        assert.equal(result.length, 2)
        expect(parseFloat(result[0].quality)).to.be.lessThan(parseFloat(result[1].quality))
    })

    it('Should retrieve 2 wines, higher price at first row', async function() {
        await wineDao.saveWine(wine)
        await wineDao.saveWine(new Wine("43", "test-wine-2", "1.99", "1.0"))

        const result = await wineDao.getAllWines(WINE_PRICE, ORDER_DESC)
        assert.equal(result.length, 2)
        expect(parseFloat(result[0].price)).to.be.greaterThan(parseFloat(result[1].price))
    })

    it('Should retrieve 2 wines, lower price at first row', async function() {
        await wineDao.saveWine(wine)
        await wineDao.saveWine(new Wine("43", "test-wine-2", "1.99", "1.0"))

        const result = await wineDao.getAllWines(WINE_PRICE, ORDER_ASC)
        assert.equal(result.length, 2)
        expect(parseFloat(result[0].price)).to.be.lessThan(parseFloat(result[1].price))
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

    describe('Error handling tests', function() {
        let wineDao
        const wine = new Wine("42", "test-wine", "0.99", "5.0")
        const wine2 = new Wine("43", "test-wine-2", "1.99", "1.0")

        beforeEach(async function(){
            wineDao = new WineInfoDao("wrong-table")
            await wineDao.openConnection()
        })

        it("Should not throw an error when saving single item in wrong table", async function(){
            expect(async () => (await wineDao.saveWine(wine))).to.not.throw(Error)
        });

        it("Should not throw an error when saving multiple items in wrong table", async function(){
            expect(async () => (await wineDao.saveAllWines([wine, wine2]))).to.not.throw(Error)
        });

        afterEach(async function(){
            await wineDao.closeConnection()
        });
    })
});