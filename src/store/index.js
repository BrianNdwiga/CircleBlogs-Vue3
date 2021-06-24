import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../firebase/firebaseInit";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        blogPosts: [],
        postLoaded: null,
        blogHTML: "Write your blog title here...",
        blogTitle: "",
        blogCategory: "",
        blogPhotoName: "",
        blogPhotoFileURL: null,
        blogPhotoPreview: null,
        editPost: null,
        user: null,
        profileEmail: null,
        profileFirstName: null,
        profileLastName: null,
        profileUsername: null,
        profileId: null,
        profileInitials: null,
    },
    getters: {
        // we slice the posts and get the first two on the home page
        blogPostsFeed(state) {
            return state.blogPosts.slice(0, 2);
        },
        // slice the 2-6 for the blog cards for the cards
        blogPostsCards(state) {
            return state.blogPosts.slice(2, 6);
        },
    },
    mutations: {
        newBlogPost(state, payload) {
            state.blogHTML = payload;
            // console.log(state.blogHTML);
        },
        updateBlogTitle(state, payload) {
            state.blogTitle = payload;
        },
        updateBlogCategory(state, payload) {
            state.blogCategory = payload;
        },
        fileNameChange(state, payload) {
            state.blogPhotoName = payload;
        },
        createFileURL(state, payload) {
            state.blogPhotoFileURL = payload;
        },
        openPhotoPreview(state) {
            state.blogPhotoPreview = !state.blogPhotoPreview;
        },
        toggleEditPost(state, payload) {
            state.editPost = payload;
            // console.log(state.editPost);
        },
        setBlogState(state, payload) {
            state.blogTitle = payload.blogTitle;
            state.blogCategory = payload.blogCategory;
            state.blogHTML = payload.blogHTML;
            state.blogPhotoFileURL = payload.blogCoverPhoto;
            state.blogPhotoName = payload.blogCoverPhotoName;
        },
        filterBlogPost(state, payload) {
            // get that specific id in the payload
            state.blogPosts = state.blogPosts.filter((post) => post.blogID !== payload)
        },
        updateUser(state, payload) {
            state.user = payload;
        },
        setProfileInfo(state, doc) {
            state.profileId = doc.id;
            state.profileEmail = doc.data().email;
            state.profileFirstName = doc.data().firstName;
            state.profileLastName = doc.data().lastName;
            state.profileUsername = doc.data().username;
        },
        setProfileInitials(state) {
            state.profileInitials = state.profileFirstName.match(/(\b\S)?/g).join("");
            state.profileLastName.match(/(\6\s)?/g).join("");
        },
        changeFirstName(state, payload) {
            state.profileFirstName = payload;
        },
        changeLastName(state, payload) {
            state.profileLastName = payload;
        },
        changeUsername(state, payload) {
            state.profileUsername = payload;
        },
    },
    actions: {
        async getCurrentUser({ commit }) {
            const dataBase = await db
                .collection("users")
                .doc(firebase.auth().currentUser.uid);
            // get currentuser
            const dbResults = await dataBase.get();
            // mutation called setprofileinfo
            commit("setProfileInfo", dbResults);
            commit("setProfileInitials");
            console.log(dbResults);
        },
        async getPost({ state }) {
            const database = await db.collection("blogposts").orderBy("date", "desc");
            const dbResults = await database.get();
            dbResults.forEach((doc) => {
                if (!state.blogPosts.some((post) => post.blogID === doc.id)) {
                    const data = {
                        blogID: doc.data().blogID,
                        blogHTML: doc.data().blogHTML,
                        blogCoverPhoto: doc.data().blogCoverPhoto,
                        blogTitle: doc.data().blogTitle,
                        blogCategory: doc.data().blogCategory,
                        blogDate: doc.data().date,
                        blogCoverPhotoName: doc.data().blogCoverPhotoName,
                    };
                    state.blogPosts.push(data);
                }
            });
            state.postLoaded = true;
            // returns our bloginfo
            // console.log(state.blogPosts);
        },
        async updatePost({ commit, dispatch }, payload) {
            commit("filterBlogPost", payload);
            await dispatch("getPost");
        },
        async deletePost({ commit }, payload) {
            const getPost = await db.collection("blogPosts").doc(payload);
            // omits the blog
            await getPost.delete();
            commit("filterBlogPost", payload);
        },
        async updateUserSettings({ commit, state }) {
            const database = await db.collection("users").doc(state.profileId);
            await database.update({
                firstName: state.profileFirstName,
                lastName: state.profileLastName,
                username: state.profileUsername,
            });
            commit("setProfileInitials");
        },
    },
    modules: {},
});