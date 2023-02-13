import type { DatabaseDirectory } from "./src/lib/schema"

let mockDirectoryTree: DatabaseDirectory.Node<"root"> = {
	UId: "root",
	name: "root",
	type: "root",
	children: [
		{ UId: "y1", name: "Year 1", type: "folder", children: [
			{ UId: "as1", name: "Semester 1", type: "folder", children: [
				{ UId: "ac1", name: "COM1001", type: "deck", children: [

				]},
				{ UId: "ac3", name: "COM1003", type: "deck", children: [

				]}
			]},
			{ UId: "as2", name: "Semester 2", type: "folder", children: [
				{ UId: "abc5", name: "COM1005", type: "deck", children: [
					"cardUID", "card2UID"
				]}
			]}
		]},
		{ UId: "y2", name: "Year 2", type: "folder", children: [
			{ UId: "bs1", name: "Semester 1", type: "folder", children: [

			]},
			{ UId: "bs2", name: "Semester 2", type: "folder", children: [
				{ UId: "ac1", name: "COM1001", type: "deck", children: [

				]},
				{ UId: "ac3", name: "COM1003", type: "deck", children: [

				]}
			]}
		]}
	]
}

// finds topmost deck (first node in each level)

let currentNode: DatabaseDirectory.Node = mockDirectoryTree
while (currentNode.type !== "deck" && currentNode.children.length > 0) {
	currentNode = (currentNode as DatabaseDirectory.Node<Exclude<DatabaseDirectory.NodeType, "deck">>).children[0]
}

console.log(currentNode)

