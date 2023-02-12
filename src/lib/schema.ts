export interface DatabaseDirectoryNode {
	UId: string
	name: string
	type: "folder" | "deck"
	parentUId: string | null
}

export interface DatabaseFolder extends DatabaseDirectoryNode {
	type: "folder"
	children: DatabaseDirectoryNode[]
}

export interface DatabaseDeck extends DatabaseDirectoryNode {
	type: "deck"
	children: string[] // array of card UIds
}

export interface DatabaseCard {
	UId: string
	deckUId: string
	lastCorrect: Date
	daysTillAsk: number
	front: string
	back: string
}

export type DatabaseDirectoryTree = DatabaseDirectoryNode[]
export interface DatabaseGlobalData {
	inUseUIds: string[]
	directoryTree: DatabaseDirectoryTree
}