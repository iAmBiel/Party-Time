<template>
  <div class="register">
    <h1>Create an account</h1>
    <UserForm :user="{}" page="register" btnText="Register" />
  </div>
</template>

<script>
import UserForm from '../components/UserForm'

export default {
    name: "Register",
    components: {
        UserForm
    }

}
</script>

<style scoped>
    .register {
        text-align: center;
        padding-top: 40px;
        padding-bottom: 100px;
    }

    .register h1 {
        margin-bottom: 40px;
    }
</style>