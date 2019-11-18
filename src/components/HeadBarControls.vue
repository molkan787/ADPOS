<template>
    <div class="root">
        <slot name="default"></slot>
    </div>
</template>

<style scoped>
.root{
    position: fixed !important;
    height: 48px !important;
    width: 100% !important;
    top: 0 !important;
    left: 0 !important;
    padding: 6px 22px 6px 6px !important;
    text-align: right !important;
}
</style>