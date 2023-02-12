import type { DatabaseCard, DatabaseGlobalData, DatabaseFolder, DatabaseDirectoryTree } from "$lib/schema";
import { ObjectId, type Collection, type MongoClient } from "mongodb";
import { Card, DirectoryNode, Folder } from "./index";

export default class Db {

	private cardsCollection: Collection<DatabaseCard>
	private globalCollection: Collection<DatabaseGlobalData>

	constructor(private connectedMongoClient: MongoClient) {
		this.cardsCollection = connectedMongoClient.db("kiwihour").collection("cards")
		this.globalCollection = connectedMongoClient.db("kiwihour").collection("global")
	}

	// database setters

	async updateDirectoryTree(directoryTree: DatabaseDirectoryTree) {
		await this.globalCollection.updateOne(
			{}, // first one (only collection)
			{ $set: { "directoryTree": directoryTree }}
		)
	}

	async addFolder(folder: Folder, parentUIds: string[]) {
		let { directoryTree: currentParentsChildren } = await this.getGlobalData()

		for (let parentUId of parentUIds) {
			let possibleParent = currentParentsChildren.find(node => node.UId == parentUId && node.type == "folder") as DatabaseFolder | undefined
			if (!possibleParent ) { throw Error("Invalid parent UIDs")}

			currentParentsChildren = possibleParent.children
		}

		// we have now found the closest parent via the database
		// add the new folder to the parent

		let databaseFolder: DatabaseFolder = {
			UId: folder.getUId(),
			name: folder.getName(),
			type: "folder",
			parentUId: parentUIds.slice(-1)[0],
			children: []
		}

		currentParentsChildren.push(databaseFolder)

		await this.updateDirectoryTree(currentParentsChildren)
	}

	// database getters

	async getGlobalData() {
		let globalData = await this.globalCollection.findOne({})
		if (!globalData) {
			// restore db with blank data
			globalData = { _id: new ObjectId(), inUseUIds: [], directoryTree: [] }
			await this.globalCollection.insertOne(globalData)
		}

		return globalData
	}

	/** Get a card via it's UID */
	async getCard(UId: string) {
		let cardData = await this.cardsCollection.findOne({ UId })
		if (!cardData) { return null }

		return new Card(cardData)
	}
	
	/** Get all the cards within a deck of a specific UID */
	async getCardsInDeck(deckUId: string) {
		let allCardData = await this.cardsCollection.find({}).toArray()
		let foundCards: Card[] = []

		for (let cardData of allCardData) {
			if (cardData.deckUId == deckUId) {
				let card = new Card(cardData)
				foundCards.push(card)
			}
		}

		return foundCards
	}

}