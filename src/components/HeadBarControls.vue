<template>
    <div class="root" :class="{hidden}">
        <slot name="default"></slot>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    computed: mapState(['router']),
    watch: {
      'router.page'(){
          this.hidden = true;
          setTimeout(() => this.hidden = false, 1000);
      }
    },
    data:() => ({
        hidden: false
    })
}
</script>

<style scoped>
.root{
    position: fixed !important;
    height: 48px !important;
    width: 100% !important;
    top: 0 !important;
    left: 0 !important;
    padding: 6px 22px 6px 6px !important;
    text-align: right !important;
    transition: opacity 0.7;
}
.hidden{
    opacity: 0;
}
</style>