import type { Database } from "$lib/schema";
import type { MongoClient } from "mongodb";
import { Db } from "./index";

export default class DirectoryTreeManager {

	private db: Db;

	constructor(private connectedMongoClient: MongoClient) {
		this.db = new Db(this.connectedMongoClient)
	}

	private stringifyObjectID(node: Database.DirectoryNode) {
		node._id = node._id.toString()
		return node
	}

	async getChildren(parentUId: string | null) {
		let children = await this.db.directoryNodesCollection.find({ "parentUId": parentUId }).toArray()
		let idlessChildren = children.map(child => this.stringifyObjectID(child))
		return idlessChildren  
	}

	async getNode(nodeUId: string) {
		let node = await this.db.directoryNodesCollection.findOne({ "UId": nodeUId })
		if (!node) { throw new Error(`Node with UId of ${nodeUId} could not be found`) }
		let idlessNode = this.stringifyObjectID(node)
		return idlessNode
	}

	async deleteNode(nodeUId: string) {
		await this.db.directoryNodesCollection.deleteOne({ "UId": nodeUId })
	}
	
	async addNode(node: Database.DirectoryNode) {
		await this.db.directoryNodesCollection.insertOne(node)
	}

	async moveNode(nodeUId: string, newParentUId: string | null) {
		await this.db.directoryNodesCollection.findOneAndUpdate(
			{ "UId": nodeUId },
			{ $set: { "parentUId": newParentUId }}
		)
		let node = await this.getNode(nodeUId)

		// no need update parent's childrenUIds if the parent is root
		if (node.parentUId == null) { return }
		let parentNode = await this.getNode(node.parentUId)
		// remove moved node's UId from parent's childrenUIds
		parentNode.childrenUIds = parentNode.childrenUIds.filter(childUId => childUId != nodeUId)
		await this.updateNode(parentNode.UId, { "childrenUIds": parentNode.childrenUIds })

		// no need to update new parent's childUIDs if the new parent is root
		if (newParentUId == null) { return }
		let newParentNode = await this.getNode(newParentUId)
		// add moved node's UId to the new parent's childrenUIDs
		newParentNode.childrenUIds.push(nodeUId)
		await this.updateNode(newParentNode.UId, { "childrenUIds": newParentNode.childrenUIds })
	}

	async updateNode(nodeUId: string, updatedAttributes: Partial<Database.DirectoryNode>) {
		await this.db.directoryNodesCollection.findOneAndUpdate(
			{ "UId": nodeUId },
			{ $set: updatedAttributes }
		)
	}

}