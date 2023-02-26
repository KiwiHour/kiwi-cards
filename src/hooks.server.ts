import { redirect, type Handle, type HandleServerError } from "@sveltejs/kit"

import { MongoClient, ServerApiVersion } from "mongodb";
import { MONGODB_USERNAME, MONGODB_PASSWORD, MAINTENANCE } from "$env/static/private";

const MONGO_URI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@kiwikluster.rlek0su.mongodb.net/?retryWrites=true&w=majority`
const mongoClient = new MongoClient(MONGO_URI, { serverApi: ServerApiVersion.v1 })

export const handle: Handle = async ({ event, resolve }) => {

	let t0 = performance.now()

	if (MAINTENANCE == "0" && event.url.pathname == "/maintenance") {
		throw redirect(302, "/")
	}

	if (MAINTENANCE == "1" && event.url.pathname !== "/maintenance") {
		throw redirect(302, "/maintenance")
	}

	try {
		await mongoClient.connect()
	} catch (error) {
		if (error) { throw new Error("Could not connect to MongoDB successfully") }
	}

	console.log(`${(performance.now() - t0).toFixed(5)}ms`)
	console.log("successfully connected to mongodb")
	event.locals.connectedMongoClient = event.locals.connectedMongoClient || mongoClient;
	
	return await resolve(event);

}

export const handleError: HandleServerError = async({ error, event }) => {

	return {
		message: "Eh oh! It appears you've been using this site unimpeded for a while. Good job this error showed up" + (error ? "<br/><br/><i>" + (error as Error).message + "</i>" : "")
	}

}