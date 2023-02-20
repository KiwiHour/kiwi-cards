<script lang="ts">
    import type { Database } from "$lib/types";

    import { sortTopLevelNodes } from "$lib/functions";
    import ThemeToggle from "./ThemeToggle.svelte";
    import ContextMenu from "./ContextMenu.svelte";
    import DirectoryNode from "./file-tree/DirectoryNode.svelte";
	export let fileTree: Database.ArrayedNode<"folder" | "deck">[]
	export let width: number | null;
	export let allDecksClosed: boolean;

	async function handleNodeClick(event: CustomEvent) {
		nodeSelectEvent = event.detail
		if (event.detail.type == "deck" && event.detail.clickType == "left") {
			openDeckUId = allDecksClosed ? "" : event.detail.nodeUId
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

	let contextMenuOptions = [
		{ name: "New Folder", function: async () => {

		}}
	]

	$: openDeckUId = allDecksClosed ? "" : openDeckUId

</script>

{#if showContextMenu}
	<ContextMenu on:close-context-menu={async () => showContextMenu = false} pos={rightClickPos} options={contextMenuOptions}/>
{/if}

<div class="file-tree" style="{width ? `width: ${width}px; min-width: ${width}px;` : ""}" on:contextmenu|preventDefault|stopPropagation={handleRightClick}>
	
	<div class="folders outline">
		{#key fileTree}
			{#each sortTopLevelNodes(fileTree) as arrayedNode}
				<DirectoryNode on:node-click={handleNodeClick} depth={0} {arrayedNode} {nodeSelectEvent} {openDeckUId} />
			{/each}
		{/key}
	</div>
	<ThemeToggle />
</div>

<style>

	@import "$lib/css/file-tree.css";

</style>