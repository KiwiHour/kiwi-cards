<script lang="ts">
    import type { PageData } from "./$types";
    import { onMount } from "svelte";
    import FileTree from "$lib/components/directory-nodes/FileTree.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import Homepage from "$lib/components/Homepage.svelte";

	export let data: PageData

	let mounted = false;
	let canResize = false;
	let fileTreeWidth: number | null = null;
	
	function handleFileTreeResize(event: MouseEvent) {
		if (canResize) {
			fileTreeWidth = event.clientX
			localStorage.setItem("file-tree-width", fileTreeWidth.toString())
		}
	}

	onMount(() => {
		mounted = true
		fileTreeWidth = parseInt(localStorage.getItem("file-tree-width") || "")
	})
	
</script>

<main on:mouseup={() => { canResize = false }} on:mousemove={handleFileTreeResize}>
{#if mounted}

	<!-- THIS RELOADS THE DATA ON THE PAGE (hook.server.ts + server.page.ts)-->
	<!-- <button type="button" on:click={async () => { await invalidateAll() }}>Invalidate All</button> -->

	<FileTree fileTree={data.fileTree} width={fileTreeWidth}/>
	<div id="resize-bar" on:mousedown={() => { canResize = true }}></div>
	<div id="page">
		<Navbar />
		<!-- Will have an if statement to decide to show homepage or a selected deck 
			REMEMBER TO ADD overflow: auto TO ANY OTHER COMPONENTS THAT TAKE UP THE PAGE CONTENTS-->
		<Homepage /> 
	</div>

{:else}
	
	<div id="loading-message">
		<h1>Loading OptiCards...</h1>
	</div>
	
{/if}
</main>

<style>

	@import "$lib/css/colours.css";

	main {
		display: flex;
		flex-direction: row;
	}

	#resize-bar {
		height: 100%;
		width: 5px;
		cursor: col-resize;
		background-color: var(--resize-bar-colour);
	}

</style>