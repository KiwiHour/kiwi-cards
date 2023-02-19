<script lang="ts">

    import type { Database } from "$lib/schema";
    import { createEventDispatcher, tick } from "svelte";
    import { prevent_default } from "svelte/internal";

	export let pos: { x: number, y: number };
	export let node: Database.DirectoryNode

	async function handleBlur() {
		dispatch("close-context-menu")
	}
	
	function onload(el: HTMLButtonElement) {
		el.focus()
	}

	async function handleClick() {
		
		console.log("clicc")
	}

	let dispatch = createEventDispatcher()

</script>

<button use:onload id="context-menu" style="left: {pos.x}px; top: {pos.y}px;" on:blur={handleBlur}>
	<ul>
		<li><button on:click={handleClick}>myId</button></li>
		<li><button on:click={handleClick}>myId</button></li>
		<li><button on:click={handleClick}>myId</button></li>
	</ul>
</button>

<style>
	@import "$lib/css/context-menu.css";
</style>