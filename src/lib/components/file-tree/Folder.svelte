<script lang="ts">
    import type { Database } from "$lib/types";

    import { getExpandedFolderUIDs, sortTopLevelNodes, deleteNode, renameNode } from "$lib/functions";
    import { createEventDispatcher } from "svelte";
    import { invalidateAll } from "$app/navigation";
    import { onMount } from "svelte";
    import Deck from "./Deck.svelte";
    import ContextMenu from "../ContextMenu.svelte";

	export let arrayedNode: any // i give up
	export let nodeSelectEvent: { nodeUId: string, type: "folder" | "deck", clickType: "left" | "right" } | null
	export let openDeckUId: string | null
	export let depth: number;

	function toggleFolder() {
		
		expanded = !expanded
		expandedFolderUIds = getExpandedFolderUIDs(sessionStorage)
		if (expanded) {
			expandedFolderUIds.push(folder.UId)
		} else {
			expandedFolderUIds = expandedFolderUIds.filter(UId => UId != folder.UId)
		}
		sessionStorage.setItem("expanded-folder-uids", JSON.stringify(expandedFolderUIds))
	}

	function handleRightClick(event: MouseEvent) {
		console.log(`I am folder ${folder.UId}, i will eventually open up a menu to delete, rename or add a folder/deck`)
		rightClickPos = { x: event.clientX, y: event.clientY }
		showContextMenu = true;
	}

	function handleFocus(event: FocusEvent) {
		dispatch("node-click", { nodeUId: folder.UId, type: "folder" })
		blurred = false
	}

	function handleBlur() {
		blurred = true
	}

	function autofocus(el: HTMLElement) {
		el.focus()
	}

	let [ folder, children ] = arrayedNode as Database.ArrayedNode<"folder">
	let expandedFolderUIds: string[] = []
	let dispatch = createEventDispatcher()
	let blurred: boolean;
	let showContextMenu = false;
	let rightClickPos: { x: number, y: number }
	let renaming = false;
	let newName: string = folder.name;
	let expanded = false;

	$: blurred = nodeSelectEvent?.nodeUId == folder.UId && blurred;
	$: focused = nodeSelectEvent?.nodeUId == folder.UId

	let contextMenuConfig = [
			{ name: "Rename", function: () => renaming = true },
			{ name: "Delete", function: async () => {
				let [_, err] = await deleteNode(folder.UId)
				invalidateAll()
				if (err) { alert(err) }
			}},
		]
	

	async function handleNewNameSubmit(event: KeyboardEvent) {
		if (event.key == "Enter") {
			if (!newName || newName.trim() == "" || newName == folder.name) {
				newName = folder.name
				renaming = false;
				return;
			}
			let [_, err] = await renameNode(folder.UId, newName)
			invalidateAll()
			if (err) { alert(err) }
		}
	}

	onMount(() => {
		expandedFolderUIds = getExpandedFolderUIDs(sessionStorage)
		expanded = expandedFolderUIds.includes(folder.UId)
	})

</script>

{#if showContextMenu}
	<ContextMenu on:close-context-menu={async () => showContextMenu = false} pos={rightClickPos} options={contextMenuConfig}/>
{/if}

<div class="folder node" id={folder.UId} >

	<!-- keyup/keydown to stop spacebar/enter from toggling folder, as it messing with renaming -->
	<button
		on:click={(toggleFolder)}
		on:focus={handleFocus}
		on:blur={handleBlur}
		on:contextmenu|preventDefault|stopPropagation={handleRightClick}
		disabled={renaming}
		type="button" class="name-and-button {focused ? 'focused' : ''} {blurred ? 'blurred' : ''} {expanded ? 'open' : ''}"
	>
		<div class="button-contents" style="padding-left: {(depth) * 1}vw;">
			<img class="toggle-indicator" id="folder-icon" alt="folder icon">

			{#if renaming}
				<input id="rename-input" use:autofocus
					on:blur={() => {renaming = false}}
					on:keypress={handleNewNameSubmit} 
					bind:value={newName}
					type="text" />
			{:else}
				<p class="prevent-select">{folder.name}</p>
			{/if}
		</div>
	</button>
	<div class="folder-contents">

		{#if expanded}
			{#each sortTopLevelNodes(children) as [child, grandChildren]}
				{#if child.type == "folder"}
					<svelte:self on:node-click arrayedNode={[child, grandChildren]} {nodeSelectEvent} {openDeckUId} depth={depth + 1}/>
				{:else if child.type == "deck"}
					<Deck on:node-click arrayedNode={[child, grandChildren]} {nodeSelectEvent} {openDeckUId} depth={depth + 1}/>
				{/if}
			{/each}
		{/if}

	</div>	
</div>

<style>

	@import "$lib/css/directory-node.css";

</style>