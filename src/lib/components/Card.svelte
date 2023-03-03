<script lang="ts">
    import type { Database } from "$lib/types";
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";

    export let card: Database.Card;

	let isLoading = false;

</script>

<div class="card" id={card.UId}>
	
	{#if isLoading}
	<img class="loading-spinner" alt="loading icon" style="width: 25px" />
{/if}

    <div id="front">
        <input type="text" value={card.front} />
    </div>
    <div id="back">
        <input type="text" value={card.back} />
    </div>
	
	<form method="post" action="?/delete-card" use:enhance={() => {
		isLoading = true
		return async ({ result }) => {
			isLoading = false
			if (result.type == "success") {
				await invalidateAll()
			}
		}
	}}>
		<input type="hidden" name="deck-uid" value={card.deckUId} />
		<input type="hidden" name="card-uid" value={card.UId} />
		<input type="submit" value="Delete">
	</form>
</div>