<script lang="ts">
    import type { Database } from "$lib/schema";

	import { createEventDispatcher } from "svelte";
    import ContextMenu from "./ContextMenu.svelte";

	export let arrayedNode: any // i give up
	export let nodeSelectEvent: { nodeUId: string, type: "folder" | "deck", clickType: "left" | "right" } | null
	export let openDeckUId: string | null;
	export let depth: number;

	function openDeck() {
		console.log("open deck")
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
	
	let [ deck, cardUIds ] = arrayedNode as Database.ArrayedNode<"deck">
	let dispatch = createEventDispatcher()
	let open: boolean
	let blurred: boolean;
	let showContextMenu = false;
	let rightClickPos: { x: number, y: number }

	$: open = openDeckUId == deck.UId
	$: focused = nodeSelectEvent?.nodeUId == deck.UId
	$: blurred = nodeSelectEvent?.nodeUId == deck.UId && blurred

</script>

{#if showContextMenu}
	<ContextMenu on:clicked-off-context-menu={() => showContextMenu = false} pos={rightClickPos} node={deck}/>
{/if}

<div class="deck node" id={deck.UId}>

	<button type="button" class="name-and-button {focused ? 'focused' : ''} {blurred ? 'blurred' : ''} {open ? 'open' : ''}" on:click={openDeck} on:focus={handleFocus} on:blur={handleBlur} on:contextmenu|preventDefault|stopPropagation={handleRightClick}>
		<div class="button-contents" style="padding-left: {(depth) * 1}vw;">
			<img class="toggle-indicator" id="deck-icon" alt="deck icon" style="scale: 0.8">
			<p class="prevent-select">{deck.name}</p>
		</div>
	</button>
</div>

<style>

	@import "$lib/css/directory-node.css";

</style>