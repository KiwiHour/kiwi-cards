import type { MongoClient } from "mongodb"
import type { ContextMenuOptions, Database } from "$lib/types"

import { invalidateAll } from "$app/navigation";
import { error } from "@sveltejs/kit";
import { Db } from "./classes"
import crypto from "crypto"

/** @returns UID length of 16 (8 hex bytes) */
export async function generateUId(connectedMongoClient: MongoClient) {
	let db = new Db(connectedMongoClient);

	let [directoryNodes, cards] = await Promise.all([
		db.directoryNodesCollection.find({}).toArray(),
		db.cardsCollection.find({}).toArray()
	])

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
		...folders.sort(([a, _1], [b, _2]) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0),
		...decks.sort(([a, _1], [b, _2]) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 0)
	] as Database.ArrayedNode<"folder" | "deck">[]
	
	return sortedFileTree

}

export async function deleteNode(nodeUId: string): Promise<[null, Error | null]> {
	let res = await fetch("/api/directory-node", {
		method: "DELETE",
		body: JSON.stringify({ nodeUId })
	})

	let data = await res.json()
	if (res.ok) {
		return [data, null]
	} else {
		return [null, new Error(data.message)]
	}
}

export async function renameNode(nodeUId: string, newName: string): Promise<[null, Error | null]> {
	let res = await fetch("/api/rename-directory-node", {
		method: "PATCH",
		body: JSON.stringify({ nodeUId, newName })
	})

	let data = await res.json()
	if (res.ok) {
		return [data, null]
	} else {
		return [null, new Error(data.message)]
	}
}

/** @returns the added node's UId if no error occurs */
export async function addNode(parentUId: string | null, name: string, type: "folder" | "deck"): Promise<[string, null] | [null, Error]> {
	let res = await fetch("/api/directory-node", {
		method: "POST",
		body: JSON.stringify({ parentUId, name, type })
	})

	let data = await res.json();
	if (res.ok) {
		return [data.addedNodeUId, null]
	} else {
		return [null, new Error(data.message)]
	}
}

export async function moveNode(newParentUId: string | null, nodeUId: string): Promise<[null, Error | null]> {
	let res = await fetch("/api/move-directory-node", {
		method: "PATCH",
		body: JSON.stringify({ newParentUId, nodeUId })
	})

	let data = await res.json();
	if (res.ok) {
		return [data, null]
	} else {
		return [null, new Error(data.message)]
	}
}

export function generateNewNode(type: "folder" | "deck", parentUId: string | null) {
	return {
		UId: "new-node",
		parentUId,
		childrenUIds: [],
		name: "",
		type
	} as Database.DirectoryNode
}
