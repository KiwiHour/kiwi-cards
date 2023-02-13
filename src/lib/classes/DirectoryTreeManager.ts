import type { DatabaseDirectory } from "$lib/schema";
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

	async getNode(nodeUIdPath: string[]): Promise<{ node: DatabaseDirectory.AnyNode, directoryRoot: DatabaseDirectory.Node<"root"> }> {

		let root: DatabaseDirectory.Node = await this.getDirectoryRoot()
		let currentNode = root
		
		for (let UId of nodeUIdPath) {
			if (currentNode.type == "deck") { break }
			let possibleNode = (currentNode as DatabaseDirectory.Node<"root" | "folder">).children.find(child => child.UId == UId)
			if (!possibleNode) { throw new Error("Invalid node UId path") }
			currentNode = possibleNode
		}
		
		switch (currentNode.type) {
			case "root": return {
				node: currentNode as DatabaseDirectory.Node<"root">,
				directoryRoot: root as DatabaseDirectory.Node<"root">
			}
			case "folder": return {
				node: currentNode as DatabaseDirectory.Node<"folder">,
				directoryRoot: root as DatabaseDirectory.Node<"root">
			}
			case "deck": return {
				node: currentNode as DatabaseDirectory.Node<"deck">,
				directoryRoot: root as DatabaseDirectory.Node<"root">
			}
		}

	}
	
	async deleteNode(nodeUIdPath: string[]) {
		// need to be at parent node, so we can edit children and update node
		let parentUIdPath = nodeUIdPath.slice(0, -1)
		let nodeUId = nodeUIdPath.slice(-1)[0]
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
	
	async addChildNode(parentUIdPath: string[], node: DatabaseDirectory.NonRootNode) {

		let { node: parentNode, directoryRoot } = await this.getNode(parentUIdPath)
		if (parentNode.type == "deck") { throw new Error("Cannot add child node to deck. Use 'addCard' method")}
		parentNode.children.push(node)

		await this.db.updateDirectoryTree(directoryRoot)

	}

	async moveNode(nodeUIdPath: string[], newParentUIdPath: string[]) {

		let { node } = await this.getNode(nodeUIdPath)

		if (node.type == "root") { throw new Error("Cannot move root node") }

		await this.deleteNode(nodeUIdPath)
		await this.addChildNode(newParentUIdPath, node)

		// no need to update database, since functions above do it automatically

	}

	/** Essentially updates the node by deleting it, and then adding back the new node */
	async updateNode(nodeUIdPath: string[], newNode: DatabaseDirectory.NonRootNode) {

		await this.deleteNode(nodeUIdPath)
		await this.addChildNode(nodeUIdPath, newNode)

		// no need to update database, since functions above do it automatically

	}

}