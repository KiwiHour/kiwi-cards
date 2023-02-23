<script lang="ts">
    import type { Database } from "$lib/types";

    import { generateNewNode, sortTopLevelNodes } from "$lib/functions";
    import { createEventDispatcher } from "svelte";
    import ThemeToggle from "./ThemeToggle.svelte";
    import ContextMenu from "./ContextMenu.svelte";
    import DirectoryNode from "./file-tree/DirectoryNode.svelte";
	export let fileTree: Database.ArrayedNode<"folder" | "deck">[]
	export let width: number | null;
	export let allDecksClosed: boolean;

	async function handleNodeClick(event: CustomEvent) {
		nodeSelectEvent = event.detail
		if (event.detail.node.type == "deck" && event.detail.clickType == "left" && !newNode) {
			openDeckUId = allDecksClosed ? "" : event.detail.node.UId;
			dispatch("open-deck", event.detail)
		}
	}

	function handleRightClick(event: MouseEvent) {
		if (isDisabled) { return }
		rightClickPos = { x: event.clientX, y: event.clientY }
		showContextMenu = true;
	}

	let dispatch = createEventDispatcher()
	let nodeSelectEvent: { nodeUId: string, type: "folder" | "deck", clickType: "left" | "right" } | null = null,
		openDeckUId: string | null = null,
		showContextMenu = false,
		rightClickPos: { x: number, y: number },
		newNode: Database.DirectoryNode | null = null,
		isDisabled = false;

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
					on:is-loading={e => isDisabled = e.detail}
					on:added-new-node={() => newNode = null}
					on:remove-new-node={() => newNode = null}
					depth={0}
					isNew={true}
					{isDisabled} arrayedNode={[newNode, []]} {nodeSelectEvent} {openDeckUId}
				/>

			{/if}
				{#each sortTopLevelNodes(fileTree) as arrayedNode}
					<DirectoryNode
						on:is-loading={e => isDisabled = e.detail}
						on:node-click={handleNodeClick}
						depth={0}
						isNew={false}
						{isDisabled} {arrayedNode} {nodeSelectEvent} {openDeckUId}
					/>
				{/each}
		{/key}
	</div>
	<ThemeToggle />
</div>

<style>

	@import "$lib/css/file-tree.css";

</style>