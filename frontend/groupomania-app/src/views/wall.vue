<template>

<div class="container">
    <navBar />
    <h1>Fil des sujets</h1>
                        
            <div class="card p-3 border-blue mt-3"> 
                <div id="card">
                <Post v-for="post in posts" v-bind:key="post.id" :post="post" @deletePostEvent="deletePost" />
                
                </div>
            </div>
           
        
</div>
</template>

<script>
import navBar from '../components/navBar.vue'
import Post from '../components/Post.vue'
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  name:'Wall',
  components:{
    navBar,
    Post
  },
  computed: {
  ...mapState(['userId','admin','token'])
},
  data(){
      return{
          users:[],
          posts:[],
          comments:[],
        
        
     }
  },
   created(){
        axios.get("http://localhost:3000/api/users" , {
            headers: {
               Authorization: "Bearer " + this.$store.state.token,
            },
         })
         .then((response)=> 
         (this.users = response.data))
         .catch((err) => console.log(err));
     axios.get("http://localhost:3000/api/auth/posts", {
             headers: {
                 Authorization: "Bearer " + this.$store.state.token,
             },
         })
         .then((response)=>{console.log(response),
         this.posts= response.data})
         .catch((err) => console.log(err));
   },
  methods:{
       deletePost(item) {
      axios
        .delete("http://localhost:3000/api/auth/posts/" + item.id, {
          headers: {
            Authorization: "Bearer " + this.$store.state.token,
          },
        })
        .then((response) => {
          console.log(response);
          this.posts = this.posts.filter((post) => post.id != item.id);
          
        })
        .catch((err) => console.log(err));
    },
  }
}
</script>



<style scoped>
.container{
     font-family: 'Comic Sans MS', cursive;
     display: flex;
     flex-direction: column;
     justify-content: center;
}
h1{
    font-family: 'Rowdies', cursive;
    color:black;
}
.card{
   border: 1px solid rgb(70, 68, 68);
   box-shadow: 2px 2px 2px rgb(70, 68, 68);
    background-color: rgb(218, 212, 212);
}
.form{
    margin-top: 30px;
}
</style>