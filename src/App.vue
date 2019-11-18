<template>
  <v-app id="app">
    <AppBar />
    <Layout>
      <template v-slot:left>
        <NavigationDrawer />
      </template>
      <template v-slot:right>
        <Router />
      </template>
    </Layout>
    <SalesExporter />
    <EditServiceModal />
    <ChangePasswordModal />
    <EditUser />
    <LoginScreen />
    <SetupModal />
    <Dialog />
    <div style="display: none">
      <Invoice />
    </div>
  </v-app>
</template>

<script>
import Layout from '@/components/Layout';
import AppBar from '@/components/AppBar';
import NavigationDrawer from '@/components/NavigationDrawer';
import Dialog from '@/components/Dialog';
import Router from '@/components/Router';
import Invoice from '@/components/Invoice';
import SalesExporter from '@/components/SalesExporter';
import EditServiceModal from '@/components/EditServiceModal';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import EditUser from '@/components/EditUser';
import LoginScreen from '@/components/LoginScreen';
import SetupModal from '@/components/SetupModal';

export default {
  name: 'app',
  components: {
    Layout,
    Router,
    AppBar,
    NavigationDrawer,
    Dialog,
    Invoice,
    SalesExporter,
    EditServiceModal,
    ChangePasswordModal,
    EditUser,
    LoginScreen,
    SetupModal
  }
}
</script>

<style lang="scss">
</style>
