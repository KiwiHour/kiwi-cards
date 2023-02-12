<script lang="ts">
    import Folder from "./Folder.svelte";

	interface X {
		name: string
		new: boolean
	}

	function filterOutNewFolders() {
		folders = folders.filter(folder => !folder.new)
	}

	/** If new folder is confirmed (hit enter), then add the folder to list then sort alphabetically */
	function handleNewFolderNaming(event: KeyboardEvent) {
		if (event.key == "Enter") {
			folders = [...folders, ({ name: newFolderName, new: false })].sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
			filterOutNewFolders()

			newFolderName = "";
		}
	}

	function handleNewFolder() {
		filterOutNewFolders()
		folders = [({ name: "", new: true }), ...folders]
	}

	let newFolderName: string;
	let folders: X[] =  [{name: ":)", new: false}]
	
</script>

<main>

	<input type="button" value="New Folder" on:click={handleNewFolder}>
	<input type="button" value="New Deck">
	<div id="directory-tree">
		{#each folders as folder}
			{#if folder.new}
				<input type="text" placeholder="Folder name..." bind:value={newFolderName} on:keypress={(event) => handleNewFolderNaming(event)}>
			{:else}
				<Folder folderName={folder.name}>
					heheh
				</Folder>
			{/if}
		{/each}
		
	</div>

</main>