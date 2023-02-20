<script lang="ts">
	import type { Database } from "$lib/types";
	
	import { createEventDispatcher } from "svelte";
    import { invalidateAll } from "$app/navigation";
	import { deleteNode, renameNode } from "$lib/functions";
    import ContextMenu from "../ContextMenu.svelte";

	export let arrayedNode: any // i give up
	export let nodeSelectEvent: { nodeUId: string, type: "folder" | "deck", clickType: "left" | "right" } | null
	export let openDeckUId: string | null;
	export let depth: number;

	function openDeck() {
		dispatch("node-click", { nodeUId: deck.UId, type: "deck", clickType: "left" })
	}

	function handleRightClick(event: MouseEvent) {
		console.log(`I am deck ${deck.UId}, i will eventually open up a menu to delete, rename or add a folder/deck`)
		rightClickPos = { x: event.clientX, y: event.clientY }
		showContextMenu = true;
	}

	function handleFocus() {
		blurred = false
		dispatch("node-click", { nodeUId: deck.UId, type: "deck" })
	}

	function handleBlur() {
		blurred = true
	}

	
	function autofocus(el: HTMLElement) {
		el.focus()
	}
	
	let [ deck, cardUIds ] = arrayedNode as Database.ArrayedNode<"deck">
	let dispatch = createEventDispatcher()
	let open: boolean
	let blurred: boolean;
	let showContextMenu = false;
	let rightClickPos: { x: number, y: number }
	let renaming = false;
	let newName: string = deck.name;

	$: open = openDeckUId == deck.UId
	$: focused = nodeSelectEvent?.nodeUId == deck.UId
	$: blurred = nodeSelectEvent?.nodeUId == deck.UId && blurred

	let contextMenuConfig = [
			{ name: "Rename", function: () => renaming = true },
			{ name: "Delete", function: async () => {
				let [_, err] = await deleteNode(deck.UId)
				invalidateAll()
				if (err) { alert(err) }
			}}
		]

	async function handleNewNameSubmit(event: KeyboardEvent) {
		if (event.key == "Enter") {
			if (!newName || newName.trim() == "" || newName == deck.name) {
				newName = deck.name
				renaming = false;
				return;
			}
			let [_, err] = await renameNode(deck.UId, newName)
			invalidateAll()
			if (err) { alert(err) }
		}
	}

</script>

{#if showContextMenu}
	<ContextMenu on:close-context-menu={async () => showContextMenu = false} pos={rightClickPos} options={contextMenuConfig}/>
{/if}

<div class="deck node" id={deck.UId}>

	<button
		on:click={openDeck}
		on:focus={handleFocus}
		on:blur={handleBlur}
		on:contextmenu|preventDefault|stopPropagation={handleRightClick}
		disabled={renaming}
		type="button" class="name-and-button {focused ? 'focused' : ''} {blurred ? 'blurred' : ''} {open ? 'open' : ''}"
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
				<p class="prevent-select">{deck.name}</p>
			{/if}
		</div>
	</button>
	</div>

<style>

	@import "$lib/css/directory-node.css";

</style>