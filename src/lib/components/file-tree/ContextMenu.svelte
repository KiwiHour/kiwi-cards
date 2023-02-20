<script lang="ts">

    import { createEventDispatcher } from "svelte";

	export let pos: { x: number, y: number };
	export let config: {
		options: { name: string, function: () => any }[]
	}

	async function handleBlur(event: FocusEvent) {
		dispatch("close-context-menu")
	}
	
	function autofocus(el: HTMLButtonElement) {
		el.focus()
	}

	let dispatch = createEventDispatcher()

</script>

<button use:autofocus id="context-menu" style="left: {pos.x}px; top: {pos.y}px;" on:blur|preventDefault={handleBlur}>
	<ul>
		{#each config.options as option}
			<li on:click={() => {dispatch("close-context-menu"); option.function()}} on:keypress>{option.name}</li>
		{/each}
	</ul>
</button>

<style>
	@import "$lib/css/context-menu.css";
</style>