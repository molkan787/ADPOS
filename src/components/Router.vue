<template>
    <transition name="zoom-fade">
        <keep-alive>
            <component :is="router.page"></component>
        </keep-alive>
    </transition>
</template>

<script>
import Login from './PageLogin';
import Form from './PageForm';
import Sales from './Sales';
import Invoices from './PageInvoices';
import Users from './PageUsers';
import Settings from './PageSettings';
import {mapState} from 'vuex';

export default {
    components: {
        Login,
        Form,
        Sales,
        Invoices,
        Users,
        Settings
    },
    computed: mapState(['router'])
}
</script>

<style scoped>
.zoom-fade-enter-active {
  transition: all .6s ease;
}
.zoom-fade-leave-active {
  transition: all .2s;
}
.zoom-fade-enter-to{
    transform: scale(1);
}
.zoom-fade-enter, .zoom-fade-leave-to {
  transform: scale(0.98);
  opacity: 0.3;
}
</style>