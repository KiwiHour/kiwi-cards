import type { MongoClient } from "mongodb";
import { DirectoryNode, Deck, Db } from "./index";

export default class Folder extends DirectoryNode {

	protected nodeType = "folder" as const

	constructor(
		UId: string,
		name: string,
		parent: Folder | null,
		connectedMongoClient: MongoClient,
		private children: (Folder | Deck)[]
	) {
		super(UId, name, parent, connectedMongoClient)
	}

	getChildren() { return this.children }
	async addChild(child: Folder | Deck) {
		let parentUIds = await this.getAllParentUIds(child)
		let db = new Db(this.getConnectedMongoClient());

		this.children.push(child);
		if (child.getNodeType() == "folder") {
			db.addFolder(child as Folder, parentUIds)
		}
		else if (child.getNodeType() == "deck") {
			// db.addDeck(child as Deck, parentUIds)
		}
	}

	hasChild() { return this.children.length > 0 }
	hasChildFolder() {
		return this.children.some(child => child.getNodeType() == "folder")
	}
	hasChildDeck() {
		return this.children.some(child => child.getNodeType() == "deck")
	}
	
}