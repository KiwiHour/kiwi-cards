import type { MongoClient } from "mongodb";
import Db from "./Db";

export default class Card {

    private db: Db

    constructor(private connectedMongoClient: MongoClient, private UId: string) {
        this.db = new Db(connectedMongoClient)
    }

    async get() {
        return await this.db.cardsCollection.findOne({ UId: this.UId })
    }

}