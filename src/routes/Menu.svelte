<script lang="ts">
	export let pos: { x: number, y: number }
</script>

<div id="menu" style="top: {pos.y}px; left: {pos.x}px">
	<slot />
</div>