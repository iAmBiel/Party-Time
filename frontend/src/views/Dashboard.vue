<template>
  <div class="dashboard">
    <div class="title-container">
        <h1>Manage your events</h1>
        <router-link to="/newparty" class="btn">Register Party</router-link>
    </div>
    <div v-if="parties.length > 0">
        <DataTable :parties="parties" />
    </div>
    <div v-else>
        <p>You don't have parties registered yet, <router-link to="/newparty">click here to create your party!</router-link></p>
    </div>
  </div>
</template>

<script>
import DataTable from '../components/DataTable'

export default {
    components: {
        DataTable
    },
    data() {
        return {
            parties: []
        }
    },
    methods: {
        async getParties() {

            // get token from state
            const token = this.$store.getters.token;

            await fetch("http://localhost:3000/api/party/userparties", {
                method: "GET",
                headers: { 
                    "Content-type": "application/json",
                    "auth-token": token
                }
            })
            .then((resp) => resp.json())
            .then((data) => {

                this.parties = data.parties;

            })
            .catch((err) => {
                console.log(err);
            })
        
        }
    },
    created() {
        // load user parties
        this.getParties();
    },
}
</script>

<style scoped>
    .dashboard {
        padding: 50px;
        padding-bottom: 100px;
    }

    .title-container {
        display: flex;        
        align-items: center;
        justify-content: space-between;
        margin-bottom: 40px;
    }
    
    .btn {
        padding: 10px 16px;
        background-color: #000;
        color: #FFF;
        margin: 5px;
        text-decoration: none;
        border: none;
        font-size: 14px;
        cursor: pointer;
        transition: .5s;
    }
    
</style>