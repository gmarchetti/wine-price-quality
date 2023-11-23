import knex from 'knex'

const DB_TABLE_NAME = "basic-info"

export default class WineInfoDao
{
    constructor(table)
    {   
        let connectionInfo

        if (process.env.DB_CONNECTION_NAME)
        {
            connectionInfo = {
                database: "wine-info",
                user: "guilherme",
                password: "admin",
                host: `/cloudsql/${process.env.DB_CONNECTION_NAME}`
            }
        } else {
            connectionInfo = {
                host: '127.0.0.1',
                port: 5432,
                database: "wine-info",
                user: "guilherme",
                password: "admin",
            } 
        }

        this.client = knex({
            client: "pg",
            connection: connectionInfo
        })
            
        this.tableName = table || DB_TABLE_NAME
    }

    async openConnection()
    {

    }

    async closeConnection()
    {

    }

    async getTime()
    {
        const result = await this.client.raw('SELECT NOW()')
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

        await this.client.raw(sqlStmt)
            .catch( (error) => {
                console.log("SQL stmt resuted in error")
                console.log(sqlStmt)
                console.error(error)
            })
    }

    async getWineById(id)
    {
        const row = await this.client.pluck("info")
            .from(this.tableName)
            .where("id", id)

        return row.flat()[0]
    }

    async getAllWines()
    {
        const rows = await this.client.table(this.tableName).pluck("info")

        return rows
    }
    async saveAllWines(wineList)
    {
        for(const wine of wineList)
            await this.saveWine(wine)
    }
}