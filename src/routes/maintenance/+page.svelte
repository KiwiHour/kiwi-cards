<script lang="ts">

    import ThemeToggle from "$lib/components/ThemeToggle.svelte";

</script>

<main>
	<div id="wrapper">
		<div id="maintenance-info">
			<h1>Under Maintenance</h1>
			<p>KiwiCards is currently under maintenance due to unexpected issues or preparations for a new update</p>
		</div>
		<ThemeToggle />
	</div>
</main>

<style>

	main {
		display: flex;
		flex-direction: row;
		justify-content: start;
		background-color: var(--page-background-colour);
	}

	#wrapper {
		width: 100vw;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-evenly;

	}

	#wrapper > * {
		padding: 15px 10px;
	}

	h1, p {
		text-align: center;
		margin: 0;
	}

	h1 {
		font-size: 2.5em;
	}

	p {
		font-size: 1.3em;
	}

</style>