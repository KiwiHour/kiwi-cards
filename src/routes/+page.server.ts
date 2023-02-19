import { DirectoryTreeManager } from '$lib/classes';
import type { Database } from '$lib/schema';
import type { PageServerLoad } from './$types';

let getTree = async (node: Database.DirectoryNode, treeManager: DirectoryTreeManager): Promise<Database.ArrayedNode<"folder" | "deck">> => {
    let children = await treeManager.getChildren(node.UId)
	return [
        node,
        await Promise.all(children.map(async child => {
            if (child.type == "deck") {
                return [child, child.childrenUIds]
            }
            return await getTree(child, treeManager) 
        }))
    ]
}

export const load: PageServerLoad = async ({ locals }) => {

    let directoryTreeManager = new DirectoryTreeManager(locals.connectedMongoClient)
    let rootNodes: Database.DirectoryNode[] = await directoryTreeManager.getChildren(null) // top level nodes
    
    let fileTree = await Promise.all(rootNodes.map(rootNode => getTree(rootNode, directoryTreeManager)))

    return { fileTree } as { fileTree: Database.ArrayedNode<"folder" | "deck">[] }

}