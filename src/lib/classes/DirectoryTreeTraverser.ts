import type { DatabaseDirectoryNode, NodeType } from "$lib/schema";
import type { MongoClient } from "mongodb";
import { Db } from "./index";

export default class DirectoryTreeTraverser {

	private currentPath: string[] = []; // array of node UIds
	private db: Db;

	constructor(private connectedMongoClient: MongoClient) {
		this.db = new Db(this.connectedMongoClient)
	}

	setCurrentPath(newPath: string[]) {
		this.currentPath = newPath
	}

	async getDirectoryTree() {
		let { directoryTree } = await this.db.getGlobalData()
		return directoryTree
	}

	async getCurrentNode() {

		let currentNode: DatabaseDirectoryNode = await this.getDirectoryTree()
		
		for (let UId of this.currentPath) {
			if (currentNode.type == "deck") { break }
			let possibleNode = (currentNode as DatabaseDirectoryNode<"root" | "folder">).children.find(child => child.UId == UId)
			if (!possibleNode) { break }
			currentNode = possibleNode
		}

		switch (currentNode.type) {
			case "root": return currentNode as DatabaseDirectoryNode<"root">;
			case "folder": return currentNode as DatabaseDirectoryNode<"folder">;
			case "deck": return currentNode as DatabaseDirectoryNode<"deck">;
		}

	}
	
	async deleteCurrentNode() {}
	async deleteChildNode(childUId: string) {}

	async moveCurrentNode(newPath: string[]) {
		let currentNode = await this.getCurrentNode()
		if (currentNode?.type == "folder") {
			currentNode.children
		}
	}
	async moveChildNode(childUId: string, newPath: string[]) {}

	async addChildNode<NType extends NodeType>(node: DatabaseDirectoryNode<NType>) {}
	
	async updateCurrentNode<NType extends NodeType>(newNode: DatabaseDirectoryNode<NType>) {}
	async updateChildNode<NType extends NodeType>(childUId: string, newNode: DatabaseDirectoryNode<NType>) {}

}