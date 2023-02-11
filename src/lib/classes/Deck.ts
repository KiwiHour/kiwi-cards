import { Card, DirectoryNode, Folder } from "./index";

export default class Deck extends DirectoryNode {

	protected nodeType = "deck" as const
	private cards: Card[] = []

	constructor(
		UId: string,
		name: string,
		parent: Folder | null
	) {
		super(UId, name, parent)
	}
	
}