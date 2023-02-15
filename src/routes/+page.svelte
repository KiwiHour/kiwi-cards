<script lang="ts">
    import type { PageData } from "./$types";
    import { onMount } from "svelte";
    import FileTree from "$lib/components/directory-nodes/FileTree.svelte";

	export let data: PageData

	let mounted = false;

	onMount(() => {
		mounted = true
	})
	
</script>

{#if mounted}

	<main>

		<FileTree fileTree={data.fileTree}/>

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

</style>