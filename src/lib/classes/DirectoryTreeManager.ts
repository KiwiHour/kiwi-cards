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

	// null -> root
	private async addChildUIdToNode(nodeUId: string, childUId: string) {
		let node = await this.getNode(nodeUId)
		// add moved node's UId to the new parent's childrenUIDs
		node.childrenUIds.push(childUId)
		await this.updateNode(nodeUId, { "childrenUIds": node.childrenUIds })
	}

	private async removeChildUIdFromNode(nodeUId: string, childUId: string) {
		let node = await this.getNode(nodeUId)
		node.childrenUIds = node.childrenUIds.filter(UId => UId != childUId)
		await this.updateNode(nodeUId, { "childrenUIds": node.childrenUIds })
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
		await this.removeChildUIdFromNode(node.parentUId, nodeUId)

		// no need to update new parent's childUIDs if the new parent is root
		if (newParentUId == null) { return }
		await this.addChildUIdToNode(newParentUId, nodeUId)
	}

	// private as updating a node without changing related nodes will cause issues
	private async updateNode(nodeUId: string, updatedAttributes: Partial<Database.DirectoryNode>) {
		await this.db.directoryNodesCollection.findOneAndUpdate(
			{ "UId": nodeUId },
			{ $set: updatedAttributes }
		)
	}

}