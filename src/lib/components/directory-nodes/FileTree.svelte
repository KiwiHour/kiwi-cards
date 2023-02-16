<script lang="ts">
    import type { Database } from "$lib/schema";

    import { getExpandedFolderUIDs } from "$lib/functions";
    import iconPaths from "$lib/icon-paths";
    import Deck from "./Deck.svelte";
    import Folder from "./Folder.svelte";

	export let fileTree: Database.ArrayedNode<"folder" | "deck">[]

	function handleFileTreeResize(event: MouseEvent) {
		if (canResize) {
			console.log(event.clientX)
			fileTreeWidth = event.clientX - 22 // (10px padding left + right) (-2 so that its in the middle of the resize bar)
			localStorage.setItem("file-tree-width", fileTreeWidth.toString())
		}
	}

	function handleNodeClick(event: CustomEvent) {
		nodeSelectEvent = event.detail
		if (event.detail.type == "deck") {
			openDeckUId = event.detail.nodeUId
		}
	}

	let openDeckUId: string | null = null;
	let nodeSelectEvent: { nodeUId: string, type: "folder" | "deck" } | null = null;
	let canResize = false;
	let expandedFolderUIds = getExpandedFolderUIDs(sessionStorage)
	let fileTreeWidth = parseInt(localStorage.getItem("file-tree-width") || "")

</script>

<svelte:window on:mouseup={() => { canResize = false }} on:mousemove={handleFileTreeResize} />

<div class="file-tree" style="{fileTreeWidth ? `width: ${fileTreeWidth}px !important;` : ""}">

	<div id="resize-bar" on:mousedown={() => { canResize = true }}></div>

	<div id="file-tree-buttons">
		<button type="button" id="new-folder" on:click={() => {}}>
			<img alt="new-folder" src={iconPaths.dark["folder-add"]} style="scale: 1.2">
		</button>
		<button type="button" id="new-deck" on:click={() => {}}>
			<img alt="new-folder" src={iconPaths.dark["deck-add"]}>
		</button>
	</div>
	
	<div class="outline">
		<div class="folders">
			{#each fileTree as [node, children]}
		
				{#if node.type == "folder"}
					<Folder on:node-click={handleNodeClick} arrayedNode={[node, children]} expanded={expandedFolderUIds.includes(node.UId)} {nodeSelectEvent} {openDeckUId} depth={0}/>
				{:else if node.type == "deck"}
					<Deck on:node-click={handleNodeClick} arrayedNode={[node, children]} {nodeSelectEvent} {openDeckUId} depth={0}/>
				{/if}
		
			{/each}
		</div>
	</div>
</div>

<style>

	@import "$lib/css/file-tree.css";

</style>