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
	
	let treeManager = new DirectoryTreeManager(locals.connectedMongoClient)
	let trueTypes = {
		nodeUId: nodeUIdTypeHandler.getTrueTypedVariable() as string
	}
	
	console.log(`Attempting to delete node with UId '${trueTypes.nodeUId}'`)

	try {
		
		await treeManager.validateNodeUId(trueTypes.nodeUId)
		await treeManager.deleteNode(trueTypes.nodeUId)

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

	let treeManager = new DirectoryTreeManager(locals.connectedMongoClient)
	let trueTypes = {
		parentUId: parentUIdTypeHandler.getTrueTypedVariable() as string | null,
		name: nameTypeHandler.getTrueTypedVariable() as string,
		type: typeTypeHandler.getTrueTypedVariable() as "folder" | "deck"
	}

	console.log(`Attempting to add ${trueTypes.type} '${trueTypes.name}' with parentUId of '${trueTypes.parentUId}'`)

	try {
		
		// no need to ensure root exists, it does...
		if (trueTypes.parentUId !== null) await treeManager.validateNodeUId(trueTypes.parentUId)

		let nodeUId = await generateUId(locals.connectedMongoClient)
		await treeManager.addNode({
			UId: nodeUId,
			parentUId: trueTypes.parentUId,
			childrenUIds: [],
			name: trueTypes.name,
			type: trueTypes.type
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