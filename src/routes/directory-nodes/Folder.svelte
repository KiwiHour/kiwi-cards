<script lang="ts">

	export let folderName: string
	let isFolderExpanded = false

	function toggleFolder() {
		isFolderExpanded = !isFolderExpanded
	}

</script>

<div class="folder">

	<input class="toggle-folder-btn" id="toggle-folder-{folderName}" type="button" value={isFolderExpanded ? "-" : "+"} on:click={toggleFolder}>
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
	
	.toggle-folder-btn {
		width: 2em;
		height: 2em;
	}

</style>