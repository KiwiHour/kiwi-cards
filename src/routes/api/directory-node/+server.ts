import { RequestTypeHandler, DirectoryTreeManager } from "$lib/classes";
import { generateUId, unknownInternalError } from "$lib/functions";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const DELETE: RequestHandler = async ({ locals, request, url }) => {
	let { nodeUId } = await request.json()

	// Type security

	let nodeUIdTypeHandler = new RequestTypeHandler("DELETE", url.pathname, "nodeUId", nodeUId, ["string"], [])
	nodeUIdTypeHandler.validate(error => {
		if (error) { throw error }
	})

	// Delete the node

	console.log(`Attempting to delete node with UId ${nodeUId}`)
	
	let treeManager = new DirectoryTreeManager(locals.connectedMongoClient)
	
	try {
		
		await treeManager.deleteNode(nodeUId)

		console.log("DELETE successful")
		return json({ status: 200 })

	} catch (err) {
		if (err instanceof Error) {
			throw error(500, { message: err.message })
		}
	}

	// should not get here
	throw unknownInternalError("DELETE", url)

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

	console.log(`Attempted to add ${type} "${name}" with parentUId of ${parentUId}`)

	let treeManager = new DirectoryTreeManager(locals.connectedMongoClient)

	try {

		let nodeUId = await generateUId(locals.connectedMongoClient)
		await treeManager.addNode({
			UId: nodeUId,
			parentUId: parentUIdTypeHandler.getTrueTypedVariable() as string | null,
			childrenUIds: [],
			name: nameTypeHandler.getTrueTypedVariable() as string,
			type: typeTypeHandler.getTrueTypedVariable() as "folder" | "deck"
		})

		
		console.log("POST successful")
		return json({ status: 200, addedNodeUId: nodeUId })

	} catch (err) {
		if (err instanceof Error) {
			throw error(500, { message: err.message })
		}
	}

	// should not reach here
	throw unknownInternalError("POST", url)

}