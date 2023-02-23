<script lang="ts">
    import type { Database } from "$lib/types";

	export let node: Database.DirectoryNode
	export let cards: Database.Card[]

</script>

<h1>{node.name}</h1>
<h2>{node.UId}</h2>
{#each cards as card}
	{JSON.stringify(card)}
{/each}