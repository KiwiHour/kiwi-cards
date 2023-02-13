<script lang="ts">
    import type { Database } from "$lib/schema";

	export let arrayedNode: any // i give up
	let [ deck, cardUIds ] = arrayedNode as Database.ArrayedNode<"deck">

	console.log("IM A DECK")

</script>

<div class="deck">
	{deck.name}
</div>