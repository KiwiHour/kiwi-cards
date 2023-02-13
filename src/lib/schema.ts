export namespace DatabaseDirectory {

	export type NodeType = "root" | "folder" | "deck"
	export type NonRootNodeType = Exclude<NodeType, "root">
	export type NonDeckNodeType = Exclude<NodeType, "deck">

	export interface Node<NType extends NodeType = NodeType> {
		UId: string
		name: string
		type: NType
	
		// Children types go as follows (NonRoot[] as a child cannot be the root)
		// Unknown -> NonRoot[] or Card UIDs
		// NonDeck -> NonRoot[]
		// Deck -> Card UIDs
		children: NType extends "deck" ?  
			NType extends NonDeckNodeType ? 
				NonRootNode[] | string[] 
			  : string[]
		  : NonRootNode[]
	}

	export type NonRootNode = Node<"folder"> | Node<"deck">
	export type NonDeckNode = Node<"root"> | Node<"folder">
	export type AnyNode = Node<"root"> | Node<"folder"> | Node<"deck">

}

export interface DatabaseCard {
	lastCorrect: Date
	daysTillAsk: number
	front: string
	back: string
	
	UId: string
	type: "card"
}

export interface DatabaseGlobalData {
	inUseUIds: string[]
	directoryTree: DatabaseDirectory.Node<"root">
}