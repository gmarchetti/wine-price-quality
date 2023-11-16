import Wine from '../models/wine.js'
import pkg from 'pg'
const {Client} = pkg

export default class WineInfoDao
{
    constructor(dbName, addr, usr, pwd)
    {
        this.client = new Client({
            host: '127.0.0.1',
            port: 5432,
            database: dbName,
            user: usr,
            password: pwd,
          })
    }

    async openConnection()
    {
        return await this.client.connect()
    }

    async closeConnection()
    {
        return await this.client.end()
    }

    async getTime()
    {
        const result = await this.client.query('SELECT NOW()')
        return result.rows[0].now
    }

    async saveWine(wine)
    {
        const id = wine.getCtId()
        const jsonValue = wine.toJson()

        console.log(id + ":" + jsonValue)

        const sqlStmt = 
        `INSERT INTO "test" (id, info)
            VALUES('${id}','${jsonValue}') 
        ON CONFLICT (id) DO 
           UPDATE SET info = '${jsonValue}';`

        console.log(sqlStmt)

        await this.client.query(sqlStmt)
    }
}