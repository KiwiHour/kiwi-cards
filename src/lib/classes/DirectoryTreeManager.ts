import type { Database } from "$lib/schema";
import type { MongoClient } from "mongodb";
import { Db } from "./index";

type NodeOrUId = Database.DirectoryNode | string

export default class DirectoryTreeManager {

	private db: Db;

	constructor(private connectedMongoClient: MongoClient) {
		this.db = new Db(this.connectedMongoClient)
	}

	private stringifyObjectID(node: Database.DirectoryNode) {
		node._id = node._id.toString()
		return node
	}

	/** Ensures that a given UID or node object becomes a node object
	 * 	If it is already a node object, no api call. So no performance problem
	 *  @returns directory node */
	private async ensureNodeObject(nodeOrUId: NodeOrUId) {
		if (typeof nodeOrUId == "string") {
			return await this.getNode(nodeOrUId)
		} else {
			return nodeOrUId as Database.DirectoryNode
		}
	}

	// null -> root
	private async addChildUIdToNode(nodeOrUId: NodeOrUId, childUId: string) {
		let node = await this.ensureNodeObject(nodeOrUId)
		// add moved node's UId to the new parent's childrenUIDs
		node.childrenUIds.push(childUId)
		await this.updateNode(node.UId, { "childrenUIds": node.childrenUIds })
	}

	private async removeChildUIdFromNode(nodeOrUId: NodeOrUId, childUId: string) {
		let node = await this.ensureNodeObject(nodeOrUId)
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

	async deleteNode(nodeOrUId: NodeOrUId) {
		let node = await this.ensureNodeObject(nodeOrUId)
		await this.db.directoryNodesCollection.deleteOne({ "UId": node.UId })
		// needs to recursively follow through every child of the deleted node, and remove them as well
		// since deleteing a folder also deletes the contents of said folder

		// If the node that was deleted's parent was the root, no need to remove child UID from parent
		if (node.parentUId == null) { return; }
		await this.removeChildUIdFromNode(node.parentUId, node.UId)
	}
	
	// cannot be unsure nodeOrUId as node hasnt been added to db yet
	async addNode(node: Database.DirectoryNode) {
		await this.db.directoryNodesCollection.insertOne(node)
		if (node.parentUId == null) { return }
		await this.addChildUIdToNode(node.parentUId, node.UId) // update node's parent's children data
	}

	async moveNode(nodeOrUId: NodeOrUId, newParentUId: string | null) {
		let node = await this.ensureNodeObject(nodeOrUId)
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

	// private as updating a node without changing related nodes will cause issues
	private async updateNode(nodeUId: string, updatedAttributes: Partial<Database.DirectoryNode>) {
		await this.db.directoryNodesCollection.findOneAndUpdate(
			{ "UId": nodeUId },
			{ $set: updatedAttributes }
		)
	}

}