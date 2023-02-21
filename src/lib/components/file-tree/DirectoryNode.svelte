<script lang="ts">

    import type { ContextMenuOptions, Database } from "$lib/types";
    import { deleteNode, getExpandedFolderUIDs, renameNode, sortTopLevelNodes } from "$lib/functions"
    import { createEventDispatcher, onMount } from "svelte";
    import { invalidateAll } from "$app/navigation";
    import ContextMenu from "../ContextMenu.svelte";

	// any node
	function handleFocus() {
		blurred = false
		dispatch("node-click", { nodeUId: node.UId, type: node.type })
	}

	function handleBlur() {
		blurred = true
	}

	function handleRightClick(event: MouseEvent) {
		rightClickPos = { x: event.clientX, y: event.clientY }
		showContextMenu = true;
	}

	function autofocus(el: HTMLElement) {
		el.focus()
	}

	// folders
	function toggleFolder() {
		expanded = !expanded
		expandedFolderUIds = getExpandedFolderUIDs(sessionStorage)
		if (expanded) {
			expandedFolderUIds.push(node.UId)
		} else {
			expandedFolderUIds = expandedFolderUIds.filter(UId => UId != node.UId)
		}
		sessionStorage.setItem("expanded-folder-uids", JSON.stringify(expandedFolderUIds))
	}

	// deck
	function openDeck() {
		dispatch("node-click", { nodeUId: node.UId, type: "deck", clickType: "left" })
	}

	// context menu handlers

	async function handleNewNameSubmit(event: KeyboardEvent) {
		if (event.key == "Enter") {
			if (!newName || newName.trim() == "" || newName == node.name) {
				newName = node.name
				renaming = false;
				return;
			}
			let [_, err] = await renameNode(node.UId, newName)
			invalidateAll()
			if (err) { alert(err) }
		}
	}

	let deckContextMenuOptions: ContextMenuOptions = [
		{ name: "Rename", function: () => renaming = true },
		{ name: "Delete", function: async () => {
			let [_, err] = await deleteNode(node.UId)
			invalidateAll()
			if (err) { alert(err) }
		}},
	]
	
	let folderContextMenuOptions: ContextMenuOptions = [
		...deckContextMenuOptions,
		// folder specific functions
		{ name: "New folder", function: () => newNodeType = "folder" },
		{ name: "New deck", function: () => newNodeType = "deck" }
	]

	export let arrayedNode: Database.ArrayedNode<"deck" | "folder">
	export let nodeSelectEvent: { nodeUId: string, type: "folder" | "deck", clickType: "left" | "right" } | null
	export let openDeckUId: string | null
	export let depth: number;

	let dispatch = createEventDispatcher()
	let [node, children] = arrayedNode as [Database.DirectoryNode, any] // R.I.P

	let	open: boolean, 
		focused: boolean, 
		blurred: boolean, 
		expanded: boolean,
		expandedFolderUIds: string[],
		renaming: boolean,
		newName: string = node.name,
		newNodeType: "folder" | "deck" | null = null;
		
	let	showContextMenu: boolean = false,
		rightClickPos: { x: number, y: number };

	let contextMenuOptions = node.type == "folder" ? folderContextMenuOptions : deckContextMenuOptions;

	$: open = openDeckUId == node.UId // only useful for decks, but a folder will never have a deck uid so all good
	$: focused = nodeSelectEvent?.nodeUId == node.UId && !blurred
	$: blurred = nodeSelectEvent?.nodeUId == node.UId && blurred;
	$: classes = `${focused ? 'focused' : ''} ${blurred ? 'blurred' : ''} ${open || expanded ? 'open' : ''}`

	onMount(() => {
		expandedFolderUIds = getExpandedFolderUIDs(sessionStorage)
		expanded = node.type == "folder" ? expandedFolderUIds.includes(node.UId) : false
	})

</script>

{#if showContextMenu}
	<ContextMenu on:close-context-menu={async () => showContextMenu = false} pos={rightClickPos} options={contextMenuOptions}/>
{/if}

<div class="node {node.type}" id={node.UId}>

	<button
		on:click={node.type == "deck" ? openDeck : toggleFolder}
		on:focus={handleFocus}
		on:blur={handleBlur}
		on:contextmenu|preventDefault|stopPropagation={handleRightClick}
		disabled={renaming}
		type="button" class="name-and-button {classes}"
	>
		<div class="button-contents" style="padding-left: {(depth) * 1}vw;">
			<img class="toggle-indicator" id="deck-icon" alt="deck icon" style="scale: 0.8">
			{#if renaming}
				<input id="rename-input" use:autofocus
					on:blur={() => {renaming = false}}
					on:keypress={handleNewNameSubmit} 
					bind:value={newName}
					type="text" />
			{:else}
				<p class="prevent-select">{node.name}</p>
			{/if}
		</div>
	</button>

	{#if node.type == "folder"}

		<div class="folder-contents">

			{#if node.type == "folder"}
				<svelte:self on:node-click depth={depth + 1} {arrayedNode} {nodeSelectEvent} {openDeckUId}/>
			{/if}

			{#if expanded}
				{#each sortTopLevelNodes(children) as arrayedNode}
					<svelte:self on:node-click depth={depth + 1} {arrayedNode} {nodeSelectEvent} {openDeckUId}/>
				{/each}
			{/if}

		</div>	

	{/if}

</div>

<style>

	@import "$lib/css/directory-node.css";

</style>