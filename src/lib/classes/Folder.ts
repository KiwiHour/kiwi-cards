import { DirectoryNode, Deck } from "./index";

export default class Folder extends DirectoryNode {

	protected nodeType = "folder" as const

	constructor(
		UId: string,
		name: string,
		parent: Folder | null,
		private children: (Folder | Deck)[]
	) {
		super(UId, name, parent)
	}

	getChildren() { return this.children }

	hasChild() { return this.children.length > 0 }
	hasChildFolder() {
		return this.children.some(child => child.getNodeType() == "folder")
	}
	hasChildDeck() {
		return this.children.some(child => child.getNodeType() == "deck")
	}
	
}