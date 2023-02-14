import { RequestTypeHandler, DirectoryTreeManager } from "$lib/classes";
import { generateUId, unknownInternalError } from "$lib/functions";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const PATCH: RequestHandler = async ({ locals, request, url }) => {
	let { newName, nodeUId } = await request.json()

    // Type security

    let nodeUIdTypeHandler = new RequestTypeHandler("PATCH", url.pathname, "nodeUId", nodeUId, ["string"], [])
	nodeUIdTypeHandler.validate(error => {
		if (error) { throw error }
	})

    let newNameTypeHandler = new RequestTypeHandler("PATCH", url.pathname, "newName", newName, ["string"], [])
    newNameTypeHandler.validate(error => {
        if (error) { throw error }
    })

    // Rename node

    let treeManager = new DirectoryTreeManager(locals.connectedMongoClient)
    let trueTypes = {
        nodeUId: nodeUIdTypeHandler.getTrueTypedVariable() as string,
        newName: newNameTypeHandler.getTrueTypedVariable() as string
    }

    console.log(`Attempting to rename node with UId '${trueTypes.nodeUId}' to '${trueTypes.newName}' `)

	try {

        await treeManager.validateNodeUId(nodeUId)
		await treeManager.changeNodeName(trueTypes.nodeUId, trueTypes.newName)

        console.log(`PATCH successful`)
		return json({ status: 200 })

	} catch (err) {
		if (err instanceof Error) {
			throw error(500, { message: err.message })
		}
	}

	throw unknownInternalError("PATCH", url)


}