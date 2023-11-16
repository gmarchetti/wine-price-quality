import assert, { doesNotMatch } from 'assert';
import WineInfoDao from '../../daos/wine-dao.js';

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
});