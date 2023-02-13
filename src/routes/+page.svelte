<script lang="ts">
    import type { Database } from "$lib/schema";
    import type { PageData } from "./$types";
    import Folder from "./directory-nodes/Folder.svelte";

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

	function focus(el: HTMLElement) {
		el.focus();
	}

	let newFolderName: string;
	
</script>

<main>

	<input type="button" value="New Folder" on:click={handleNewFolder}>
	<input type="button" value="New Deck">
	<div id="directory-tree">
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
		
	</div>

	{JSON.stringify(data.fileTree)}

	[
		[NODE, [NODE, [ID, ID]]]
		[NODE, [ID, ID]]
	]

	{#each data.fileTree as node}
		
	{/each}

	<br><br>


</main>