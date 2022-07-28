<template>
     <div class="container">
      <navBar/>
      <h1>Profil de {{user.firstName}} {{user.lastName}}</h1>
     
            <div class="card p-4 mt-3">
                <div class="first">
                    <h6 class="heading">{{user.firstName}} {{user.lastName}} </h6>
                    <img v-bind:src="user.image" class="avatar
       " />
                    
                    <div class="time d-flex flex-row align-items-center justify-content-between mt-3">
                    </div>
                </div>
                <div class="second d-flex flex-row mt-2">
                    <div class="main">
                        <div class="d-flex flex-row mb-1"> <span>Votre email: {{user.email}} </span>
                        </div>
                    </div>
                </div> 
                <hr class="line-color">
                <div class="modif">
                <button @click.prevent="showDropDownEmail"   class="btn btn-success btn-block">Changer mon Email</button></div>
                <div class="password" v-if="showMenuEmail" >
                  
                  <label  class="change" for="user-email">Email : </label><br/>
                  <input id="user-email" v-model="user.email">
                  <div class="third "> <button class="btn btn-success btn-block" @click.prevent="modifyProfil(user)"> Modifier</button></div>
                </div>
                <div class="modif">
                <button @click.prevent="showDropDownName" class="btn btn-success btn-block">Changer mon Nom et Prenom</button></div>
                <div class="password" v-if="showMenuName">
                  
                  <label class="change" for="user-firstName">Nom : </label><br/>
                  <input id="user-email" v-model="user.firstName">
                  <label class="change" for="user-firstName">Prenom : </label><br/>
                  <input id="user-email" v-model="user.lastName">
                  <div class="third"> <button class="btn btn-success btn-block" @click.prevent="modifyName(user)"> Modifier</button></div>
                </div>
                <hr class="line-color">

               <div  class="d-flex justify-center">
               <button class="btn btn-success btn-block" @click.prevent="showDropDownAvatar">Modifier photo de profil</button> 
              <div class="modif-avatar" v-if="showMenuAvatar">
              <label >Votre Avatar
				<input type="file" id="image" class="form-control" accept="image/png, image/jpeg,
                image/bmp, image/gif" name="image" @change="selectFile()" ref="image" />
			
      </label>
   
            
 <img v-bind:src="user.image" class="avatar
       " />
       <button class="btn btn-success btn-block" @click="modifyImageProfil()"> Modifier Avatar</button>
       </div></div>
                <div class="third mt-4"> <button class="btn btn-success btn-block" @click.prevent="deleteUser()"><i class="fas fa-trash"></i> Supprimer le compte</button>
                </div>
            </div>
        </div>
</template>



<script>
//import modifProfil from '../components/modifProfil.vue'
import navBar from '../components/navBar.vue'
import axios from 'axios'
import { mapState } from 'vuex';


export default {
  name:'profil',
  components:{
    navBar,
    
},
  computed: {
  ...mapState(['userId','admin','token'])
},
  data(){
      return{
        showMenuEmail: false,
        showMenuName: false,
        showMenuAvatar: false,
        image:"",
        imageUrl:"",
        imageProfil:"",
          selectedFile: null,
          user:"",
          email:"",
          passeword:"",
     }
  },
created(){
const userId= this.$store.state.userId
const admin= this.$store.state.admin
  axios.get("http://localhost:3000/api/users/"+ userId + admin, {
      headers: {
          Authorization: "Bearer " + this.$store.state.token,
      },
    })
    .then((response)=> 
    (this.user = response.data))
    .catch((err) => console.log(err));if(this.user.image == " http://localhost:3000/images/james-webb-et-voici-les-premieres-images-1.webp"){
        window.alert("Bienvenue sur DarkRoom vous pouvais changer votre photo de profil sur cette page")
      }
    
},


methods:{

  

 onFileChanged (event) {
    this.selectedFile = event.target.files[0]
  },
    onUpload() {
      const formData =new FormData()
      formData.append('imageUrl', this.selectedFile, this.selectedFile.name)
      const userId= this.$store.state.userId
        axios.put('http://localhost:3000/api/users/'+ userId, formData,
      {headers: {
                Authorization: "Bearer " +this.$store.state.token
               
            },
      })
    .then((response)=>{console.log(response)
    this.selectedFile = response.selectedFile},
    window.alert('modification effectué'))
    .catch((err)=> console.log(err))
  },
    showDropDownAvatar: function(){
      this.showMenuAvatar = !this.showMenuAvatar;
    },
  showDropDownEmail: function() {
			this.showMenuEmail = !this.showMenuEmail;
		},

    showDropDownName: function() {
      this.showMenuName = !this.showMenuName;
    },

selectFile() {
      this.image = this.$refs.image.files[0];
      this.imageUrl = URL.createObjectURL(this.image);
    },

  modifyImageProfil(){
    const formData = new FormData();
    formData.append("image", this.image);
  
    axios.put('http://localhost:3000/api/users/'+ this.$store.state.userId, formData, 
    
    {
      headers: {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + this.$store.state.token,
              },
    })
    .then((response)=>{
      console.log(response)
      
    })
    .catch((err)=> console.log(err))
  },

   modifyProfil(user){
   
    
    axios.put('http://localhost:3000/api/users/'+ user.id,{
     email: user.email},
      {headers: {
                Authorization: "Bearer " + this.$store.state.token,
            },
      })
    .then((response)=>{console.log(response)
    this.email=response.email},
    window.alert('modification effectué'))
    .catch((err)=> console.log(err))
  },

   modifyName(user){
   
    axios.put('http://localhost:3000/api/users/'+ user.id,{
     firstName: user.firstName , lastName: user.lastName},
      {headers: {
                Authorization: "Bearer " + this.$store.state.token,
            },
      })
    .then((response)=>{console.log(response)
    this.email=response.email},
    window.alert('modification effectué'))
    .catch((err)=> console.log(err))
  },
  
   deleteUser() {
              const userId= this.$store.state.userId
               axios.delete("http://localhost:3000/api/users/" + userId, {
                    headers: { Authorization: "Bearer " + this.$store.state.token },
               })
                    .then((res) => console.log(res))
                    sessionStorage.clear();
                    this.$router.push("/")
                    .catch((err) => console.log(err));
                    
                    
              
          },
}
};
</script>
<style scoped>
#app{
   font-family
   :Comic Sans MS, cursive;
  background-color: #cccce2;
}
body {
    background-color: #eee;
}

h1{
  display: flex;
  justify-content: center;
  color:black;
  font-family: 'Rowdies', cursive;
}
.modif {
  margin: 10px;
}
.avatar {
  width: 100px;
  border-radius: 50%;
}
.card {
    background-color: #6877fab9;
    border-radius: 20px
}
.heading {
    font-weight: 700
}

.change {
  margin-right: 5px;
}
input {
  margin-right: 5px;
  
}
.btn {
    border-radius: 15px !important;
    color: black;
    background-color:  rgb(255, 255, 255);
    border-color: white;
    transition: 0.8s;
}
.btn:hover {
  transform: scale(1.2);
}

.line-color {
    height: 3px
}
.password {
  display: flex;
  align-items: center;
  width: fit-content;
  background-color: #eee;
  padding: 10px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
input[type=email] {
  border: none;
  border-bottom: 2px solid black;
}
</style>