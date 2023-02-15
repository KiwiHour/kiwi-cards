<script lang="ts">
    import type { PageData } from "./$types";
    import Folder from "../lib/components/directory-nodes/Folder.svelte";
	import Deck from "../lib/components/directory-nodes/Deck.svelte";
    import { onMount } from "svelte";
    import { getExpandedFolderUIDs } from "$lib/functions";
    import iconPaths from "$lib/icon-paths";

	export let data: PageData

	interface X {
		name: string
		new: boolean
	}
	

	function filterOutNewFolders() {
	// 	folders = folders.filter(folder => !folder.new)
	}

	/** If new folder is confirmed (hit enter), then add the folder to list then sort alphabetically */
	function handleNewFolderNaming(event: KeyboardEvent) {
		// if (event.key == "Enter") {
		// 	folders = [...folders, ({ name: newFolderName, new: false })].sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
		// 	filterOutNewFolders()

		// 	newFolderName = "";
			
		// }
	}

	function handleNewFolder() {
		filterOutNewFolders()
		// folders = [({ name: "" }), ...folders]
	}

	function handleNewDeck() {}

	function focus(el: HTMLElement) {
		el.focus();
	}

	function handleFileTreeResize(event: MouseEvent) {
		if (canResize) {
			fileTreeWidth = Math.max(150, event.clientX - 22) // (10px padding left + right) (-2 so that its in the middle of the resize bar)
			localStorage.setItem("file-tree-width", fileTreeWidth.toString())
		}
	}

	let newFolderName: string;
	let rootNodes = data.fileTree
	let expandedFolderUIds: string[] = []
	let canResize = false;
	let fileTreeWidth: number
	let mounted = false;

	onMount(() => {
		expandedFolderUIds = getExpandedFolderUIDs(sessionStorage)
		fileTreeWidth = parseInt(localStorage.getItem("file-tree-width") || "")
		mounted = true
	})
	
</script>

{#if mounted}

	<main on:mouseup={() => { canResize = false }} on:mousemove={handleFileTreeResize}>

		<div class="file-tree" style="{fileTreeWidth ? `width: ${fileTreeWidth}px !important;` : ""}">

				<div id="resize-bar" on:mousedown={() => { canResize = true }}></div>
			
				<div id="buttons">
					<button type="button" id="new-folder" on:click={handleNewFolder}>
						<img alt="new-folder" src={iconPaths.dark["folder-add"]} style="scale: 1.2">
					</button>
					<button type="button" id="new-deck" on:click={handleNewDeck}>
						<img alt="new-folder" src={iconPaths.dark["deck-add"]}>
					</button>
				</div>
				
				<div class="outline">
					<div class="folders">
						{#each data.fileTree as [node, children]}
					
							{#if node.type == "folder"}
								<Folder arrayedNode={[node, children]} expanded={expandedFolderUIds.includes(node.UId)}/>
							{:else if node.type == "deck"}
								<Deck arrayedNode={[node, children]}/>
							{/if}
					
						{/each}
					</div>
				</div>
		</div>



			<!-- {#each data.rootDirectory.children as node}
				{#if node.UId == "new"}
					<input use:focus type="text" placeholder="Folder name..."
						bind:value={newFolderName}
						on:keypress={(event) => handleNewFolderNaming(event)}
						on:blur={filterOutNewFolders}> < !-- removes new folders, hence removes this -- >
				{:else}
					
					CONTENTS OF SAID NODE GOES HERE
					POSSIBLY A FOLDER OR A DECK,
					FOLDER IS A COMPONENT
					DECK IS A COMPONENT

					MAYBE ADD A ROOT COMPONENT??? IDKS
					
				{/if}
			{/each}
		-->	

	</main>
{:else}

	<div id="loading-message">
		<h1>Loading OptiCards...</h1>
	</div>

{/if}

<style>

	#loading-message {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		padding-top: 15%;
	}

	#resize-bar {
		position: absolute;
		right: -5px;
		top: 0;
		width: 5px;
		height: 100%;
		background-color: lightcyan;
		cursor: col-resize;
		z-index: 100;
	}
	
	.file-tree  {
		position: relative;
		width: 20% ;
		height: 100%;
		padding: 10px;
		background-color: darkgrey;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}

	.outline {
		width: 100%;
		height: 100%;
		border: 2px solid black;
		border-radius: 10px;
		padding: 0px;
		margin-bottom: 20px;
		overflow: hidden;
	}

	.folders {
		margin: 10px;
		margin-left: 0;
	}

	#buttons {
		display: flex;
		flex-direction: row;
		width: 100%;
		gap: 10px;
	}

	#buttons button {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 5px 10px;
		border: 2px black solid;
		border-radius: 5px;
		background-color: transparent;
		height: 50px;
		width: 50px;
	}

	#buttons button img {
		width: 30px;
		height: 30px;
	}

</style>