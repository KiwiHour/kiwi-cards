<script lang="ts">
    import type { ActionResult } from "@sveltejs/kit";
    import type { Database } from "$lib/types";
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";

	function handleFormSubmit() {
		isLoading = true
		return async ({ result }: { result: ActionResult }) => {
			if (result.type == "success") {
				await invalidateAll()
			}
			isLoading = false
		}
	}

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

	<form method="post" action="?/delete-card" use:enhance={handleFormSubmit}>
		<input type="hidden" name="deck-uid" value={card.deckUId} />
		<input type="hidden" name="card-uid" value={card.UId} />
		<input type="submit" value="Delete">
	</form>
</div>