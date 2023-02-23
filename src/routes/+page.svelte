<script lang="ts">
    import type { PageData } from "./$types";
    import type { Database } from "$lib/types";

    import { onMount, tick } from "svelte";
    import FileTree from "$lib/components/FileTree.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import Homepage from "$lib/components/Homepage.svelte";
    import Deck from "$lib/components/Deck.svelte";

	export let data: PageData

	let canResize = false;
	let fileTreeWidth: number | null = 300;
	let allDecksClosed = false;
	let openDeck: Database.DirectoryNode | null = null;
	
	function handleFileTreeResize(event: MouseEvent) {
		if (canResize) {
			fileTreeWidth = Math.min(Math.max(150, event.clientX - 42), 1500) // 2x20 + 2 (2 x padding, l + r. and border width)
			localStorage.setItem("file-tree-width", fileTreeWidth.toString())
		}
	}

	async function handleCloseAllDecks() {
		allDecksClosed = true
		openDeck = null;
		await tick() // let file tree styling update, then allow decks to be clicked again. GOD DAMN I LOVE tick. TICK MY BELOVED
		allDecksClosed = false;
	}

	onMount(() => {
		fileTreeWidth = parseInt(localStorage.getItem("file-tree-width") || "300") // 300 default
		// redefine incase of default
		localStorage.setItem("file-tree-width", fileTreeWidth.toString())
	})
	
</script>

<main on:mouseup={() => { canResize = false }} on:mousemove={handleFileTreeResize}>

	<FileTree on:open-deck={(e) => openDeck = e.detail.node} fileTree={data.fileTree} width={fileTreeWidth ? fileTreeWidth : 300} {allDecksClosed}/>
	<!-- preventDefault stops text highligting while resizing -->
	<div id="resize-bar" on:mousedown|preventDefault={() => { canResize = true }}></div>
	<div id="page">
		<Navbar on:close-all-decks={handleCloseAllDecks} />
		<!-- Will have an if statement to decide to show homepage or a selected deck 
			REMEMBER TO ADD overflow: auto TO ANY OTHER COMPONENTS THAT TAKE UP THE PAGE CONTENTS-->
		{#if openDeck}
			<Deck node={openDeck} cards={data.cards.filter(card => openDeck?.childrenUIds.includes(card.UId))} />
		{:else}
			<Homepage /> 
		{/if}
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
		outline: var(--outline-colour);
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