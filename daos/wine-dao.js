import Wine from '../models/wine.js'
import pkg from 'pg'
const {Client} = pkg

const DB_TABLE_NAME = "basic-info"

export default class WineInfoDao
{
    constructor(dbName, addr, usr, pwd, table)
    {
        this.client = new Client({
            host: '127.0.0.1',
            port: 5432,
            database: dbName,
            user: usr,
            password: pwd,
          })

        this.tableName = table ? table : DB_TABLE_NAME
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

        if (!wine.getQuality())
        {
            console.log("Searching for previously saved quality")
            const savedWine = await this.getWineById(wine.getCtId())
            wine.updateQuality(savedWine?.quality)
        }

        const jsonValue = wine.toJson()

        const sqlStmt = 
        `INSERT INTO "${this.tableName}" (id, info)
            VALUES('${id}','${jsonValue}') 
        ON CONFLICT (id) DO 
           UPDATE SET info = '${jsonValue}';`

        await this.client.query(sqlStmt)
    }

    async getWineById(id)
    {
        const sqlStmt = 
        `SELECT info FROM "${this.tableName}" WHERE id=${id}::text`
        const {rows} = await this.client.query({text: sqlStmt, rowMode: "array"})

        return rows.flat()[0]
    }

    async getAllWines()
    {
        const sqlStmt = 
        `SELECT info FROM "${this.tableName}"`

        const {rows} = await this.client.query({text: sqlStmt, rowMode: "array"})

        return rows.flat()
    }
    async saveAllWines(wineList)
    {
        for(const wine of wineList)
            await this.saveWine(wine)
    }
}