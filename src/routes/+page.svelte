<script lang="ts">
    import type { PageData } from "./$types";
    import { onMount } from "svelte";
    import FileTree from "$lib/components/FileTree.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import Homepage from "$lib/components/Homepage.svelte";

	export let data: PageData

	let mounted = false;
	let canResize = false;
	let fileTreeWidth: number | null = null;
	
	function handleFileTreeResize(event: MouseEvent) {
		if (canResize) {
			fileTreeWidth = Math.min(Math.max(150, event.clientX - 42), 1500) // 2x20 + 2 (2 x padding, l + r. and border width)
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
	<!-- preventDefault stops text highligting while resizing -->
	<div id="resize-bar" on:mousedown|preventDefault={() => { canResize = true }}></div>
	<div id="page" style="width: calc(100vh - {fileTreeWidth})">
		<Navbar />
		<!-- Will have an if statement to decide to show homepage or a selected deck 
			REMEMBER TO ADD overflow: auto TO ANY OTHER COMPONENTS THAT TAKE UP THE PAGE CONTENTS-->
		<Homepage /> 
	</div>

{:else}
	
	<div id="loading-message">
		<h1>Loading KiwiKards...</h1>
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
		min-width: 5px;
		cursor: col-resize;
		background-color: var(--resize-bar-colour);
	}

	#page {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		overflow-x: hidden;
	}

	#loading-message {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		transform: translateY(-15%);
	}
	
	#loading-message h1 {
		margin: 0;
	}

</style>