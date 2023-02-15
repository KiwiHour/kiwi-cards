<script lang="ts">
    import type { Database } from "$lib/schema";

	import { createEventDispatcher } from "svelte";
    import iconPaths from "$lib/icon-paths";

	export let arrayedNode: any // i give up
	export let nodeSelectEvent: { nodeUId: string, type: "folder" | "deck" } | null
	export let openDeckUId: string | null;

	function openDeck() {
		
	}

	function handleFocus() {
		dispatch("node-click", { nodeUId: deck.UId, type: "deck" })
	}
	
	function handleNodeClick(event: any) {
		console.log(event)
	}

	let [ deck, cardUIds ] = arrayedNode as Database.ArrayedNode<"deck">
	let dispatch = createEventDispatcher()
	let open: boolean

	$: open = openDeckUId == deck.UId
	$: focused = nodeSelectEvent?.nodeUId == deck.UId

</script>

<div class="deck node">

	<button type="button" id={deck.UId} class="name-and-button{focused ? ' focused' : ''}" on:click={openDeck} on:focus={handleFocus}>
		<img class="toggle-indicator" id="deck-icon" src={open ? iconPaths.dark["deck-open"] : iconPaths.dark["deck-closed"] } alt="deck icon">
		<p>{deck.name}</p>
	</button>
</div>

<style>

	@import "$lib/css/directory-node.css";

	.deck {
		margin-left: 0.3vw;
	}

	.name-and-button img {
		width: 25px;
		height: 25px;
	}


</style>