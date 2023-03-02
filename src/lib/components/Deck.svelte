<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import type { Database } from "$lib/types";

	import Card from "./Card.svelte"

	export let deck: Database.DirectoryNode
	export let cards: Database.Card[]

	console.log(cards)

</script>

<div class="deck">
	<h1>{deck.name}</h1>
	<h2>{deck.UId}</h2>

	<form method="post" action="?/add-new-card" use:enhance={async() => await invalidateAll()}>
		<input type="hidden" name="deck-uid" value={deck.UId}>
		<input type="submit" value="New card">
	</form>

	{#each cards as card}
		<Card {card} />
	{/each}
</div>