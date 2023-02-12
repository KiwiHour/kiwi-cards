export type NodeType = "root" | "folder" | "deck"
export type NonRootNodeType = Exclude<NodeType, "root">
export type NonDeckNodeType = Exclude<NodeType, "deck">

export interface DatabaseDirectoryNode<NType extends NodeType = NodeType> {
	UId: string
	name: string
	type: NType

	// Children types go as follows (NonRoot[] as a child cannot be the root)
	// Unknown -> NonRoot[] or Card UIDs
	// NonDeck -> NonRoot[]
	// Deck -> Card UIDs
	children: NType extends "deck" ?  
		NType extends NonDeckNodeType ? 
			DatabaseDirectoryNode<NonRootNodeType>[] | string[] 
		  : string[]
	  : DatabaseDirectoryNode<NonRootNodeType>[]
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
	directoryTree: DatabaseDirectoryNode<"root">
}