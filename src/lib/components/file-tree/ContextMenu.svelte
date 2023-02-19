<script lang="ts">

    import type { Database } from "$lib/schema";
    import { createEventDispatcher } from "svelte";

	export let pos: { x: number, y: number };
	export let node: Database.DirectoryNode

	async function handleBlur(event: FocusEvent) {
		dispatch("close-context-menu")
	}
	
	function onload(el: HTMLButtonElement) {
		el.focus()
	}

	async function handleClick() {
		console.log("clicc")
		dispatch("close-context-menu")
	}

	let dispatch = createEventDispatcher()

</script>

<button use:onload id="context-menu" style="left: {pos.x}px; top: {pos.y}px;" on:blur|preventDefault={handleBlur}>
	<ul>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<li on:click={handleClick}>myId</li>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<li on:click={handleClick}>myId</li>
	</ul>
</button>

<style>
	@import "$lib/css/context-menu.css";
</style>