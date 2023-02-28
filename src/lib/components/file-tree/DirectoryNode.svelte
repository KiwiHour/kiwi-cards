<script lang="ts">

    import type { ContextMenuOptions, Database } from "$lib/types";
    import { addNode, deleteNode, generateNewNode, getExpandedFolderUIDs, moveNode, renameNode, sortTopLevelNodes } from "$lib/functions"
    import { createEventDispatcher, onMount } from "svelte";
    import { invalidateAll } from "$app/navigation";
    import ContextMenu from "../ContextMenu.svelte";

	// any node
	function handleFocus() {
		blurred = false
		dispatch("node-click", { node })
	}

	function handleBlur() {
		blurred = true
	}

	function handleRightClick(event: MouseEvent) {
		if (isDisabled) { return }
		rightClickPos = { x: event.clientX, y: event.clientY }
		showContextMenu = true;
	}

	function autofocus(el: HTMLElement) {
		el.focus()
	}

	function setIsLoading(isLd: boolean, nodeUId: string) {
		dispatch("is-loading", { isLoading: isLd, nodeUId })
	}

	function handleDragStart(event: DragEvent) {
		event.dataTransfer?.setData("dragged-node-uid", node.UId)
		event.dataTransfer?.setData("current-parent-uid", node.parentUId ?? "null")

		let nodeElement = document.getElementById(node.UId)?.children[0].cloneNode(false) as HTMLDivElement
		event.dataTransfer?.setDragImage(nodeElement, 0, 0)
	}

	async function handleDrop(event: DragEvent) {
		console.log(`dropped`); console.log(event)
		console.log(`${event.dataTransfer?.getData("dragged-node-uid")} was dragged`)

		let newParentUId = node.type == "folder" ? node.UId : node.parentUId // if drag onto a folder, move into folder, if drag onto deck, move into that deck's folder
		let toMoveNodeUId = event.dataTransfer?.getData("dragged-node-uid") as string
		let currentParentUId = event.dataTransfer?.getData("current-parent-uid") as string | null

		currentParentUId = currentParentUId == "null" ? null : currentParentUId  // retype null
		
		if (toMoveNodeUId == node.UId) { return }
		if (newParentUId == currentParentUId) { return }

		setIsLoading(true, toMoveNodeUId)
		if (node.type == "folder") {
			expanded = true
			addFolderToExpandedList(node.UId)
		}
		let [_, err] = await moveNode(newParentUId, toMoveNodeUId)
		await invalidateAll()
		setIsLoading(false, toMoveNodeUId)
		if (err) { alert(err) }
	}

	// folders
	function toggleFolder() {
		if (node.UId == "new-node") { return }
		expanded = !expanded
		expandedFolderUIds = getExpandedFolderUIDs(sessionStorage)
		if (expanded) {
			expandedFolderUIds.push(node.UId)
		} else {
			expandedFolderUIds = expandedFolderUIds.filter(UId => UId != node.UId)
		}
		sessionStorage.setItem("expanded-folder-uids", JSON.stringify(expandedFolderUIds))
	}

	function addFolderToExpandedList(folderUId: string) {
		if (folderUId == "new-node") { return }
		expandedFolderUIds = getExpandedFolderUIDs(sessionStorage)
		expandedFolderUIds.push(folderUId)
		sessionStorage.setItem("expanded-folder-uids", JSON.stringify(expandedFolderUIds))
	}

	// deck
	function openDeck() {
		dispatch("node-click", { node, clickType: "left" })
	}

	// context menu handlers

	async function handleNewNameSubmit(event: KeyboardEvent) {
		if (event.key == "Enter") {
			if (!newName || newName.trim() == "" || newName == node.name) {
				newName = node.name
				renaming = false;
				return;
			}
			setIsLoading(true, node.UId)
			let [_, err] = await renameNode(node.UId, newName)
			await invalidateAll()
			setIsLoading(false, node.UId)
			if (err) { alert(err) }
		}
	}

	function handleNewNameKeyup(event: KeyboardEvent) {
		if (event.key == "Escape") {
			newName = node.name
			renaming = false;
			return;
		}
	}

	async function handleNewNodeNameSubmit(event: KeyboardEvent) {
		if (event.key == "Enter") {
			if (!newNodeName || newNodeName.trim() == "" ) {
				dispatch("remove-new-node")
				return;
			}
			// update name so it seem as if there is no delay
			setIsLoading(true, node.UId)
			isNew = true
			node.name = newNodeName
			
			let [newNodeUId, err] = await addNode(node.parentUId, newNodeName, node.type)
			node.parentUId ? addFolderToExpandedList(node.parentUId) : ""
			await invalidateAll()
			dispatch("added-new-node")
			setIsLoading(false, node.UId)
			isNew = false;
			if (err) { alert(err) }
		}
	}

	function handleNewNodeNameKeyup(event: KeyboardEvent) {
		if (event.key == "Escape") {
			dispatch("remove-new-node")
			return;
		}
	}

	let deckContextMenuOptions: ContextMenuOptions = [
		{ name: "Rename", function: () => renaming = true },
		{ name: "Delete", function: async () => {
			if (confirm(`Are you sure you want to delete the ${node.type} '${node.name}'`)) {
				setIsLoading(true, node.UId)
				let [_, err] = await deleteNode(node.UId)
				await invalidateAll()
				setIsLoading(false, node.UId)
				if (err) { alert(err) }
			}
		}},
	]
	
	let folderContextMenuOptions: ContextMenuOptions = [
		// folder specific functions
		{ name: "New Folder", function: () => {
			newNode = generateNewNode("folder", node.UId) 
		}},
		{ name: "New Deck", function: () => {
			newNode = generateNewNode("deck", node.UId)
		}},
		...deckContextMenuOptions,
	]

	export let arrayedNode: Database.ArrayedNode<"deck" | "folder">
	export let nodeSelectEvent: { nodeUId: string, type: "folder" | "deck", clickType: "left" | "right" } | null
	export let openDeckUId: string | null
	export let depth: number;
	export let isNew: boolean;
	export let isDisabled: boolean;
	export let loadingNodeUId: string | null;

	let dispatch = createEventDispatcher()
	let [node, children] = arrayedNode as [Database.DirectoryNode, any] // R.I.P

	let	open: boolean, 
		focused: boolean, 
		blurred: boolean, 
		renaming: boolean,
		newName: string = node.name,
		newNode: Database.DirectoryNode | null = null,
		expanded: boolean,
		expandedFolderUIds: string[],
		newNodeName: string,
		isLoading: boolean = false;
		
	let	showContextMenu: boolean = false,
		rightClickPos: { x: number, y: number };

	let contextMenuOptions = node.type == "folder" ? folderContextMenuOptions : deckContextMenuOptions;

	$: open = openDeckUId == node.UId // only useful for decks, but a folder will never have a deck uid so all good
	$: focused = nodeSelectEvent?.nodeUId == node.UId && !blurred
	$: blurred = nodeSelectEvent?.nodeUId == node.UId && blurred;
	$: expanded = newNode !== null || expanded;
	$: isLoading = loadingNodeUId == node.UId;
	$: classes = `${focused ? 'focused' : ''} ${blurred ? 'blurred' : ''} ${open || expanded ? 'open' : ''} ${isLoading ? "loading" : ""}`

	onMount(() => {
		expandedFolderUIds = getExpandedFolderUIDs(sessionStorage)
		expanded = expandedFolderUIds.includes(node.UId)
	})

</script>

{#if showContextMenu}
	<ContextMenu on:close-context-menu={async () => showContextMenu = false} pos={rightClickPos} options={contextMenuOptions}/>
{/if}

<div
	on:dragstart|stopPropagation={handleDragStart}
	on:drop|stopPropagation={handleDrop}
	on:dragover|preventDefault
	class="node {node.type}" id={node.UId} draggable={!isLoading} >

	<button
		on:click={node.type == "deck" ? openDeck : toggleFolder}
		on:focus={handleFocus}
		on:blur={handleBlur}
		on:contextmenu|preventDefault|stopPropagation={handleRightClick}
		disabled={renaming || isLoading || isDisabled}
		type="button" class="name-and-button {classes}"
		draggable="true"
		on:dragstart={() => {}}
	>
		<div class="button-contents" style="padding-left: {(depth) * 1}vw;">
			<img class="toggle-indicator" alt="node icon">
			{#if renaming}

				<input id="rename-input" use:autofocus
					on:blur={() => {renaming = false}}
					on:keypress={handleNewNameSubmit} 
					on:keyup={handleNewNameKeyup}
					bind:value={newName}
					disabled={isLoading || isDisabled}
					type="text" />
					
			{:else if isNew}

				<input id="new-node-name-input" use:autofocus
					on:blur={() => {dispatch("remove-new-node")}}
					on:keypress={handleNewNodeNameSubmit} 
					on:keyup={handleNewNodeNameKeyup}
					bind:value={newNodeName}
					disabled={isLoading || isDisabled}
					type="text" />

			{:else}

				<p class="prevent-select">{node.name}</p>

			{/if}
		</div>
	</button>

	{#if node.type == "folder"}

		<div class="folder-contents">

			{#if expanded || newNode}
				{#if newNode}
					<svelte:self
						on:is-loading
						on:remove-new-node={() => newNode = null}
						on:node-click
						depth={depth + 1}
						isNew={true}
						arrayedNode={[newNode, []]}
						{isDisabled} {loadingNodeUId} {nodeSelectEvent} {openDeckUId}
					/>
				{/if}
				{#each sortTopLevelNodes(children) as arrayedNode}
					<svelte:self
						on:is-loading
						on:node-click 
						depth={depth + 1}
						isNew={false}
						{isDisabled} {loadingNodeUId} {arrayedNode} {nodeSelectEvent} {openDeckUId}
					/>
				{/each}
			{/if}

		</div>	

	{/if}

</div>

<style>

	@import "$lib/css/directory-node.css";

</style>