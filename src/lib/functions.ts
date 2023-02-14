import { error } from "@sveltejs/kit";
import crypto from "crypto"
import type { MongoClient } from "mongodb"
import { Db } from "./classes"

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