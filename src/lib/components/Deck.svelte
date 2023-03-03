<script lang="ts">
    import type { Database } from "$lib/types";
    import { enhance } from "$app/forms";
    import { createEventDispatcher } from "svelte";
	import Card from "./Card.svelte"

	export let deck: Database.DirectoryNode
	export let cards: Database.Card[]

	let dispatch = createEventDispatcher()
	let isLoading = false;

</script>

<div class="deck">
	<h1>{deck.name}</h1>
	<h2>{deck.UId}</h2>

	{#if isLoading}
		<img class="loading-spinner" alt="loading icon" style="width: 25px" />
	{/if}
	
	<form method="post" action="?/add-new-card" use:enhance={() => {
		isLoading = true
		return async ({ result }) => {
			isLoading = false
			if (result.type == "success") {
				dispatch("refresh-page-contents")
			}
		}
	}}>
		<input type="hidden" name="deck-uid" value={deck.UId}>
		<input type="submit" value="New card">
	</form>

	{#each cards as card}
		<Card {card} />
	{/each}
</div>

<style>

	@import "$lib/css/deck.css";

</style>