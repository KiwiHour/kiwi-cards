import { DirectoryTreeManager } from '$lib/classes';
import type { Database } from '$lib/schema';
import type { PageServerLoad } from './$types';

type FileTree = Database.DirectoryNode[]
type ArrayedNode = [Database.DirectoryNode, Database.DirectoryNode[]]

let getTree = async (node: Database.DirectoryNode, treeManager: DirectoryTreeManager): Promise<ArrayedNode> => {
    let children = await treeManager.getChildren(node.UId)
	return [
        node,
        await Promise.all(children.map(async child => {
            if (child.type == "deck") {
                return child.childrenUIds
            }
            return await getTree(child, treeManager) 
        }))
    ] as any
}

export const load: PageServerLoad = async ({ locals }) => {

    let directoryTreeManager = new DirectoryTreeManager(locals.connectedMongoClient)
    let rootNodes: FileTree = await directoryTreeManager.getChildren(null) // top level nodes
    
    let fileTree = await Promise.all(rootNodes.map(async rootNode => await getTree(rootNode, directoryTreeManager)))

    return { fileTree } as { fileTree: ArrayedNode[] }

}