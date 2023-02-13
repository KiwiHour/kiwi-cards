import type { Database } from "$lib/schema";
import type { MongoClient } from "mongodb";
import { Db } from "./index";

/**
 * Node's are specified using nodeUIds
 * This ensures that the data about said node is the most up to date
 * Ask the "datastructure" IS the database
 * Storing a copy of nodes in a variable/object would increase complexity
 * as you need to update the copy as well as the database
 * 
 * A null parentUId implies that the node is at the root level (orphan)
 */
export default class DirectoryTreeManager {

	private db: Db;

	constructor(private connectedMongoClient: MongoClient) {
		this.db = new Db(this.connectedMongoClient)
	}

	private stringifyObjectID(node: Database.DirectoryNode) {
		node._id = node._id.toString()
		return node
	}

	// private as updating a node without changing related nodes will cause issues
	private async updateNode(nodeUId: string, updatedAttributes: Partial<Database.DirectoryNode>) {
		await this.db.directoryNodesCollection.findOneAndUpdate(
			{ "UId": nodeUId },
			{ $set: updatedAttributes }
		)
	}

	private async getDescendants(nodeUId: string | null) {
		let descendants: Database.DirectoryNode[] = await this.getChildren(nodeUId)

		for (let descendant of descendants) {
			descendants = [...descendants, ...(await this.getDescendants(descendant.UId))]
		}

		return descendants
	}

	private async addChildUIdToNode(nodeUId: string, childUId: string) {
		let node = await this.getNode(nodeUId)
		// add moved node's UId to the new parent's childrenUIDs
		node.childrenUIds.push(childUId)
		await this.updateNode(node.UId, { "childrenUIds": node.childrenUIds })
	}

	private async removeChildUIdFromNode(nodeUId: string, childUId: string) {
		let node = await this.getNode(nodeUId)
		node.childrenUIds = node.childrenUIds.filter(UId => UId != childUId)
		await this.updateNode(node.UId, { "childrenUIds": node.childrenUIds })
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
		let node = await this.getNode(nodeUId)
		await this.db.directoryNodesCollection.deleteOne({ "UId": node.UId })
		
		// delete node descendants
		let descendants = await this.getDescendants(nodeUId)
		let deleteDescendantPromises = descendants.map(descendant => this.db.directoryNodesCollection.deleteOne({ "UId": descendant.UId }))
		// much faster to do a promise.all, as all nodes can be deleted at the same time (not related), instead of waiting for previous one to delete
		await Promise.all(deleteDescendantPromises)
			

		if (node.parentUId == null) { return; }
		await this.removeChildUIdFromNode(node.parentUId, node.UId)
	}
	
	// cannot be unsure nodeOrUId as node hasnt been added to db yet
	async addNode(node: Database.DirectoryNode) {
		await this.db.directoryNodesCollection.insertOne(node)
		if (node.parentUId == null) { return }
		await this.addChildUIdToNode(node.parentUId, node.UId) // update node's parent's children data
	}

	async moveNode(nodeUId: string, newParentUId: string | null) {
		let node = await this.getNode(nodeUId)
		await this.db.directoryNodesCollection.findOneAndUpdate(
			{ "UId": node.UId },
			{ $set: { "parentUId": newParentUId }}
		)

		// no need update parent's childrenUIds if the parent is root
		if (node.parentUId == null) { return }
		await this.removeChildUIdFromNode(node.parentUId, node.UId) // remove moved node uid from old parent's children data

		// no need to update new parent's childUIDs if the new parent is root
		if (newParentUId == null) { return }
		await this.addChildUIdToNode(newParentUId, node.UId) // add moved node uid to new parent's children data
	}

}