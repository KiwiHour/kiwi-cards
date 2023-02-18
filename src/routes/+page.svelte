<script lang="ts">
    import type { PageData } from "./$types";
    import { onMount, getContext } from "svelte";
    import FileTree from "$lib/components/FileTree.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import Homepage from "$lib/components/Homepage.svelte";
    import ThemeToggle from "$lib/components/ThemeToggle.svelte";
    import { invalidateAll } from "$app/navigation";

	export let data: PageData

	let canResize = false;
	let fileTreeWidth: number | null = 300;
	
	function handleFileTreeResize(event: MouseEvent) {
		if (canResize) {
			fileTreeWidth = Math.min(Math.max(150, event.clientX - 42), 1500) // 2x20 + 2 (2 x padding, l + r. and border width)
			localStorage.setItem("file-tree-width", fileTreeWidth.toString())
		}
	}

	onMount(() => {
		fileTreeWidth = parseInt(localStorage.getItem("file-tree-width") || "300") // 300 default
		// redefine incase of default
		localStorage.setItem("file-tree-width", fileTreeWidth.toString())
	})
	
</script>

<main on:mouseup={() => { canResize = false }} on:mousemove={handleFileTreeResize}>


	<!-- THIS RELOADS THE DATA ON THE PAGE (hook.server.ts + server.page.ts)-->
	<!-- <button type="button" on:click={async () => { await invalidateAll() }}>Invalidate All</button> -->

	<FileTree fileTree={data.fileTree} width={fileTreeWidth ? fileTreeWidth : 300}/>
	<!-- preventDefault stops text highligting while resizing -->
	<div id="resize-bar" on:mousedown|preventDefault={() => { canResize = true }}></div>
	<div id="page">
		<Navbar />
		<!-- Will have an if statement to decide to show homepage or a selected deck 
			REMEMBER TO ADD overflow: auto TO ANY OTHER COMPONENTS THAT TAKE UP THE PAGE CONTENTS-->
		<Homepage /> 
		<div id="theme-toggle">
			<ThemeToggle />
		</div>
	</div>

</main>

<style>

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

		background-color: var(--page-background-colour);
	}

</style>