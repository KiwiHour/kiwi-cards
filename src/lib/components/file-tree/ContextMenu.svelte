<script lang="ts">

    import type { Database } from "$lib/schema";
    import { createEventDispatcher } from "svelte";

	export let pos: { x: number, y: number };
	export let node: Database.DirectoryNode

	function handleBlur() {
		dispatch("clicked-off-context-menu")
	}
	
	function onload(el: HTMLButtonElement) {
		el.focus()
	}

	let dispatch = createEventDispatcher()

</script>

<button use:onload id="context-menu" style="left: {pos.x}px; top: {pos.y}px;" on:blur|preventDefault={handleBlur}>
	{node.UId}
</button>

<style>
	@import "$lib/css/context-menu.css";
</style>