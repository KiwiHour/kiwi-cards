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

<div class="deck">

	<button type="button" id={deck.UId} class="name-and-button{focused ? ' focused' : ''}" on:click={openDeck} on:focus={handleFocus}>
		<img class="toggle-indicator" id="deck-icon" src={open ? iconPaths.dark["deck-open"] : iconPaths.dark["deck-closed"] } alt="deck icon">
		<p>{deck.name}</p>
	</button>
</div>

<style>

	p {
		margin: 0;
		white-space: nowrap;
	}

	.deck {
		display: flex;
		flex-direction: column;
		align-items: start;
		margin-left: 0.3vw;
	}

	.name-and-button {
		border: none;
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: center;
		padding: 5px 15px;;
		font-size: 1.2em;
		background-color: transparent;
	}

	.focused {
		background-color: rgb(192, 192, 192) !important;
	}

	.name-and-button:hover {
		background-color: rgb(139, 139, 139);
	}

	.toggle-indicator {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;
		padding-right: 10px;
	}

	.name-and-button img {
		width: 25px;
		height: 25px;
	}


</style>