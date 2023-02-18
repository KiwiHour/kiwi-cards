<script lang="ts">
    import type { Database } from "$lib/schema";

	import { createEventDispatcher } from "svelte";
    import iconPaths from "$lib/icon-paths";

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

	// was it a left click? if so, was it on me. If so, then im now open. if it was a right click i keep my current state (open / closed)
	$: open = nodeSelectEvent?.clickType == "left" ? nodeSelectEvent.nodeUId == deck.UId : open
	$: focused = nodeSelectEvent?.nodeUId == deck.UId
	$: blurred = nodeSelectEvent?.nodeUId == deck.UId && blurred

</script>

<div class="deck node" on:contextmenu|preventDefault|stopPropagation={handleRightClick}>

	<button type="button" id={deck.UId} class="name-and-button {focused ? 'focused' : ''} {blurred ? 'blurred' : ''}" on:click={openDeck} on:focus={handleFocus} on:blur={handleBlur}>
		<div class="button-contents" style="padding-left: {(depth) * 1}vw;">
			<img class="toggle-indicator" id="deck-icon" src={open ? iconPaths.dark["deck-open"] : iconPaths.dark["deck-closed"] } alt="deck icon" style="scale: 0.8">
			<p class="prevent-select {open ? "bold underline" : ""}">{deck.name}</p>
		</div>
	</button>
</div>

<style>

	@import "$lib/css/directory-node.css";

</style>