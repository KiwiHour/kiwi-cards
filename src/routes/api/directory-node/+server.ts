import { RequestTypeHandler, DirectoryTreeManager } from "$lib/classes";
import { generateUId, unknownInternalError } from "$lib/functions";
import { error, json, type RequestHandler } from "@sveltejs/kit";

function getValidTypes(patching: string): ("string"|"number"|"boolean"|"null")[] {
	switch (patching) {
		case "name": return ["string"]
		case "parentUId": return ["string", "null"] // could move to new node
		default: throw error(500, "Unhandled patching what match in getValidTypes")
	}
}

export const PATCH: RequestHandler = async ({ locals, request, url }) => {
	let { patching, nodeUId, newValue } = await request.json()


	//	 PARENT UID UPDATED WHEN THE UID IS INVALID!!!!!!
	// Type security

	let patchingTypeHandler = new RequestTypeHandler("PATCH", url.pathname, "patching", patching, ["string"], ["name", "parentUId"])
	patchingTypeHandler.validate(error => {
		if (error) { throw error }
	})

	let nodeUIdTypeHandler = new RequestTypeHandler("PATCH", url.pathname, "nodeUId", nodeUId, ["string"], [])
	nodeUIdTypeHandler.validate(error => {
		if (error) { throw error }
	})

	let newValueTypeHandler = new RequestTypeHandler("PATCH", url.pathname, "newValue", newValue, getValidTypes(patching as string), [])
	nodeUIdTypeHandler.validate(error => {
		if (error) { throw error }
	})

	// Patch node according to what is being patched (patching variable)

	let treeManager = new DirectoryTreeManager(locals.connectedMongoClient)
	let trueTypes = {
		patching: patchingTypeHandler.getTrueTypedVariable() as "name" | "parentUId",
		nodeUId: nodeUIdTypeHandler.getTrueTypedVariable() as string,
		newValue: newValueTypeHandler.getTrueTypedVariable() as string | (string | null)
	}

	console.log(`Attempting to patch the ${trueTypes.patching} `)

	try {

		switch (trueTypes.patching) {
			case "name":
				await treeManager.changeNodeName(trueTypes.nodeUId, trueTypes.newValue as string)
				break
			case "parentUId":
				await treeManager.moveNode(trueTypes.nodeUId, trueTypes.newValue as string | null)
				break
		}

		return json({ status: 200 })

	} catch (err) {
		if (err instanceof Error) {
			throw error(500, { message: err.message })
		}
	}

	throw unknownInternalError("PATCH", url)

}

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
	
	console.log(`Attempting to delete node with UId ${trueTypes.nodeUId}`)

	try {
		
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

	console.log(`Attempting to add ${trueTypes.type} "${trueTypes.name}" with parentUId of ${trueTypes.parentUId}`)

	try {

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