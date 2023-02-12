import type { Handle } from "@sveltejs/kit"

import { MongoClient, ServerApiVersion } from "mongodb";
import { MONGODB_USERNAME, MONGODB_PASSWORD } from "$env/static/private";

const MONGO_URI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@kiwikluster.rlek0su.mongodb.net/?retryWrites=true&w=majority`

export const handle: Handle = async ({ event, resolve }) => {

	const mongoClient = new MongoClient(MONGO_URI, { serverApi: ServerApiVersion.v1 })
	try {
		await mongoClient.connect()
	} catch (error) {
		if (error) { throw new Error("Could not connect to MongoDB successfully") }
	}

	console.log("successfully connected to mongodb")
	event.locals.mongoClient = mongoClient;

	return await resolve(event);

}