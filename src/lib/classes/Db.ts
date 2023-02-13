import type { DatabaseCard, DatabaseGlobalData, DatabaseDirectory } from "$lib/schema";
import { ObjectId, type Collection, type MongoClient } from "mongodb";

export default class Db {

	private cardsCollection: Collection<DatabaseCard>
	private globalCollection: Collection<DatabaseGlobalData>

	constructor(private connectedMongoClient: MongoClient) {
		this.cardsCollection = connectedMongoClient.db("kiwihour").collection("cards")
		this.globalCollection = connectedMongoClient.db("kiwihour").collection("global")
	}

	// database setters

	async updateDirectoryTree(directoryTree: DatabaseDirectory.Node<"root">) {
		await this.globalCollection.updateOne(
			{}, // first one (only collection)
			{ $set: { "directoryTree.children": directoryTree}}
		)
	}

	// database getters

	async getGlobalData() {
		let globalData = await this.globalCollection.findOne({})
		if (!globalData) {
			// restore db with blank data
			globalData = {
				_id: new ObjectId(),
				inUseUIds: [],
				directoryTree: {
					UId: "root",
					name: "root",
					type: "root",
					children: []
				} }
			await this.globalCollection.insertOne(globalData)
		}

		return globalData
	}

}