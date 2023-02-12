import type { Handle } from "@sveltejs/kit"

import { MongoClient, ServerApiVersion } from "mongodb";
import { MONGODB_USERNAME, MONGODB_PASSWORD } from "$env/static/private";
import { Db, Folder, type DirectoryNode } from "$lib/classes";

const MONGO_URI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@kiwikluster.rlek0su.mongodb.net/?retryWrites=true&w=majority`
const mongoClient = new MongoClient(MONGO_URI, { serverApi: ServerApiVersion.v1 })

try {
	await mongoClient.connect()
} catch (error) {
	if (error) { throw new Error("Could not connect to MongoDB successfully") }
}

let directoryTree: DirectoryNode[] = []
let db = new Db(mongoClient)
let { directoryTree: databaseDirectoryTree } = await db.getGlobalData();

for (let databaseDirectoryNode of databaseDirectoryTree) {
	let { UId, name, type, parentUId } = databaseDirectoryNode
	let node: unknown;
	if (type == "folder") {
		node = new Folder(UId, name, null, mongoClient, [])
	}
}



export const handle: Handle = async ({ event, resolve }) => {

	try {
		await mongoClient.connect()
	} catch (error) {
		if (error) { throw new Error("Could not connect to MongoDB successfully") }
	}

	console.log("successfully connected to mongodb")
	event.locals.connectedMongoClient = mongoClient;

	return await resolve(event);

}