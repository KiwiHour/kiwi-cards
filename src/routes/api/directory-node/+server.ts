import { RequestTypeHandler, DirectoryTreeManager } from "$lib/classes";
import { generateUId } from "$lib/functions";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const DELETE: RequestHandler = async ({ locals, request, url }) => {
	let { nodeUId } = await request.json()

	// Type security

	let nodeUIdTypeHandler = new RequestTypeHandler("DELETE", url.pathname, "nodeUId", nodeUId, ["string"], [])
	nodeUIdTypeHandler.validate(error => {
		if (error) { throw error }
	})

	// Delete the node

	console.log(`Deleting node with UId ${nodeUId}`)

	let treeManager = new DirectoryTreeManager(locals.connectedMongoClient)

	try {

	} catch (err) {
		if (err instanceof Error) {
			throw error(500, { message: err.message })
		}
	}

	return json({ status: 200 })
}

export const POST: RequestHandler = async ({ locals, request, url }) => {
	let { parentUId, name, type } = await request.json()

	// Type security
	
	let parentUIdTypeHandler = new RequestTypeHandler("POST", url.pathname, "parentUId", parentUId, ["string", "null"], [])
	parentUIdTypeHandler.validate(error => {
		if (error) { throw error }
	})

	let nameTypeHandler = new RequestTypeHandler("POST", url.pathname, "name", name, ["string"], [])
	nameTypeHandler.validate(error => {
		if (error) { throw error }
	})

	let typeTypeHandler = new RequestTypeHandler("POST", url.pathname, "type", type, ["string"], ["folder", "deck"])
	typeTypeHandler.validate(error => {
		if (error) { throw error }
	})

	// Add the node

	console.log(`Adding ${type} with UId ${parentUId}`)

	let treeManager = new DirectoryTreeManager(locals.connectedMongoClient)

	try {
		await treeManager.addNode({
			UId: await generateUId(locals.connectedMongoClient),
			parentUId: parentUIdTypeHandler.getTrueTypedVariable() as string | null,
			childrenUIds: [],
			name: nameTypeHandler.getTrueTypedVariable() as string,
			type: typeTypeHandler.getTrueTypedVariable() as "folder" | "deck"
		})
	} catch (err) {
		if (err instanceof Error) {
			throw error(500, { message: err.message })
		}
	}

	return json({ status: 200 })

}