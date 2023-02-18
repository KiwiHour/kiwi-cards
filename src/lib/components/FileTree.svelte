<script lang="ts">
    import type { Database } from "$lib/schema";

    import { getExpandedFolderUIDs, sortTopLevelNodes } from "$lib/functions";
    import Deck from "./file-tree/Deck.svelte";
    import Folder from "./file-tree/Folder.svelte";

	export let fileTree: Database.ArrayedNode<"folder" | "deck">[]
	export let width: number | null;

	function handleNodeClick(event: CustomEvent) {
		nodeSelectEvent = event.detail
		if (event.detail.type == "deck" && event.detail.clickType == "left") {
			openDeckUId = event.detail.nodeUId
		}
	}

	let openDeckUId: string | null = null;
	let nodeSelectEvent: { nodeUId: string, type: "folder" | "deck", clickType: "left" | "right" } | null = null;
	let expandedFolderUIds = getExpandedFolderUIDs(sessionStorage)

</script>

<div class="file-tree" style="{width ? `width: ${width}px; min-width: ${width}px;` : ""}">
	
	<div class="folders outline">
		{#each sortTopLevelNodes(fileTree) as [node, children]}
	
			{#if node.type == "folder"}
				<Folder on:node-click={handleNodeClick} arrayedNode={[node, children]} expanded={expandedFolderUIds.includes(node.UId)} {nodeSelectEvent} {openDeckUId} depth={0}/>
			{:else if node.type == "deck"}
				<Deck on:node-click={handleNodeClick} arrayedNode={[node, children]} {nodeSelectEvent} {openDeckUId} depth={0}/>
			{/if}
	
		{/each}
	</div>
</div>

{#if "darkmode" || "replace with a boolean"}
	<!-- Load darkmode colours -->
{:else}
	<!-- Load lightmode colours-->
{/if}
<style>

	/* remove colours.css import within this file, only import externally so it can be controlled via svelte */

	@import "$lib/css/file-tree.css";

</style>