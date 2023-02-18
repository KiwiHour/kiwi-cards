<script lang="ts">

    import { onMount } from "svelte";

	function handleToggle() {
		document.getElementsByTagName("main")[0].classList.remove(`${currentTheme}-theme`)
		let newTheme: "light" | "dark" = currentTheme == "light" ? "dark" : "light" // toggle
		currentTheme = newTheme

		document.getElementsByTagName("main")[0].classList.add(`${newTheme}-theme`)
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

<input type="checkbox" on:click={handleToggle} checked={currentTheme == "dark"}>