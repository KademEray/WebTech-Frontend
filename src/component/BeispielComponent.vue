<template>
  <div>
    <h1>User Management</h1>

    <!-- Create User -->
    <div>
      <h2>Create User</h2>
      <input v-model="newUser.username" placeholder="Username" />
      <input v-model="newUser.password" placeholder="Password" type="password" />
      <button @click="createUser">Create</button>
    </div>

    <!-- List Users -->
    <div>
      <h2>All Users</h2>
      <ul>
        <li v-for="user in users" :key="user.id">
          {{ user.username }}
          <button @click="updateUser(user)">Update</button>
          <button @click="deleteUser(user.id)">Delete</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      newUser: {
        username: "",
        password: "",
      },
    };
  },
  mounted() {
    this.getAllUsers();
  },
  methods: {
    getAllUsers() {
      fetch("http://localhost:8080/api/users")
          .then(response => response.json())
          .then(data => {
            this.users = data;
          })
          .catch(error => console.error('Es gab einen Fehler:', error));
    },
    createUser() {
      fetch("http://localhost:8080/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.newUser),
      })
          .then(() => {
            this.getAllUsers();
            this.newUser.username = "";
            this.newUser.password = "";
          })
          .catch(error => console.error('Es gab einen Fehler:', error));
    },
    updateUser(user) {
      // Hier könntest du ein Formular für die Aktualisierung anzeigen
      // und dann fetch mit der Methode "PUT" verwenden, um die Änderungen zu speichern.
    },
    deleteUser(id) {
      fetch(`http://localhost:8080/api/users/${id}`, {
        method: "DELETE",
      })
          .then(() => {
            this.getAllUsers();
          })
          .catch(error => console.error('Es gab einen Fehler:', error));
    },
  },
};
</script>
