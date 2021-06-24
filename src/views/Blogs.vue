<template>
  <div class="blog-card-wrap">
    <div class="blog-cards container">
      <div class="toggle-edit" v-if="user">
        <button class="group-button">All</button>
        <button class="group-button">Technology</button>
        <button class="group-button">Nature</button>
        <button class="group-button">Health</button>
        <button class="group-button">Science</button>
        <span>Toggle Editing Post</span>
        <input type="checkbox" v-model="editPost" />
      </div>
      <BlogCard
        :post="post"
        v-for="(post, index) in blogPosts"
        :key="index"
      />
    </div>
  </div>
</template>

<script>
import BlogCard from "../components/BlogCard.vue";
export default {
  name: "blogs",
  components: { BlogCard },
  computed: {
    blogPosts() {
      return this.$store.state.blogPosts;
    },
    editPost:{
        get(){
            return this.$store.state.editPost
        },
        set(payload){
            this.$store.commit("toggleEditPost",payload)
        }
    },
    user(){
      // returns true or false if user is signed in or not
      return this.$store.state.user;
    }
  },
  beforeDestroy(){
      //will place the state of icons on homepage to false
      this.$store.commit("toggleEditPost", false)
  }
};
</script>

<style lang="scss" scoped>
.blog-cards {
  position: relative;

.top{
      display: flex;
    align-items: center;
    position: absolute;
    top: -70px;
    right: 0;

}
  .toggle-edit {
    display: flex;
    align-items: center;
    position: absolute;
    top: -70px;
    right: 0;

    .group-button{
          padding: 12px;
    justify-content: center;
    margin: 2px;
    }

    span {
      margin-right: 16px;
    }

    input[type="checkbox"] {
      position: relative;
      border: none;
      -webkit-appearance: none;
      background: #fff;
      outline: none;
      width: 80px;
      height: 30px;
      border-radius: 20px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    input[type="checkbox"]:before {
      content: "";
      position: absolute;
      width: 30px;
      height: 30px;
      border-radius: 20px;
      top: 0;
      left: 0;
      background: #FF3467;
      transform: scale(1.1);
      transition: 750ms ease all;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    input:checked[type="checkbox"]:before {
      background: #fff;
      left: 52px;
    }
  }
}
</style>
