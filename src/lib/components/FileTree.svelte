<script lang="ts">
    import type { Database } from "$lib/types";

    import { generateNewNode, sortTopLevelNodes } from "$lib/functions";
    import ThemeToggle from "./ThemeToggle.svelte";
    import ContextMenu from "./ContextMenu.svelte";
    import DirectoryNode from "./file-tree/DirectoryNode.svelte";
	export let fileTree: Database.ArrayedNode<"folder" | "deck">[]
	export let width: number | null;
	export let allDecksClosed: boolean;

	async function handleNodeClick(event: CustomEvent) {
		nodeSelectEvent = event.detail
		if (event.detail.type == "deck" && event.detail.clickType == "left" && !newNode) {
			openDeckUId = allDecksClosed ? "" : event.detail.nodeUId
		}
	}

	function handleRightClick(event: MouseEvent) {
		rightClickPos = { x: event.clientX, y: event.clientY }
		showContextMenu = true;
	}

	let nodeSelectEvent: { nodeUId: string, type: "folder" | "deck", clickType: "left" | "right" } | null = null,
		openDeckUId: string | null = null,
		showContextMenu = false,
		rightClickPos: { x: number, y: number },
		newNode: Database.DirectoryNode | null = null;

	let contextMenuOptions = [
		{ name: "New Folder", function: () => {
			newNode = generateNewNode("folder", null) 
		}},
		{ name: "New Deck", function: () => {
			newNode = generateNewNode("deck", null)
		}},
	]

	$: openDeckUId = allDecksClosed ? "" : openDeckUId

</script>

{#if showContextMenu}
	<ContextMenu on:close-context-menu={async () => showContextMenu = false} pos={rightClickPos} options={contextMenuOptions}/>
{/if}

<div class="file-tree" style="{width ? `width: ${width}px; min-width: ${width}px;` : ""}" on:contextmenu|preventDefault|stopPropagation={handleRightClick}>
	
	<div class="folders outline">
		{#key fileTree}
			{#if newNode}
				<DirectoryNode
					on:added-new-node={() => newNode = null}
					on:remove-new-node={() => newNode = null}
					depth={0} isNew={true} arrayedNode={[newNode, []]} {nodeSelectEvent} {openDeckUId}/>
			{/if}

			{#each sortTopLevelNodes(fileTree) as arrayedNode}
				<DirectoryNode on:node-click={handleNodeClick} depth={0} isNew={false} {arrayedNode} {nodeSelectEvent} {openDeckUId} />
			{/each}
		{/key}
	</div>
	<ThemeToggle />
</div>

<style>

	@import "$lib/css/file-tree.css";

</style>