/*const e = require("express");
const { axios } = require("./axios.min");*/

Vue.component("my-modal-component", {
    template: "#my-modal-template",
    data: function () {
        return {
            name: "im here",
        };
    },
    props: ["imageId"],
    mounted: function () {
        console.log("this imageId in component", this.imageId);
    },
    methods: {
        toggleSeen: function () {
            console.log("clicking seen");
            this.seen = !this.seen;
        },
    },
});

new Vue({
    el: "#main", //this is linked to the div id main -- el is vue's name for elements
    data: {
        name: "imageboard",

        images: [],
        imageSelected: null,
        seen: true,
        title: "",
        description: "",
        username: "",
        file: null,

        /* moods: [
            { id: 1, title: ":)" },
            { id: 2, title: ":(" },
            { id: 3, title: ":i" },
        ],
        moodSelected: null,*/
    },
    mounted: function () {
        //mounted is a moment that we know that data is loaded
        //the moment that we access the server
        console.log("my main vue instance has mounted");
        var self = this; //this is to ensure that function does not overwrite the value of this.
        //the argument we give axios is a route we want to have on our server
        axios
            .get("/images")
            .then(function (response) {
                console.log("response", response.data);
                self.images = response.data;
            })
            .catch(function (err) {
                console.log("error in axios", err);
            });
    },
    methods: {
        handleClick: function (e) {
            var formData = new FormData();
            formData.append("title", this.title);
            formData.append("description", this.description);
            formData.append("username", this.username);
            formData.append("file", this.file);
            console.log("this.title", this.title);
            console.log("this.description", this.description);
            //second argument in axios post is an object
            console.log(self.images, "self.images");
            var replacingThis = this;

            axios
                .post("/upload", formData)
                .then(function (response) {
                    console.log("response from post", response.data.imgObject);
                    var newImage = response.data.imgObject;
                    console.log("replacingThis.images", replacingThis.images);
                    replacingThis.images.unshift(newImage);
                    //.unshift here to add image to array
                })
                .catch(function (err) {
                    console.log("err in axios catch", err);
                });
            //this.seen = !this.seen;
            //this. is how we access properties on the vue object.
            //this line is toggling the seen function on and off
        },

        handleChange: function (e) {
            console.log("files", e.target.files[0]);
            console.log("handlechange is running");
            this.file = e.target.files[0];
        },
        /*selectMood: function (id) {
            console.log("user selected a mood");
            console.log("id clicked", id);
            //this.moodSelcted - id is also close to what we want to do to render images
            this.moodSelected = id;
        },*/
        selectImage: function (id) {
            console.log("user selected a image");
            console.log("id clicked", id);
            //this.moodSelcted - id is also close to what we want to do to render images
            this.imgSelected = id;
        },
        closeComponent: function () {
            console.log(
                "the component just used that special keyword by emitting it, i should do something"
            );
        },
    },
});

////////////////////////ENCOUNTER//////////////////////////////
Vue.component("my-first-component", {
    template: "#my-component-template",
    data: function () {
        return {
            name: "ash",
            count: 1,
        };
    },
    props: ["moodId"],
    mounted: function () {
        console.log("this.moodId in component", this.moodId);
    },
    methods: {
        updateCount: function () {
            console.log("button in component goit clicked");
            //adding this. to count gives us access to count
            this.count++;
        },
        notifyParentToDoSth: function () {
            console.log(
                "hey component here i want the main vue instance to know to do something"
            );
            this.$emit("close");
        },
    },
});
/////////////////////////////////////////////////////////////////////////

/*new Vue({
    el: "#imageboardmain",
    data: {
        name: "imageshere",
        images: [],
    },
    mounted: function () {
        console.log("imageboardmain has mounted");
        var self = this;

        axios
            .get("/images")
            .then(function (response) {
                console.log("response in imageboard", response.data);
                self.images = response.data;
            })
            .catch(function (err) {
                console.log("error in axios imgboard", err);
            });
    },
    methods: {
        imageClick: function (image) {
            console.log("imageClick running", image);
        },
    },
});*/
