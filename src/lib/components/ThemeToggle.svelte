<script lang="ts">

	import { createEventDispatcher } from "svelte";
    import { onMount } from "svelte";

	function handleToggle() {
		let dispatch = createEventDispatcher();
		let newTheme: "light" | "dark" = currentTheme == "light" ? "dark" : "light" // toggle
		currentTheme = newTheme

		dispatch("update-theme", newTheme)
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

<input type="checkbox" on:click={handleToggle}>