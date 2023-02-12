import { Db, Folder } from "$lib/classes";
import { generateUId } from "$lib/functions";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, locals }) => {

	let db = new Db(locals.connectedMongoClient);
	
	let { name, parentUId } = await request.json()
	let UId = generateUId()
	let type = "folder"
	let children = []

	let folder = new Folder()

	return json(":)")
}