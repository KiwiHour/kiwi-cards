<script lang="ts">
    import type { Database } from "$lib/schema";
    import { getExpandedFolderUIDs } from "$lib/functions";
    import { onMount } from "svelte";
    import Deck from "./Deck.svelte";
	import iconPaths from "$lib/icon-paths";

	export let arrayedNode: any // i give up
	export let expanded: boolean

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
	let [ folder, children ] = arrayedNode as Database.ArrayedNode<"folder">

	onMount(() => {
		expandedFolderUIds = getExpandedFolderUIDs(sessionStorage)
	})

</script>

<div class="folder" id={folder.UId}>

	<button type="button" class="name-and-button" on:click={toggleFolder}>
		<img class="toggle-indicator" id="folder-icon" src={expanded ? iconPaths["folder-open"] : iconPaths["folder-closed"] } alt="folder icon">
		<p>{folder.name}</p>
	</button>
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
		margin: 0;
	}

	.folder {
		display: flex;
		flex-direction: column;
		align-items: start;
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
		background-color: lightgray;
	}

	.toggle-indicator {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;
		padding-right: 10px;
	}

	.name-and-button img {
		width: 30px;
		height: 30px;
	}

	.folder-contents {
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: center;
		width: 100%;
		margin-left: 1vw;
	}

</style>