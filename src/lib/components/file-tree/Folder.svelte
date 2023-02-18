<script lang="ts">
    import type { Database } from "$lib/schema";

    import { getExpandedFolderUIDs, sortTopLevelNodes } from "$lib/functions";
    import { createEventDispatcher } from "svelte";
    import { onMount } from "svelte";
    import Deck from "./Deck.svelte";

	export let arrayedNode: any // i give up
	export let expanded: boolean
	export let nodeSelectEvent: { nodeUId: string, type: "folder" | "deck", clickType: "left" | "right" } | null
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

	function handleRightClick(event: MouseEvent) {
		console.log(`I am folder ${folder.UId}, i will eventually open up a menu to delete, rename or add a folder/deck`)
	}

	function handleFocus(event: FocusEvent) {
		dispatch("node-click", { nodeUId: folder.UId, type: "folder" })
		blurred = false
	}

	function handleBlur() {
		blurred = true
	}

	let [ folder, children ] = arrayedNode as Database.ArrayedNode<"folder">
	let expandedFolderUIds: string[] = []
	let dispatch = createEventDispatcher()
	let blurred: boolean;

	$: blurred = nodeSelectEvent?.nodeUId == folder.UId && blurred;
	$: focused = nodeSelectEvent?.nodeUId == folder.UId

	onMount(() => {
		expandedFolderUIds = getExpandedFolderUIDs(sessionStorage)
	})

</script>

<div class="folder node" id={folder.UId} on:contextmenu|preventDefault|stopPropagation={handleRightClick}>

	<button type="button" class="name-and-button {focused ? 'focused' : ''} {blurred ? 'blurred' : ''} {expanded ? 'open' : ''}" on:click={(toggleFolder)} on:focus={handleFocus}  on:blur={handleBlur}>
		<div class="button-contents" style="padding-left: {(depth) * 1}vw;">
			<img class="toggle-indicator" id="folder-icon" alt="folder icon">
			<p class="prevent-select">{folder.name}</p>
		</div>
	</button>
	<div class="folder-contents">

		{#if expanded}
			{#each sortTopLevelNodes(children) as [child, grandChildren]}
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