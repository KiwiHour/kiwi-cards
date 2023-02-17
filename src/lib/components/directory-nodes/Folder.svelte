<script lang="ts">
    import type { Database } from "$lib/schema";

    import { createEventDispatcher } from "svelte";
    import { getExpandedFolderUIDs } from "$lib/functions";
    import { onMount } from "svelte";
    import Deck from "./Deck.svelte";
	import iconPaths from "$lib/icon-paths";

	export let arrayedNode: any // i give up
	export let expanded: boolean
	export let nodeSelectEvent: { nodeUId: string, type: "folder" | "deck" } | null
	export let openDeckUId: string | null
	export let depth: number;

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

	function handleFocus() {
		dispatch("node-click", { nodeUId: folder.UId, type: "folder" })
	}

	let [ folder, children ] = arrayedNode as Database.ArrayedNode<"folder">
	let expandedFolderUIds: string[] = []
	let dispatch = createEventDispatcher()

	$: focused = nodeSelectEvent?.nodeUId == folder.UId

	onMount(() => {
		expandedFolderUIds = getExpandedFolderUIDs(sessionStorage)
	})

</script>

<div class="folder node" id={folder.UId}>

	<button type="button" class="name-and-button{focused ? ' focused' : ''}" on:click={(toggleFolder)} on:focus={handleFocus}>
		<div class="button-contents" style="padding-left: {(depth) * 1}vw;">
			<img class="toggle-indicator" id="folder-icon" src={expanded ? iconPaths.dark["folder-open"] : iconPaths.dark["folder-closed"] } alt="folder icon">
			<p  class="prevent-select">{folder.name}</p>
		</div>
	</button>
	<div class="folder-contents">

		{#if expanded}
			{#each children as [child, grandChildren]}
				{#if child.type == "folder"}
					<svelte:self on:node-click arrayedNode={[child, grandChildren]} expanded={expandedFolderUIds.includes(child.UId)} {nodeSelectEvent} {openDeckUId} depth={depth + 1}/>
				{:else if child.type == "deck"}
					<Deck on:node-click arrayedNode={[child, grandChildren]} {nodeSelectEvent} {openDeckUId} depth={depth + 1}/>
				{/if}
			{/each}
		{/if}

	</div>
</div>

<style>

	@import "$lib/css/directory-node.css";

</style>