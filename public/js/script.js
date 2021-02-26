/*const e = require("express");
const { axios } = require("./axios.min");*/

console.log("sanity check");

//this is the vue constructor
//creating a vue instance
new Vue({
    el: "#main", //this is linked to the div id main -- el is vue's name for elements
    data: {
        name: "Fennel",
        seen: false, //this working with the v-if statement in the index.html
        cities: [],
        //this is how we track what is entered into each of these fields via v-model
        title: "",
        description: "",
        username: "",
        file: null,
    },
    mounted: function () {
        //mounted is a moment that we know that data is loaded
        //the moment that we access the server
        console.log("my main vue instance has mounted");
        var self = this; //this is to ensure that function does not overwrite the value of this.
        //the argument we give axios is a route we want to have on our server
        axios
            .get("/cities")
            .then(function (response) {
                console.log("response", response.data);
                self.cities = response.data;
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
            axios
                .post("/upload", formData)
                .then(function (response) {
                    console.log("response from post", response);
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
    },
});

new Vue({
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
});
