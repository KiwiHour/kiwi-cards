import type { ObjectId } from "mongodb"

export namespace Database {
	
	export type ArrayedNode<NType extends "folder" | "deck"> = 
	NType extends "folder" ? NType extends "deck" ? [Database.DirectoryNode, ArrayedNode<"folder" | "deck">[] | string[]] : // folder or a deck
		[Database.DirectoryNode, ArrayedNode<"folder" | "deck">[]] : // folder
		[Database.DirectoryNode, string[]] // deck

	export interface DirectoryNode {
		_id?: ObjectId | string
		UId: string,
		parentUId: string | null
		childrenUIds: string[]

		name: string
		type: "folder" | "deck"
	}

	export interface Card {
		lastCorrect: Date | null
		daysTillAsk: number
		front: string
		back: string
		
		_id?: ObjectId | string
		UId: string
		type: "card"
	}

}

export type ContextMenuOptions = { name: string, function: () => any }[]