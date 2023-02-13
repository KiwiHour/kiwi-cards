import type { Database } from "$lib/schema";
import type { Collection, MongoClient } from "mongodb";

export default class Db {

	public cardsCollection: Collection<Database.Card>
	public directoryNodesCollection: Collection<Database.DirectoryNode>

	constructor(connectedMongoClient: MongoClient) {
		this.cardsCollection = connectedMongoClient.db("kiwihour").collection("cards")
		this.directoryNodesCollection = connectedMongoClient.db("kiwihour").collection("directory-nodes")
	}

}