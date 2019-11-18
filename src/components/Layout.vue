<template>
    <div class="root" :style="{height: rootHeight + 'px'}">
        <div class="left">
            <slot name="left"></slot>
        </div>
        <div class="right">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script>
export default {
    data: () => ({
        rootHeight: 0,
    }),
    methods: {
        updateSize(){
            const h = window.innerHeight;
            this.rootHeight = h - 48;
            this.$store.state.layout.pageViewHeight = this.rootHeight - 20;
        }
    },
    mounted(){
        window.addEventListener('resize', () => this.updateSize());
        this.updateSize()
    }
}
</script>

<style scoped>
div{
    height: calc(100% - 68px);
    display: block;
}
.left, .right{
    display: inline-block;
    float: left;
}
.left{
    width: 256px;
    height: 100% !important;
}
.right{
    width: calc(100% - 256px);
    height: 100% !important;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: scroll;
    padding: 10px;
}
.content{
    height: 100% !important;
}
</style>