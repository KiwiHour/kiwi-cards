import type { Folder } from "./index"

export default abstract class DirectoryNode {

	protected abstract nodeType: "folder" | "deck";

	constructor(
		private UId: string,
		private name: string,
		private parent: Folder | null
	) {}

	getUId() { return this.UId }
	getName() { return this.name }
	getParent() { return this.parent }
	getNodeType() { return this.nodeType }

	hasParent() { return this.parent !== null }
}