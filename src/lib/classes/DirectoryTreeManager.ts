import type { DatabaseDirectoryNode, NodeType } from "$lib/schema";
import type { MongoClient } from "mongodb";
import { Db } from "./index";

export default class DirectoryTreeManager {

	private db: Db;

	constructor(private connectedMongoClient: MongoClient) {
		this.db = new Db(this.connectedMongoClient)
	}

	async getDirectoryRoot() {
		let { directoryTree } = await this.db.getGlobalData()
		return directoryTree
	}

	async getNode(UIdPath: string[]) {

		let root: DatabaseDirectoryNode = await this.getDirectoryRoot()
		let currentNode = root
		
		for (let UId of UIdPath) {
			if (currentNode.type == "deck") { break }
			let possibleNode = (currentNode as DatabaseDirectoryNode<"root" | "folder">).children.find(child => child.UId == UId)
			if (!possibleNode) { break }
			currentNode = possibleNode
		}
		
		switch (currentNode.type) {
			case "root": return {
				node: currentNode as DatabaseDirectoryNode<"root">,
				directoryRoot: root as DatabaseDirectoryNode<"root">
			}
			case "folder": return {
				node: currentNode as DatabaseDirectoryNode<"folder">,
				directoryRoot: root as DatabaseDirectoryNode<"root">
			}
			case "deck": return {
				node: currentNode as DatabaseDirectoryNode<"deck">,
				directoryRoot: root as DatabaseDirectoryNode<"root">
			}
		}

	}
	
	async deleteNode(UIdPath: string[]) {
		// need to be at parent node, so we can edit children and update node
		let parentUIdPath = UIdPath.slice(0, -1)
		let nodeUId = UIdPath.slice(-1)[0]
		let { node: parentNode, directoryRoot } = await this.getNode(parentUIdPath)

		if (parentNode.type == "deck") {
			parentNode.children = parentNode.children.filter(cardUId => cardUId !== nodeUId)
		} else {
			parentNode.children = parentNode.children.filter(child => child.UId !== nodeUId)
		}

		// to double check that main root is updated
		// remove after you are sure that this method of object references works correctly
		console.log(JSON.stringify(directoryRoot))
		await this.db.updateDirectoryTree(directoryRoot)
		
	}
	async moveNode(UIdPath: string[], newUIdPath: string[]) {}
	async addChildNode<NType extends NodeType>(UIdPath: string[], node: DatabaseDirectoryNode<NType>) {}
	async updateNode<NType extends NodeType>(UIdPath: string[], newNode: DatabaseDirectoryNode<NType>) {}

}