<script lang="ts">
    import iconPaths from "$lib/icon-paths";
    import type { Database } from "$lib/schema";

	export let arrayedNode: any // i give up

	function openDeck() {
		open = !open
	}



	let [ deck, cardUIds ] = arrayedNode as Database.ArrayedNode<"deck">
	let open = false

</script>

<div class="deck">

	<button type="button" class="name-and-button" on:click={openDeck}>
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
		padding: 5px 15px;;
		font-size: 1.2em;
		background-color: transparent;
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