interface DirectoryNode {
	UId: string
	parent: DirectoryNode | null
	children: DirectoryNode[] | string[] // array of card UIds
}

export interface DatabaseCard {
	UId: string
	deckUId: string
	lastCorrect: Date
	daysTillAsk: number
	front: string
	back: string
}

export interface DatabaseGlobal {
	inUseUIds: string[]
	directoryTree: DirectoryNode[]
}