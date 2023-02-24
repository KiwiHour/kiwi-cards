<script lang="ts">

	import { onMount } from "svelte";
	import iconPaths from "$lib/icon-paths";

	function preloadIcons() {
		for (let iconName in iconPaths.dark) {
			let path = iconPaths.dark[iconName]
			let img = document.createElement("img")
			img.src = "src/lib/" + path
		}
		for (let iconName in iconPaths.light) {
			let path = iconPaths.light[iconName]
			let img = document.createElement("img")
			img.src = "src/lib/" + path
		}
	}

	let theme: "light" | "dark"
	let mounted = false;
	
	onMount(() => {
		mounted = true;
		theme = localStorage.getItem("theme") as "dark" | "light" ?? "dark"
		// redefine incase of defaults
		localStorage.setItem("theme", theme)
		document.body.classList.add(`${theme}-theme`)
		preloadIcons()
	})

</script>

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