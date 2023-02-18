import type { MongoClient } from "mongodb"
import type { Database } from "$lib/schema"

import { error } from "@sveltejs/kit";
import { Db } from "./classes"
import crypto from "crypto"

/** @returns UID length of 16 (8 hex bytes) */
export async function generateUId(connectedMongoClient: MongoClient) {
	let db = new Db(connectedMongoClient);

	let directoryNodes = await db.directoryNodesCollection.find({}).toArray()
	let cards = await db.cardsCollection.find({}).toArray()

	let inUseUIds = [...cards.map(card => card.UId), ...directoryNodes.map(node => node.UId)]
	let randomUId: string;

	do {
		randomUId = crypto.randomBytes(8).toString("hex")
	} while (inUseUIds.includes(randomUId))

	return randomUId
}

export function getExpandedFolderUIDs(sessionStorage: Storage) {
	return JSON.parse(sessionStorage.getItem("expanded-folder-uids")?.replace(/'/g, `"`) || "[]") as string[]
}

export function unknownInternalError(method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE", url: URL) {
	return error(500, { message:
		`${method} ${url.pathname}: Unknown internal server error`
	})
}

/**
 * Sorts only the top level of an array of arrayedNode (better performance)

 * First, folders have higher priority than decks. Then they are sorted alphabetically by name
 */
export function sortTopLevelNodes(fileTree: Database.ArrayedNode<"folder" | "deck">[]) {

	let folders = fileTree.filter(([node, _]) => node.type == "folder")
	let decks = fileTree.filter(([node, _]) => node.type == "deck")

	let sortedFileTree = [
		...folders.sort(([a, _1], [b, _2]) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0),
		...decks.sort(([a, _1], [b, _2]) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
	] as Database.ArrayedNode<"folder" | "deck">[]
	
	return sortedFileTree

}