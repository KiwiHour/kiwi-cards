import type { MongoClient } from "mongodb";
import { Card, DirectoryNode, Folder, Db } from "./index";

export default class Deck extends DirectoryNode {

	protected nodeType = "deck" as const
	private cards: Card[] = []

	constructor(
		UId: string,
		name: string,
		parent: Folder | null
	) {
		super(UId, name, parent)
	}

	/** Asynchronously load cards from database into this Deck */
	async initCards(connectedMongoClient: MongoClient) {
		let db = new Db(connectedMongoClient)
		this.cards = await db.getCardsInDeck(this.getUId())
	}
	
}