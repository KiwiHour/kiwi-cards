<script lang="ts">
    import type { Database } from "$lib/schema";

    import { getExpandedFolderUIDs, sortTopLevelNodes } from "$lib/functions";
    import Deck from "./file-tree/Deck.svelte";
    import Folder from "./file-tree/Folder.svelte";
    import ThemeToggle from "./ThemeToggle.svelte";
    import ContextMenu from "./file-tree/ContextMenu.svelte";

	export let fileTree: Database.ArrayedNode<"folder" | "deck">[]
	export let width: number | null;

	async function handleNodeClick(event: CustomEvent) {
		nodeSelectEvent = event.detail
		if (event.detail.type == "deck" && event.detail.clickType == "left") {
			openDeckUId = event.detail.nodeUId
		}
	}

	function handleRightClick(event: MouseEvent) {
		rightClickPos = { x: event.clientX, y: event.clientY }
		showContextMenu = true;
	}

	let openDeckUId: string | null = null;
	let nodeSelectEvent: { nodeUId: string, type: "folder" | "deck", clickType: "left" | "right" } | null = null;
	let showContextMenu = false;
	let rightClickPos: { x: number, y: number }

	let contextMenuConfig = {
		options: [
			{ name: "New Folder", function: async () => {

			}}
		]
	}

</script>

{#if showContextMenu}
	<ContextMenu on:close-context-menu={async () => showContextMenu = false} pos={rightClickPos} config={contextMenuConfig}/>
{/if}

<div class="file-tree" style="{width ? `width: ${width}px; min-width: ${width}px;` : ""}" on:contextmenu|preventDefault|stopPropagation={handleRightClick}>
	
	<div class="folders outline">
		{#key fileTree}
			{#each sortTopLevelNodes(fileTree) as [node, children]}
		
				<!-- MERGE THE DECK AND FOLDER COMPONENTS-->
				<!-- Then just apply the add the isNew prop which is handeled by the component -->

				{#if node.type == "folder"}
					<Folder on:node-click={handleNodeClick} arrayedNode={[node, children]} {nodeSelectEvent} {openDeckUId} depth={0}/>
				{:else if node.type == "deck"}
					<Deck on:node-click={handleNodeClick} arrayedNode={[node, children]} {nodeSelectEvent} {openDeckUId} depth={0}/>
				{/if}
		
			{/each}
		{/key}
	</div>
	<ThemeToggle />
</div>

<style>

	@import "$lib/css/file-tree.css";

</style>