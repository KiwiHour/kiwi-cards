export type NodeType = "root" | "folder" | "deck"

export interface DatabaseDirectoryNode<NType extends NodeType = NodeType> {
	UId: string
	name: string
	type: NType
	children: NType extends "deck"  ? NType extends "root" | "folder" ? DatabaseDirectoryNode<"folder" | "deck">[] | DatabaseCard[] : DatabaseCard[] : DatabaseDirectoryNode<"folder" | "deck">[]
}

export interface DatabaseCard {
	lastCorrect: Date
	daysTillAsk: number
	front: string
	back: string
	
	UId: string
	name: string
	type: "card"
}

export interface DatabaseGlobalData {
	inUseUIds: string[]
	directoryTree: DatabaseDirectoryNode<"root">
}