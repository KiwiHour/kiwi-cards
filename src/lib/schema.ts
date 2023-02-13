import type { ObjectId } from "mongodb"

export namespace Database {
	
	export interface DirectoryNode {
		_id: ObjectId | string
		UId: string,
		parentUId: string | null
		childrenUIds: string[]

		name: string
		type: "folder" | "deck"
	}

	export interface Card {
		lastCorrect: Date
		daysTillAsk: number
		front: string
		back: string
		
		_id: ObjectId | string
		UId: string
		type: "card"
	}

}