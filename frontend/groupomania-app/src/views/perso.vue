<template>
  <div class="container">
    <navBar />
    <ul v-if="user.admin === true">
      <li class="nav-item">
        <router-link to="/panelAdmin" class="nav-link">Panel Admin</router-link>
      </li>
    </ul>
    <div class="container pb-cmnt-container">
      <h1>Bienvenue sur ton espace {{ user.firstName }} {{ user.lastName }}</h1>
      <button >UserOnline:{{ userOnline.length }}</button>
      

      <div class="row">
        <h3>Exprimez-vous</h3>
        <hr class="line-color" />
        <div class="col-md-9 col-md-offset-3">
          <div class="panel panel-info">
            <div class="panel-body">
              <div class="form-group green-border-focus">
                <label for="title">Sujet</label><br />
                <input
                  type="text"
                  v-model="title"
                  class="form-control"
                  placeholder="Ecrire un sujet..."
                /><br />

                <br />
                <div class="large-12 medium-12 small-12 cell">
                  
		<hr/>
		<div class="large-12 medium-12 small-12 cell">
			<label>Importer une image
				<input type="file" id="image" class="form-control" accept="image/png, image/jpeg,
                image/bmp, image/gif" name="image" @change="selectFile()" ref="image" />
			</label>
      
			<img v-bind:src="imageUrl" />
			
		</div>
                </div>

                <br />
                <label for="postMsg">Exprimez vous</label>
                <textarea
                  v-model="content"
                  class="form-control"
                  id="postMgs"
                  rows="3"
                  placeholder="Exprimez vous..."
                ></textarea>
                <div class="mgs">{{ message }}</div>
              </div>

              <button
                class="btn btn-primary pull-right"
                type="text"
                @click="postMessage()"
              >
                Partager
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr class="line-color" />
    <button class="posts" @click.prevent="showDropDown">Afficher touts tes Posts</button>
    <div class="card row-8 p-3 border-blue mt-3" v-if="showMenu">
      <div id="card">
        <Post
          v-for="post in posts"
          v-bind:key="post.id"
          :post="post"
          @deletePostEvent="deletePost"
        />
      </div>
    </div>
  </div>
</template>

<script>
import navBar from "../components/navBar.vue";
import Post from "../components/Post.vue";
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "Perso",
  components: {
    navBar,
    Post,
  },
  computed: {
    ...mapState(["userId", "admin", "token", "isLoggedIn"]),
  },
  data() {
    return {
      file: "",
      showPreview: false,
      image:"",
      imagePreview: "",
      userOnline: "",
      user: [],
      posts: [],
      users: [],
      content: "",
      imageUrl: "",
      post: [],
      comment: [],
      createdAt: "",
      title: "",
      message: "",
      firstName: "",
      lastName: "",
      like: "",
      dislike: "",
      showMenu: false,
    };
  },
  created() {
    const userId = this.$store.state.userId;

    axios
      .get("http://localhost:3000/api/users/" + userId, {
        headers: {
          Authorization: "Bearer " + this.$store.state.token,
        },
      })
      .then((response) => (this.user = response.data)
      ) 
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:3000/api/auth/posts/" + userId, {
        headers: {
          Authorization: "Bearer " + this.$store.state.token,
        },
      })
      .then((response) => {
        console.log(response);
        this.posts = response.data;
      })
      .catch((err) => console.log(err));

      
   

      axios 
      .get("http://localhost:3000/api/users/userOnline/" + this.$store.state.userId, 
       {
         headers: {
          Authorization: "Bearer " + this.$store.state.token,
        },
      })
       .then((res) => {
        console.log(res);
        this.userOnline = res.data
       
      })
      .catch((err) => console.log(err))
  },

  methods: {
    showDropDown: function () {
      this.showMenu = !this.showMenu;
    },
     
  

    selectFile() {
      this.image = this.$refs.image.files[0];
      this.imageUrl = URL.createObjectURL(this.image);
    },

    postMessage() {
      if (this.content == "" || this.title == "") {
        this.message = "Veuillez écrire un sujet et un message" ;
      } else {

        const formData = new FormData();
        formData.append("image", this.image);
        formData.append("userId", this.$store.state.userId);
        formData.append("content", this.content);
        formData.append("title", this.title);


        axios
          .post(
            "http://localhost:3000/api/auth/posts/post",formData,

            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + this.$store.state.token,
              },
            }
          )
          .then((response) => {
            console.log(response);
            this.content = "";
            this.title = "";
            this.imag
            const userId = this.$store.state.userId;
            axios
              .get("http://localhost:3000/api/auth/posts/" + userId, {
                headers: {
                  Authorization: "Bearer " + this.$store.state.token,
                },
              })
              .then((response) => {
                console.log(response);
                this.posts = response.data;
                this.message = "";
              })
              .catch((err) => console.log(err));
          });
      }
    },

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



  },
};
</script>
<style scoped>
#app {
  background-color: #d1d1eb;
}
</style>

<style scoped>
div.container img {
  max-width: 200px;
  max-height: 200px;
  display: block;
  margin: auto;
  margin-top: 20px;
  margin-bottom: 20px;
}
.posts {
  background-color: white;
  border-radius: 10px;
  padding: 15px;
}
.posts:hover {
  transform: scale(1.2);
  transition: 0.5s;
}
body {
  background-color: rgb(218, 214, 210);
}
.container {
  font-family: "Comic Sans MS";
}
.nav-item {
  display: flex;
  justify-content: center;
  list-style: none;
}
.nav-link {
  border: 1px solid black;
  border-radius: 10px;
  text-decoration: none;
}
.nav-link:hover {
  transform: scale(1.2);
}
h1 {
  font-family: "Rowdies", cursive;
  color: black;
}
.line-color {
  height: 3px;
}
.card {
  margin-top: 10px;
  border: 1px solid rgb(70, 68, 68);
  box-shadow: 2px 3px 3px rgb(175, 186, 233);
  background-color: rgb(175, 186, 233);
  
  
}

.form {
  margin-top: 30px;
}
.form-control {
  border-radius: 20px;
}
.form-group {
  margin-top: 30px;
}
label {
  font-family: "Comic Sans MS", cursive;
  color: rgb(48, 48, 172);
}
.row {
  margin-bottom: 50px;
  margin-top: 50px;
  background-color: rgba(161, 173, 172, 0.87);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 5px;
  border: 1px solid;
}
.btn {
  margin: 10px;
  padding: 10px;
}
.btn:hover {
  transform: scale(1.2);
  transition: 0.5s;
}
.mgs {
  color: red;
}
</style>
