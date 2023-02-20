<script lang="ts">

    import { createEventDispatcher } from "svelte";

	function loadHomepage() {
		dispatch("close-all-decks") // close decks before loading page (aesthetic reasons)
	}

	let dispatch = createEventDispatcher()

</script>

<div id="navbar">
	<div id="contents">
		<h1 id="title">KiwiCards</h1>
		<div id="menu">
			<button type="button" on:click={loadHomepage}> <!-- will load the homepage into the container -->
				<p>Homepage</p>
			</button>
		</div>
	</div>
</div>

<style>
	@import "$lib/css/navbar.css";
</style>