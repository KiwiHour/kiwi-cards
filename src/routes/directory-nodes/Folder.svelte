<script lang="ts">
    import type { Database } from "$lib/schema";
    import Deck from "./Deck.svelte";

	export let arrayedNode: any // i give up
	let [ folder, children ] = arrayedNode as Database.ArrayedNode<"folder">

	let isFolderExpanded = false;

	function toggleFolder() {
		isFolderExpanded = !isFolderExpanded
	}

	console.log("IM A FOLDER: " + folder.name)
	console.log(`I HAVE ${JSON.stringify(children)}`)

</script>

<div class="folder">

	<input class="toggle-folder-btn" id="toggle-folder-{folder.name}" type="button" value={isFolderExpanded ? "-" : "+"} on:click={toggleFolder}>
	<label for="toggle-folder-{folder.name}">{folder.name}</label>
	<div class="folder-contents">
		{#if isFolderExpanded}
			{#each children as [child, grandChildren]}
				{#if child.type == "folder"}
					<svelte:self arrayedNode={[child, grandChildren]} />
				{:else if child.type == "deck"}
					<Deck arrayedNode={[child, grandChildren]} />
				{/if}
			{/each}
		{/if}
	</div>
</div>

<style>
	.folder-contents {
		transform: translateX(2%);
	}
	
	.toggle-folder-btn {
		width: 2em;
		height: 2em;
	}

</style>