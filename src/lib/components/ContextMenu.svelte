<script lang="ts">
	
    import type { ContextMenuOptions } from "$lib/types";
    import { createEventDispatcher } from "svelte";

	export let pos: { x: number, y: number };
	export let options: ContextMenuOptions
	
	async function handleBlur(event: FocusEvent) {
		dispatch("close-context-menu")
	}
	
	function autofocus(el: HTMLButtonElement) {
		el.focus()
	}

	let contextMenuEl: HTMLButtonElement
	let dispatch = createEventDispatcher()
	$: bounding = contextMenuEl?.getBoundingClientRect();
	$: overflowingY = bounding ? bounding.bottom > (window.innerHeight || document.documentElement.clientHeight) : false

	$: xPos = pos.x
	$: yPos = overflowingY ? pos.y - bounding.height : pos.y

</script>

<button bind:this={contextMenuEl} use:autofocus id="context-menu" style="left: {xPos}px; top: {yPos}px;" on:blur|preventDefault={handleBlur} on:contextmenu|stopPropagation>
	<ul>
		{#each options as option}
			<li on:click={() => {dispatch("close-context-menu"); option.function()}} on:keypress>{option.name}</li>
		{/each}
	</ul>
</button>

<style>
	@import "$lib/css/context-menu.css";
</style>