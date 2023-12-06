import knex from 'knex'
import {SecretManagerServiceClient} from "@google-cloud/secret-manager"
import { KnownDevices } from 'puppeteer'

const DB_TABLE_NAME = "basic-info"

export const WINE_QUALITY = "quality"
export const WINE_PRICE = "price"
export const ORDER_DESC = "DESC"
export const ORDER_ASC = "ASC"

export default class WineInfoDao
{
    constructor(table)
    {   
        this.connectionInfo = { database : "wine-info"}

        if (process.env.DB_CONNECTION_NAME)
        {
            this.connectionInfo.host =  `/cloudsql/${process.env.DB_CONNECTION_NAME}`
        } else {
            this.connectionInfo.host = '127.0.0.1'
            this.connectionInfo.port = 5432
        } 
          
        this.tableName = table || DB_TABLE_NAME
    }

    async openConnection()
    {
        if(!this.client)
        {
            let clientName = process.env.DB_CLIENT_ID || "guilherme"
            const secretClient = new SecretManagerServiceClient()
    
            const response = await secretClient.accessSecretVersion({name: `projects/625674505070/secrets/db-user-${clientName}/versions/1`,})
                .catch(error => {
                    console.error(error)
                })

            const clientPass = response[0]?.payload?.data?.toString("utf8")
            
            this.connectionInfo.user = clientName
            this.connectionInfo.password = clientPass
            
            this.client = knex({
                client: "pg",
                connection: this.connectionInfo,
                pool: {min: 0}
            })
        } else{
            this.client = await knex.initialize()
        }
    }

    async closeConnection()
    {
        await this.client.destroy()
    }

    async getTime()
    {
        const result = await this.client.raw('SELECT NOW()')
        return result.rows[0].now
    }

    async saveWine(wine)
    {
        const id = wine.getCtId()
        const wineQuality = wine.getQuality()
        if (!wineQuality || wineQuality == 0)
        {
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

    async getAllWines( info, type )
    {   
        const orderBy = info || WINE_QUALITY
        const orderType = type || ORDER_DESC

        const orderedRows = await this.client.table(this.tableName)
            .pluck("info")
            .orderByRaw(`(info ->> '${orderBy}')::FLOAT ${orderType} NULLS LAST`)

        return orderedRows
    }
    async saveAllWines(wineList)
    {
        for(const wine of wineList)
            await this.saveWine(wine)
    }
}