import { invalidateAll } from '$app/navigation';
import { Card, Db, Deck, DirectoryTreeManager } from '$lib/classes';
import type { Database } from '$lib/types';
import type { Actions } from '@sveltejs/kit';
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
		})) as any
	]
}

export const load: PageServerLoad = async ({ locals }) => {

	let db = new Db(locals.connectedMongoClient)
	let directoryTreeManager = new DirectoryTreeManager(locals.connectedMongoClient)
	let rootNodes: Database.DirectoryNode[] = await directoryTreeManager.getChildren(null) // top level nodes
	let allNodes: Database.DirectoryNode[] = await db.directoryNodesCollection.find({}).toArray()

	let fileTree: Database.ArrayedNode<"folder" | "deck">[] = await Promise.all(rootNodes.map(rootNode => getTree(rootNode, directoryTreeManager)))
	let cards: Database.Card[] = await db.cardsCollection.find({}).toArray()
	cards = cards.map(card => { card._id = ""; return card })
	allNodes = allNodes.map(node => { node._id = ""; return node })

	return { fileTree, cards, allNodes }

}

export const actions: Actions = {

	"add-new-card": async ({ request, locals }) => {
		let formData = await request.formData()
		let deckUId = formData.get("deck-uid") as string

		let deck = new Deck(locals.connectedMongoClient, deckUId)
		let newCard = await deck.newBlankCard()
		await deck.addCard(newCard)

		return { success: true }

	},

	"delete-card": async ({ request, locals }) => {
		let formData = await request.formData()
		let cardUId = formData.get("card-uid") as string
		let deckUId = formData.get("deck-uid") as string

		let deck = new Deck(locals.connectedMongoClient, deckUId)
		await deck.deleteCard(cardUId)

		return { success: true }
	}

};