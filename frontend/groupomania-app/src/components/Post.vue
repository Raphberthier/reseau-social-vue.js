<template>
  <main>
    <div class="d-flex justify-content-between mt-2">
      <div class="d-flex flex-row">
        <div class="d-flex flex-column">
          <h6 class="mb-0">{{ post.user.firstName }} {{ post.user.lastName }} <img v-bind:src="post.user.image" class="avatar"/></h6>
          
          <span class="date"> {{ formatDate(post.createdAt) }} </span>
        </div>
      </div>
    </div>
    <div class="titleCon">
      <h2 class="title">Titre :</h2>
      <p class="title" v-if="post.userId != user.id">{{ post.title }}</p>
      <input type="text" id="post.title" v-if="post.userId === user.id || user.admin === true" v-model="post.title" />
      <hr />
       <img v-bind:src="post.image" class="image-post
       " v-show="showPreview"/>
      <h2 class="title">Sujet :</h2>
      <p class="content" v-if="post.userId != user.id">{{ post.content }}</p>
      <input id="post.content" v-if="post.userId === user.id || user.admin === true" v-model="post.content" />
      <div class="like"><button class="btn-like" @click="addLike">{{likes.length}} like</button><button class="btn-dislike" @click="addDislike">{{disLikes.length}} unlike</button></div>
      <div class="msg"> {{ errorMessage }}</div>
    </div>
    <div class="mt-2 d-flex justify-content-end">
      <button class="btn btn-primary btn-sm ms-1" v-if="post.userId === user.id || user.admin === true" @click="modifyPost">Modifier</button>

      <button class="btn btn-primary btn-sm ms-1" v-if="post.userId === user.id || user.admin === true" @click="deletePostEvent">Supprimer</button>
    </div>
    <br />
    <button  @click.prevent="showDropDown">{{ comments.length }} Commentaires </button>
    <div class="form">
        <input class="form-control" v-model="comment" placeholder="Ecrire un commentaire..." />
        <div class="mgs">{{ message }}</div>

        <div class="mt-2 d-flex justify-content-end">
          
          <button class="btn btn-outline-secondary btn-sm" @click.prevent="createCom(post)">Poster</button>
          <br />
        </div>
      </div>
    <div class="card p-3 mt-3" v-if="showMenu">
      
      <div class="d-flex flex-column mt-2" v-for="comment in comments" v-bind:key="comment.id" :comment="comment">
        <div class="d-flex flex-column">
          <div class="d-flex flex-column">
            <h6 class="mb-0">{{ comment.user.firstName }} {{ comment.user.lastName }}</h6>
            <span class="date">{{ formatDate(comment.createdAt) }} :</span>
            <br />
          </div>
        </div>
        <div class="com d-flex justify-content-between">
          <input type="text" id="comment.comment"  v-model="comment.comment">
          <p class="content">{{ comment.comment }}</p>
          <button class="btn btn-outline-secondary btn-sm" v-if="comment.userId === user.id || user.admin === true" @click.prevent="modifyCom(comment)">Modifier</button>
          <button class="btn btn-outline-secondary btn-sm"  v-if="comment.userId === user.id || user.admin === true" @click.prevent="deleteCom(comment)">Supprimer
            <span class="trash"><i class="fas fa-trash"></i></span>
          </button>
        </div>
      </div>
      
    </div>
  </main>
</template>
<script>

import axios from "axios";
import { mapState } from 'vuex';

export default {
  name: "Post",
  computed: {
  ...mapState(['userId','admin','token'])
},
  data() {
    return {
      showMenu: false,
      user: [],
      comments: [],
      createdAt: "",
      comment: [],
      firstName: "",
      lastName: "",
      title: "",
      image: "",
      message: "",
      content: "",
       file: '',
				showPreview: true,
				imagePreview: '',
        disLike: [],
        disLikes: [],
      like: [],
      likes: [],
      dislike: "",
      posts: [],
      errorMessage: "",
    };
  },
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  created() {
    const userId = this.$store.state.userId;
    axios
      .get("http://localhost:3000/api/users/" + userId, {
        headers: {
          Authorization: "Bearer " + this.$store.state.token,
        },
      })
      .then((response) => (this.user = response.data))
      .catch((err) => console.log(err));
  //Appel des commentaires
    axios
      .get("http://localhost:3000/api/auth/comments/" + this.post.id, {
        headers: {
          Authorization: "Bearer " + this.$store.state.token,
        },
      })
      .then((response) => {
     
        console.log(response);
        this.comments = response.data.comments;
      })
      .catch((err) => console.log(err));
  //Appel des likes
      axios
        .get("http://localhost:3000/api/auth/posts/like/" + this.post.id, {
          headers: {
          Authorization: "Bearer " + this.$store.state.token,
        },
        })
        .then((response) => {
          this.likes = response.data
          console.log(response);
        })
        .catch((err) => console.log(err));
  //Apell des dislikes
         axios
        .get("http://localhost:3000/api/auth/posts/dislike/" + this.post.id, {
          headers: {
          Authorization: "Bearer " + this.$store.state.token,
        },
        })
        .then((response) => {
          this.disLikes = response.data
          console.log(response);
        })
        .catch((err) => console.log(err));
  },
  
  methods: {
    

    showDropDown: function() {
			this.showMenu = !this.showMenu;
		},

    formatDate(date) {
      return new Date(date).toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      });
    },
    modifyPost() {
      axios
        .put(
          "http://localhost:3000/api/auth/posts/" + this.post.id,
          { title: this.post.title, content: this.post.content },
          {
            headers: {
              Authorization: "Bearer " + this.$store.state.token,
            },
          }
        )
        .then((response) => {
          console.log(response);
          (this.content = response.content), (this.title = response.title);
        })
        .catch((err) => console.log(err));
        
    },
    addLike(){
     
        
      axios
        .post("http://localhost:3000/api/auth/posts/like/" + this.post.id  ,
        {
          postId: this.post.id,
          userId: this.$store.state.userId
           },
          {
            headers: {
              Authorization: "Bearer " + this.$store.state.token,
            },
          })
          .then((res) => {
            
            console.log(res)
          })
          
    },
    addDislike(){
      axios
        .post("http://localhost:3000/api/auth/posts/dislike/" + this.post.id  ,
        {
          postId: this.post.id,
          userId: this.$store.state.userId
           },
          {
            headers: {
              Authorization: "Bearer " + this.$store.state.token,
            },
          })
          .then((res) => {
            
            console.log(res)
          })
    },
    deletePostEvent() {
      this.$emit("deletePostEvent", this.post);
    },
    

    createCom(post) {
      if (this.comment == "") {
        this.message = "Veuillez écrire un commentaire ";
      } else {
        
        axios
          .post(
            "http://localhost:3000/api/auth/comments/",
            { comment: this.comment, postId: post.id, userId: this.$store.state.userId },
            {
              headers: {
                Authorization: "Bearer " + this.$store.state.token,
              },
            }
          )
          .then((response) => {
            console.log(response);
            this.comment = "";
            axios
              .get("http://localhost:3000/api/auth/comments/" + this.post.id, {
                headers: {
                  Authorization: "Bearer " + this.$store.state.token,
                },
              })
              .then((response) => {
                console.log(response);
                this.comments = response.data;
                this.message = "";
                location.reload();
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      }
    }, 

    modifyCom(comment) {
     
      axios
        .put(
          "http://localhost:3000/api/auth/comments/" + this.post.id+ "/" + comment.id,
          { comment: this.comment},
          {
            headers: {
              Authorization: "Bearer " + this.$store.state.token,
            },
          }
        )
        .then((response) => {
          console.log(response);
          (this.comments = response.data);
        })
        .catch((err) => console.log(err));
        
    },

    deleteCom(comment) {
      axios
        .delete("http://localhost:3000/api/auth/comments/" + comment.id, {
          headers: {
            Authorization: "Bearer " + this.$store.state.token,
          },
        })
        .then((response) => {
          console.log(response);
          axios
            .get("http://localhost:3000/api/auth/comments/" + this.post.id, {
              headers: {
                Authorization: "Bearer " + this.$store.state.token,
              },
            })
            .then((response) => {
              console.log(response);
              this.comments = response.data;
              location.reload();
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style scoped>
h1 {
  font-family: "Comic Sans MS", cursive;
  color: black;
}
h2 {
  font-size: smaller;
}
.card {
  border: 1px solid rgb(70, 68, 68);
  box-shadow: 2px 3px 3px rgb(102, 100, 100);
  background-color: white;
  margin-bottom: 30px;
}
input {
  width: 50%;
  margin-bottom: 10px;
}
.form {
  margin-top: 30px;
}
.trash {
  color: red;
}
.image-post{
  width: 200px ;
}
.titleCon {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
}
.title {
  font-weight: bolder;
}
.mgs {
  color: red;
}
.avatar {
  width: 70px;
  border-radius: 50%;
}
.btn-primary:hover {
  transform: scale(1.2);
  transition: 0.5s;
} 

.btn-like{
  height: 30px;
  margin: 10px;
}
.btn-dislike{
  height: 30px;
  margin: 10px;
}
</style>
