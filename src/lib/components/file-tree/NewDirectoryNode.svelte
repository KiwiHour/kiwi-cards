<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { invalidateAll } from "$app/navigation";
    import { addNode } from "$lib/functions";

    function autofocus(el: HTMLElement) {
        el.focus()
    }

    async function handleNewNodeSubmit(event: KeyboardEvent) {
        if (event.key == "Enter") {
			if (!newNodeName || newNodeName.trim() == "") {
				dispatch("remove-new-node")
				return;
			}
            dispatch("added-new-node")
			let [newNodeUId, err] = await addNode(parentUId, newNodeName, type)
			invalidateAll()
			if (err) { alert(err) }
		}
    }

    export let parentUId: string | null;
    export let type: "folder" | "deck";
    export let depth: number;

    let focused = true;
    let newNodeName: string = "";
    let dispatch = createEventDispatcher()

    $: classes = `${focused ? "focused" : ""}`

</script>

<div class="node {type}" id="new-node">

    <button
        on:contextmenu|preventDefault|stopPropagation 
        disabled class="name-and-button {classes}"
    >
        <div class="button-contents" style="padding-left: {(depth) * 1}vw;">
			<img class="toggle-indicator" alt="deck icon">
            <input id="rename-input" use:autofocus
                on:blur={() => dispatch("remove-new-node")}
                on:keypress={handleNewNodeSubmit} 
                bind:value={newNodeName}
                type="text" />
        </div>
    </button>

</div>