import type { DatabaseCard, DatabaseGlobal } from "$lib/schema";
import type { Collection, MongoClient } from "mongodb";
import { Card } from "./index";

export default class Db {

	private cardsCollection: Collection<DatabaseCard>
	private globalCollection: Collection<DatabaseGlobal>

	constructor(private connectedMongoClient: MongoClient) {
		this.cardsCollection = connectedMongoClient.db("kiwihour").collection("cards")
		this.globalCollection = connectedMongoClient.db("kiwihour").collection("global")
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