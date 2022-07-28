<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8 d-flex justify-content-center">
        <img src="../assets/darkroom.webp" class="img-fluide logo" alt="titre" />
      </div>
    </div>

    <fieldset>
      <div class="d-flex flex-column justify-content-center">
        <div class="connect">
          
          <h1 class="card__title" v-if="mode == 'login'">Connexion</h1>
          <h1 class="card__title" v-else>Inscription</h1>
          <br />
        </div>
        <br />
        <div class="switch">
        <button class="btn btn-secondary justify-content-center" @click="switchToLogin()">Se connecter</button>
        <button class="btn btn-secondary justify-content-center" @click="switchToCreateAccount()">Créer un compte</button>
        </div>
        
        <div class="mgs">{{ message }}</div>
        <div class="mgs">{{ errorMessage }}</div>
      </div>

      <div class="row-8 d-flex align-items-center flex-column">
        <div class="form-floating justify-content-center">
          <input v-model="firstName" type="text" class="form-control" v-if="mode == 'create'" id="floatingName" placeholder="Nom" />
          <label for="floatingName">Nom</label>
        </div>

        <div class="form-floating justify-content-center">
          <input v-model="lastName" type="text" class="form-control" v-if="mode == 'create'" id="floatingLastname" placeholder="Prénom" />
          <label for="floatingPassword">Prénom</label>
        </div>

        <div class="form-floating mb-3 justify-content-center">
          <input v-model="email" type="email" class="form-control" id="floatingInput" placeholder="name@example.com" />
          <label for="floatingInput">Adresse Mail</label>
        </div>
        <div class="form-floating justify-content-center">
          <input v-model="password" type="password" class="form-control" id="floatingPassword" placeholder="Password" />
          <label for="floatingPassword">Mot de passe</label>
        </div>

        <button type="submit" class="btn btn-primary w-auto justify-content-center" @click.prevent="userLogin()" v-if="mode == 'login'">Se connecter</button>
        <button type="submit" class="btn btn-primary w-auto justify-content-center" @click.prevent="userRegister()" v-else>Inscription</button>
      </div>
    </fieldset>
  </div>
</template>

<script>

import axios from "axios";


import {  mapState } from 'vuex';


export default {
  name: "signin",
  data: function () {
    return {
      mode: "login",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      message: "",
      errorMessage: "",
    };
  },
  
  computed: {
    ...mapState(['userId', 'admin', 'token'])
  },

  methods: {
    

    switchToCreateAccount: function () {
      this.mode = "create";
    },
    switchToLogin: function () {
      this.mode = "login";
    },
    userLogin() {
      if (this.email == "" || this.password == "") {
        this.message = 'Veuillez entrer votre email et votre mot de passe pour vous connecter'
       // alert("Veuillez entrer votre email et votre mot de passe pour vous connecter");
      } else {
         
        axios //post des informations
          .post("http://localhost:3000/api/users/login", {
            email: this.email,
            password: this.password,
          })
          .then((response) => {
            
            let responseUser = response.data.userId;
            let responseAdmin = response.data.admin;
            let responseToken = response.data.token;
            console.log(response.data)
            //stockage dans le store de vueX
            this.$store.dispatch('setUserId', responseUser)
            this.$store.dispatch('setAdmin', responseAdmin)
            this.$store.dispatch('setToken', responseToken)
           /* sessionStorage.setItem("admin", JSON.stringify(responseAdmin));
            sessionStorage.setItem("user", JSON.stringify(responseUser)); //push de l'id dans la sessionStorage
            sessionStorage.setItem("token", responseToken);*/
            console.log(this.$router);

             axios
      .post("http://localhost:3000/api/users/userOnline/" + responseUser,{
        userOnline: this.$store.state.userId
      }, {
         headers: {
          Authorization: "Bearer " + this.$store.state.token,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));

            if(this.$store.state.admin === true ){
              this.$router.push("panelAdmin")
            }
            else{
              
                this.$router.push("perso")
                
              }
              
          })
          .catch((status) => {
            let errorMessage = JSON.stringify((status));
            {
              this.message = errorMessage;
            }
          });
          
    
      }
    },

    userRegister() {
      if (this.firstName == "" || this.password == "" || this.email == "" || this.lastName == "") {
        alert("Veuillez remplir tous les champs");
      } else {
        axios
          .post("http://localhost:3000/api/users/signup", {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password,
          })
          .then((response) => {
            let responseAdmin = response.data.admin;
            let responseUser = response.data.userId;
            let responseToken = response.data.token;
           this.$store.dispatch('setUserId', responseUser)
            this.$store.dispatch('setAdmin', responseAdmin)
            this.$store.dispatch('setToken', responseToken)

            //push sur une page explicative du site
            this.$router.push("profil");
          })
          .catch((status) => {
            let message = JSON.stringify((status.response.data.error));
            {
              this.errorMessage = message;
            }
          });
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app {
  background-color: none !important  ;
}
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  margin-bottom: 15px;
}
h1 {
  font-size: larger;
  margin-top: 10px;
  
}
.logo {
  margin-bottom: 50px;
}
.form-floating {
  width: 300px;
}
.btn {
  margin-top: 10px;
}
img {
  width: 300px;
}
.connect {
  display: flex;
  justify-content: center;
}
.switch {
  display: flex;
  justify-content: space-around
}
.card__subtitle {
  display: flex;
  justify-content: center;
  cursor: pointer;
  margin-left: 10px;
  margin-right: 10px;
}
fieldset {
  padding: 10px 5px;
  display: flex;
  flex-direction: column;
  background-color: #e9e9e9;
  box-shadow: 2px 5px 5px rgb(34, 33, 33);
  border-radius: 5%;
}
.form-control {
  margin-top: 10px;
}
.mgs {
  display: flex;
  justify-content: center;
  color: red;
}
</style>
