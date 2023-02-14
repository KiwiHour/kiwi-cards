import { RequestTypeHandler, DirectoryTreeManager } from "$lib/classes";
import { unknownInternalError } from "$lib/functions";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const PATCH: RequestHandler = async ({ locals, request, url }) => {
	let { newParentUId, nodeUId } = await request.json()

    // Type security

    let nodeUIdTypeHandler = new RequestTypeHandler("PATCH", url.pathname, "nodeUId", nodeUId, ["string"], [])
	nodeUIdTypeHandler.validate(error => {
		if (error) { throw error }
	})

    let newParentUIdTypeHandler = new RequestTypeHandler("PATCH", url.pathname, "newParentUId", newParentUId, ["string", "null"], [])
    newParentUIdTypeHandler.validate(error => {
        if (error) { throw error }
    })

    // Rename node

    let treeManager = new DirectoryTreeManager(locals.connectedMongoClient)
    let trueTypes = {
        nodeUId: nodeUIdTypeHandler.getTrueTypedVariable() as string,
        newParentUId: newParentUIdTypeHandler.getTrueTypedVariable() as string | null
    }

    console.log(`Attempting to move node with UId '${trueTypes.nodeUId}' to parent with UId '${trueTypes.newParentUId}' `)

	try {

        await treeManager.validateNodeUId(trueTypes.nodeUId)
        // no need to ensure root exists, it does...
        if (trueTypes.newParentUId !== null) await treeManager.validateNodeUId(trueTypes.newParentUId)
		await treeManager.moveNode(trueTypes.nodeUId, trueTypes.newParentUId)

        console.log(`PATCH successful`)
		return json({ status: 200 })

	} catch (err) {
		if (err instanceof Error) {
			throw error(500, { message: err.message })
		}
	}

	throw unknownInternalError("PATCH", url)


}