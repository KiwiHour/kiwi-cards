import { RequestTypeHandler, DirectoryTreeManager } from "$lib/classes";
import { generateUId, unknownInternalError } from "$lib/functions";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const PATCH: RequestHandler = async ({ locals, request, url }) => {
	let { newName, nodeUId } = await request.json()

    // Type security

    let nodeUIdTypeHandler = new RequestTypeHandler("DELETE", url.pathname, "nodeUId", nodeUId, ["string"], [])
	nodeUIdTypeHandler.validate(error => {
		if (error) { throw error }
	})

    let newNameTypeHandler = new RequestTypeHandler("PATCH", url.pathname, "newName", newName, ["string"], [])
    newNameTypeHandler.validate(error => {
        if (error) { throw error }
    })

    // Rename node

    let treeManager = new DirectoryTreeManager(locals.connectedMongoClient)


})