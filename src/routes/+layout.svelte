<script lang="ts">

	import { onMount } from "svelte";
	import iconPaths from "$lib/icon-paths";

	let theme: "light" | "dark"
	let mounted = false;
	let preloadURLs = [
		...Object.keys(iconPaths.dark).map(key => "src/lib/" + iconPaths.dark[key]),
		...Object.keys(iconPaths.light).map(key => "src/lib/" + iconPaths.light[key])
	]
	
	onMount(() => {
		mounted = true;
		theme = localStorage.getItem("theme") as "dark" | "light" ?? "dark"
		// redefine incase of defaults
		localStorage.setItem("theme", theme)
		document.body.classList.add(`${theme}-theme`)
	})

</script>

<svelte:head>
	{#each preloadURLs as preloadURL}
		<link rel="preload" as="image" href={preloadURL}>
	{/each}
</svelte:head>

{#if mounted}
	<slot/>
{:else}
	<div id="loading-wrapper">
		<!-- <div id="loading-message">
			<h1>Loading KiwiCards...</h1>
		</div> -->
	</div>
{/if}

<style>
	@import "$lib/css/theme.css";
	@import "$lib/css/global.css";

	#loading-wrapper {
		width: 100vw;
		height: 100vh;

		background-color: rgb(148, 148, 148);
	}

	/* #loading-message {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		transform: translateY(-15%);
	}
	
	#loading-message h1 {
		margin: 0;
		font-size: 4rem;
		text-align: center;
		color: rgb(56, 56, 56)
	} */

</style>