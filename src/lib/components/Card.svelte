<script lang="ts">

    import type { Database } from "$lib/types";

    export let card: Database.Card;

</script>

<div class="card" id={card.UId}>
    <div id="front">
        <input type="text" value={card.front} />
    </div>
    <div id="back">
        <input type="text" value={card.back} />
    </div>
</div>