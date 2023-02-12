import { Db, Folder } from "$lib/classes";
import { generateUId } from "$lib/functions";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, locals }) => {

	let db = new Db(locals.connectedMongoClient);
	
	let { name, parentUId } = await request.json()
	let UId = generateUId()
	let type = "folder"
	let children = []
	
	// new parent is null if parentUId is null or "", else it must be a folder
	let parent = parentUId == "" || null ? null : new Folder()
	let folder = new Folder(UId, name, )

	return json(":)")
}