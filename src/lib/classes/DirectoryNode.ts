import type { MongoClient } from "mongodb";
import type { Folder } from "./index"

export default abstract class DirectoryNode {

	protected abstract nodeType: "folder" | "deck";

	constructor(
		private UId: string,
		private name: string,
		private parent: Folder | null,
		private connectedMongoClient: MongoClient
	) {}

	/** @returns array of parent UIds from furthest to closest[dir1UId, dir2Uid, etc, etc, firstParentUId] */
	async getAllParentUIds(child: DirectoryNode) {
		let currentParent = child.getParent()
		let parentUIds: string[] = []

		// adds parent to array, then traverses to next parent
		while (currentParent?.hasParent()) {
			parentUIds.push(currentParent.getUId());
			currentParent = currentParent.getParent();
		}

		return parentUIds
	}

	getUId() { return this.UId }
	getName() { return this.name }
	getParent() { return this.parent }
	getNodeType() { return this.nodeType }
	getConnectedMongoClient() { return this.connectedMongoClient }

	hasParent() { return this.parent !== null }
}