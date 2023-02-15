<script lang="ts">
    import type { PageData } from "./$types";
    import { onMount } from "svelte";
    import FileTree from "$lib/components/directory-nodes/FileTree.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import Homepage from "$lib/components/Homepage.svelte";

	export let data: PageData

	let mounted = false;

	onMount(() => {
		mounted = true
	})
	
</script>

<main>
{#if mounted}


	<FileTree fileTree={data.fileTree}/>
	<div id="page">
		<Navbar />
		<!-- Will have an if statement to decide to show homepage or a selected deck -->
		<Homepage />
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

	#page {
		width: calc(100% - 5px);
		transform: translateX(+5px);
		display: flex;
		flex-direction: column;
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