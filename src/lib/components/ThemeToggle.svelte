<script lang="ts">

    import { onMount } from "svelte";

	function handleToggle() {
		document.body.classList.remove(`${currentTheme}-theme`)
		let newTheme: "light" | "dark" = currentTheme == "light" ? "dark" : "light" // toggle
		currentTheme = newTheme

		document.body.classList.add(`${newTheme}-theme`)
		localStorage.setItem("theme", newTheme)
	}
	
	let currentTheme: "light" | "dark"

	onMount(() => {
		if (localStorage.getItem("theme")) {
			currentTheme = localStorage.getItem("theme") as "light" | "dark"
		} else {
			// default starting theme
			currentTheme = "dark"
			localStorage.setItem("theme", currentTheme)
		}
	})

</script>

<label class="toggle">
	<input class="toggle-checkbox" type="checkbox" on:click={handleToggle} checked={currentTheme == "dark"}>
	<div class="toggle-switch"></div>
	<span class="toggle-label prevent-select">Dark mode</span>
</label>

<style>
	@import "$lib/css/theme-toggle.css";

	
</style>