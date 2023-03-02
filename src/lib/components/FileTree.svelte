<script lang="ts">
    import type { Database } from "$lib/types";

    import { generateNewNode, moveNode, sortTopLevelNodes } from "$lib/functions";
    import { createEventDispatcher } from "svelte";
    import { invalidateAll } from "$app/navigation";
    import ThemeToggle from "./ThemeToggle.svelte";
    import ContextMenu from "./ContextMenu.svelte";
    import DirectoryNode from "./file-tree/DirectoryNode.svelte";
	export let fileTree: Database.ArrayedNode<"folder" | "deck">[]
	export let width: number | null;
	export let allDecksClosed: boolean;

	async function handleNodeClick(event: CustomEvent) {
		console.log(event.detail)
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

	async function handleDrop(event: DragEvent) {
		let toMoveNodeUId = event.dataTransfer?.getData("dragged-node-uid") as string
		let currentParentUId = event.dataTransfer?.getData("current-parent-uid") as string

		draggingOver = false
		if (currentParentUId == "null") { return }

		isDisabled = true
		loadingNodeUId = toMoveNodeUId
		let [_, err] = await moveNode(null, toMoveNodeUId)
		await invalidateAll()
		isDisabled = false
		loadingNodeUId = null
		if (err) { alert(err) }
	}

	function handleDragOver(event: DragEvent) {
		let toMoveNodeUId = event.dataTransfer?.getData("dragged-node-uid") as string
		let currentParentUId = event.dataTransfer?.getData("current-parent-uid") as string
		
		if (currentParentUId == "null") { return }

		draggingOver = true
	}

	function handleIsLoading(event: CustomEvent) {
		isDisabled = event.detail.isLoading
		loadingNodeUId = event.detail.isLoading ? event.detail.nodeUId : null
		if (!isDisabled) { // finished process
			dispatch("refresh-page-contents")
		}
	}

	let dispatch = createEventDispatcher()
	let nodeSelectEvent: { node: Database.DirectoryNode, clickType: "left" | "right" } | null = null,
		openDeckUId: string | null = null,
		showContextMenu = false,
		rightClickPos: { x: number, y: number },
		newNode: Database.DirectoryNode | null = null,
		isDisabled = false,
		loadingNodeUId: string | null = null,
		draggingOver: boolean = false;

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

<div class="file-tree" style="{width ? `width: ${width}px; min-width: min(70vw, ${width}px);` : ""}">
	
	<div class="folders outline {draggingOver ? "dragging-over" : ""}"
		on:drop|stopPropagation={handleDrop}
		on:dragover|preventDefault|stopPropagation={handleDragOver}
		on:dragleave|stopPropagation={() => draggingOver = false}
		on:contextmenu|preventDefault|stopPropagation={handleRightClick}
	>
		{#key fileTree}
			{#if newNode}

				<DirectoryNode
					on:is-loading={handleIsLoading}
					on:added-new-node={() => newNode = null}
					on:remove-new-node={() => newNode = null}
					depth={0}
					isNew={true}
					{isDisabled} {loadingNodeUId} arrayedNode={[newNode, []]} {nodeSelectEvent} {openDeckUId}
				/>

			{/if}
				{#each sortTopLevelNodes(fileTree) as arrayedNode}
					<DirectoryNode
						on:is-loading={handleIsLoading}
						on:node-click={handleNodeClick}
						depth={0}
						isNew={false}
						{isDisabled} {loadingNodeUId} {arrayedNode} {nodeSelectEvent} {openDeckUId}
					/>
				{/each}
		{/key}
	</div>
	<div id="file-tree-footer">
		<ThemeToggle />
	</div>
</div>

<style>

	@import "$lib/css/file-tree.css";

</style>