import type { MongoClient } from "mongodb"
import { Db } from "./index"

export default class DeckManager {

	private db: Db

	constructor(private connectedMongoClient: MongoClient, private deckUId: string) {
		this.db = new Db(connectedMongoClient)
	}

	/** Get a card via it's UID */
	async getCard(UId: string) { }

	/** Get all the cards in this deck */
	async getCardsInDeck() {}

}