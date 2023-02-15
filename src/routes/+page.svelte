<script lang="ts">
    import type { PageData } from "./$types";
    import { onMount } from "svelte";
    import FileTree from "$lib/components/directory-nodes/FileTree.svelte";
    import Navbar from "$lib/components/Navbar.svelte";

	export let data: PageData

	let mounted = false;

	onMount(() => {
		mounted = true
	})
	
</script>

<main>
{#if mounted}


	<FileTree fileTree={data.fileTree}/>
	<div id="page-content">
		<Navbar />
	</div>

{:else}
	
	<div id="loading-message">
		<h1>Loading OptiCards...</h1>
	</div>
	
{/if}
</main>

<style>

	main {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: 1fr 99fr; /* goofiest method yet fr fr */
		grid-gap: 0px;
	}

	#loading-message {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		padding-top: 15%;
	}

</style>