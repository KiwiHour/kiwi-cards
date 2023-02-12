import type { DatabaseDeck, DatabaseDirectoryNode, DatabaseFolder, DatabaseRootNode } from "$lib/schema";
import type { MongoClient } from "mongodb";
import { Db } from "./index";

interface Node {
	UId: string
	name: string
	type: "folder" | "deck"
}

export default class DirectoryTreeTraverser {

	private currentNodeUId: string | null = null;
	private previousNodeUIds: string[] = [];
	private db: Db;

	constructor(private connectedMongoClient: MongoClient) {
		this.db = new Db(connectedMongoClient);
	}

	async getCurrentNode() {
		if (this.previousNodeUIds.length == 0) {
			return {
				UId: "root",
				name: "root",
				type: "root",
				parentUId: null
			} as DatabaseRootNode
		}

		let { directoryTree: currentNode } = await this.db.getGlobalData()

		for (let previousNodeUId of this.previousNodeUIds) {
			let nextNode = currentNode.children.find(node => node.UId == previousNodeUId)
			if (!nextNode) { return null }
			if (nextNode.type == "deck") {
				return nextNode as DatabaseDeck
			}

			currentNode = nextNode
		}

	}

	async canTraverseDown() {
		let currentNode = await this.getCurrentNode()
		if (!currentNode) { return false }
		return currentNode.children.length
	}

}