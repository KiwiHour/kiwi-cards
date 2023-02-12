<script lang="ts">
    import Menu from "./Menu.svelte";
    import MenuItem from "./MenuItem.svelte";

	export let folderName: string
	let menuLocation: { x: number, y: number }
	let isFolderExpanded = false
	let showMenu = false

	function toggleFolder() {
		isFolderExpanded = !isFolderExpanded
	}

	function onRightClick(event: MouseEvent) {
		menuLocation = { x: event.clientX, y: event.clientY }
		showMenu = true;
	}

</script>

<div class="folder" on:contextmenu|preventDefault={(event) => onRightClick(event)}>

	{#if showMenu}
		<Menu pos={menuLocation}>
			<MenuItem text="Rename" />
			<MenuItem text="Delete" />
		</Menu>
	{/if}

	<input id="toggle-folder-{folderName}" type="button" value={isFolderExpanded ? "-" : "+"} on:click={toggleFolder}>
	<label for="toggle-folder-{folderName}">{folderName}</label>
	<div class="folder-contents">
		{#if isFolderExpanded}
			<slot />
		{/if}
	</div>
</div>

<style>
	.folder-contents {
		transform: translateX(2%);
	}
</style>