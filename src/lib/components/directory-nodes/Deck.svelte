<script lang="ts">
    import type { Database } from "$lib/schema";

	import { createEventDispatcher } from "svelte";
    import iconPaths from "$lib/icon-paths";

	export let arrayedNode: any // i give up
	export let nodeSelectEvent: { nodeUId: string, type: "folder" | "deck" } | null
	export let openDeckUId: string | null;
	export let depth: number;

	function openDeck() {
		
	}

	function handleFocus() {
		dispatch("node-click", { nodeUId: deck.UId, type: "deck" })
	}
	
	let [ deck, cardUIds ] = arrayedNode as Database.ArrayedNode<"deck">
	let dispatch = createEventDispatcher()
	let open: boolean

	$: open = openDeckUId == deck.UId
	$: focused = nodeSelectEvent?.nodeUId == deck.UId

</script>

<div class="deck node">

	<button type="button" id={deck.UId} class="name-and-button{focused ? ' focused' : ''}" on:click={openDeck} on:focus={handleFocus}>
		<div class="button-contents" style="padding-left: {(depth) * 1}vw;">
			<img class="toggle-indicator" id="deck-icon" src={open ? iconPaths.dark["deck-open"] : iconPaths.dark["deck-closed"] } alt="deck icon" style="scale: 0.8">
			<p class="prevent-select">{deck.name}</p>
		</div>
	</button>
</div>

<style>

	@import "$lib/css/directory-node.css";

</style>