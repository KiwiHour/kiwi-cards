let nodes = [
	[{name: "abc", type: "folder"}, []],
	[{name: "bcd", type: "folder"}, ["lol"]],
	[{name: "aaa", type: "deck"}, []],
	[{name: "b", type: "deck"}, ["ok"]]
]

let folders = nodes.filter(([node, _]) => node.type == "folder")
let decks = nodes.filter(([node, _]) => node.type == "deck")

let sorted = [
	...folders.sort(([a, _1], [b, _2]) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0),
	...decks.sort(([a, _1], [b, _2]) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
]

console.log(sorted)