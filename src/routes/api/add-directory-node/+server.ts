import { RequestTypeHandler, DirectoryTreeManager } from "$lib/classes";
import { generateUId } from "$lib/functions";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ locals, request }) => {
	let { parentUId, name, type } = await request.json()

	// Type security
	
	let parentUIdTypeHandler = new RequestTypeHandler("/add-folder", "parentUId", parentUId, ["string", "null"], [])
	parentUIdTypeHandler.validate(error => {
		if (error) { throw error }
	})

	let nameTypeHandler = new RequestTypeHandler("/add-folder", "name", name, ["string"], [])
	nameTypeHandler.validate(error => {
		if (error) { throw error }
	})

	let typeTypeHandler = new RequestTypeHandler("/add-folder", "type", type, ["string"], ["folder", "deck"])
	typeTypeHandler.validate(error => {
		if (error) { throw error }
	})

	// Add the folder

	let treeManager = new DirectoryTreeManager(locals.connectedMongoClient)
	await treeManager.addNode({
		UId: await generateUId(locals.connectedMongoClient),
		parentUId: parentUIdTypeHandler.getTrueTypedVariable() as string | null,
		childrenUIds: [],
		name: nameTypeHandler.getTrueTypedVariable() as string,
		type: typeTypeHandler.getTrueTypedVariable() as "folder" | "deck"
	})

	return json({ status: 200 })

}