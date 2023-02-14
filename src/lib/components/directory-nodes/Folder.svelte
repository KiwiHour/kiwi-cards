<script lang="ts">
    import { getExpandedFolderUIDs } from "$lib/functions";
    import type { Database } from "$lib/schema";
    import { onMount } from "svelte";
    import Deck from "./Deck.svelte";

	export let arrayedNode: any // i give up
	export let expanded: boolean
	let [ folder, children ] = arrayedNode as Database.ArrayedNode<"folder">

	function toggleFolder() {
		expanded = !expanded
		expandedFolderUIds = getExpandedFolderUIDs(sessionStorage)
		if (expanded) {
			expandedFolderUIds.push(folder.UId)
		} else {
			expandedFolderUIds = expandedFolderUIds.filter(UId => UId != folder.UId)
		}
		sessionStorage.setItem("expanded-folder-uids", JSON.stringify(expandedFolderUIds))
	}

	let expandedFolderUIds: string[] = []

	onMount(() => {
		expandedFolderUIds = getExpandedFolderUIDs(sessionStorage)
	})

</script>

<div class="folder" id={folder.UId}>

	<div class="name-and-button">
		<input class="toggle-folder-btn" id="toggle-folder-{folder.UId}" type="button" value={expanded ? "-" : "+"} on:click={toggleFolder}>
		<p>{folder.name}</p>
	</div>
	<div class="folder-contents">
		{#if expanded}
			{#each children as [child, grandChildren]}
				{#if child.type == "folder"}
					<svelte:self arrayedNode={[child, grandChildren]} expanded={expandedFolderUIds.includes(child.UId)} />
				{:else if child.type == "deck"}
					<Deck arrayedNode={[child, grandChildren]} />
				{/if}
			{/each}
		{/if}
	</div>
</div>

<style>

	p {
		padding: 0;
		margin: 0;
	}

	.name-and-button {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 5px;
	}

	.folder-contents {
		margin-left: 1%;
	}
	
	.toggle-folder-btn {
		width: 2em;
		height: 2em;
	}

</style>