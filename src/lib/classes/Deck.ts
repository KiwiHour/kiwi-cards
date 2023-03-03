import { generateUId } from "$lib/functions"
import type { Database } from "$lib/types"
import type { MongoClient } from "mongodb"
import { Db, Card } from "./index"

export default class Deck {

	private db: Db

	constructor(private connectedMongoClient: MongoClient, private UId: string) {
		this.db = new Db(connectedMongoClient)
	}

	async get() {
		return await this.db.directoryNodesCollection.findOne({ type: "deck", UId: this.UId })
	}

	async addCard(card: Database.Card) {
		await this.db.cardsCollection.insertOne(card)
		await this.db.directoryNodesCollection.updateOne(
			{ "UId": this.UId },
			{ $push: { "childrenUIds": card.UId } }
		)
	}

	async deleteCard(cardUId: string) {
		await this.db.cardsCollection.deleteOne({ UId: cardUId })
		await this.db.directoryNodesCollection.updateOne(
			{ "UId": this.UId },
			{ $pull: { "childrenUIds": { $eq: cardUId } } }
		);
	}

	/* also adds this card to the deck */
	async newBlankCard() {
		let newCard: Database.Card = {
			UId: await generateUId(this.connectedMongoClient),
			deckUId: this.UId,
			type: "card",
			lastCorrect: null,
			daysTillAsk: 1,
			front: "",
			back: ""
		}

		return newCard
	}

	/** Get all the cards in this deck */
	async getCardsInDeck() {
		let deck = await this.get()
		let cardUIds = deck?.childrenUIds

		let cards = await this.db.cardsCollection.find({ UId: { $in: cardUIds ?? [] } }).toArray()
		return cards
	}

}