/*const e = require("express");
const { axios } = require("./axios.min");*/

/////////////////COMMENTS COMPONENT//////////////////////////
Vue.component("my-comments-component", {
    template: "#my-comments-template",
    data: function () {
        ///our data function us returning an object with these three properties
        return {
            comments: [],
            commentSelected: null,
            username: "",
            comment: "",
        };
    },
    props: ["imageId"],
    mounted: function () {
        console.log("i am in the comments component");
        console.log("imageid in comments mounted", this.imageId);
        var imageClicked = this.imageId;
        console.log("imageid in comments", imageClicked);
        var replacingThis = this;
        axios
            .get("/get-comments/" + imageClicked)
            .then(function (response) {
                console.log(
                    "response in /get-comments/:imageId",
                    response.data
                );
                replacingThis.comment = response.data[0].comment;
                replacingThis.username = response.data[0].username;
                replacingThis.comments = response.data;
            })
            .catch(function (err) {
                console.log("error in imageID axios", err);
            });
    },
    watch: {
        imageId: function () {
            var imageClicked = this.imageId;
            var replacingThis = this;
            axios
                .get("/get-comments/" + imageClicked)
                .then(function (response) {
                    replacingThis.comment = response.data[0].comment;
                    replacingThis.username = response.data[0].username;
                    replacingThis.comments = response.data;
                })
                .catch(function (err) {
                    console.log("error in comments WATCH", err);
                });
        },
    },
    methods: {
        commentSubmit: function () {
            console.log("telling parent to submit");
            console.log("what id do i have", this.imageId);
            // console.log("comment", this.comment);
            var replacingThis = this;
            console.log("replacingThis", replacingThis.imageId);
            var fullComment = {
                comment: this.comment,
                username: this.username,
                id: this.imageId,
            };

            console.log("this is my full comment", fullComment);
            axios
                .post("/comment", fullComment)
                .then(function (response) {
                    console.log(
                        "response.data in axios comment post",
                        response.data
                    );
                    /*replacingThis.comments = response.data.comments;*/
                    replacingThis.comments.unshift(response.data);
                })
                .catch(function (err) {
                    console.log("error in comment sumbit post", err);
                });
        },
    },
});
////////////////////MODAL COMPONENT////////////////////////////

Vue.component("my-modal-component", {
    template: "#my-modal-template",
    data: function () {
        return {
            name: "im here",
            seen: true,
            url: "",
            title: "",
            description: "",
            username: "",
        };
    },

    props: ["imageId"],
    mounted: function () {
        console.log("this imageId in component", this.imageId);
        //var replacingThis = this;

        //var imageClicked = this.imageId;
        //console.log("imageClicked", imageClicked);
        var replacingThis = this;
        axios
            .get("/images/" + replacingThis.imageId)
            .then(function (response) {
                console.log("response in axios", response);
                //console.log("response", response.data[0]);
                // imageClicked = response.data[0];
                replacingThis.url = response.data[0].url;
                replacingThis.title = response.data[0].title;
                replacingThis.description = response.data[0].description;
                replacingThis.username = response.data[0].username;
            })
            .catch(function (err) {
                console.log("error in imageID axios", err);
                replacingThis.$emit("close");
            });
    },
    watch: {
        imageId: function () {
            console.log("the watcher is reporting idchange");
            var replacingThis = this;
            axios
                .get("/images/" + replacingThis.imageId)
                .then(function (response) {
                    console.log("response in axios", response);
                    //console.log("response", response.data[0]);
                    // imageClicked = response.data[0];
                    replacingThis.url = response.data[0].url;
                    replacingThis.title = response.data[0].title;
                    replacingThis.description = response.data[0].description;
                    replacingThis.username = response.data[0].username;
                })
                .catch(function (err) {
                    console.log("error in imageID WATCHER", err);
                    replacingThis.$emit("close");
                });
            //inside here we should do exactly the same thing that our mounted function (get new images info) this is so when you change your url the image changes reflect this new id
        },
    },
    methods: {
        notifyParentToDoSth: function () {
            console.log(
                "hey component here i want the main vue instance to know to do something"
            );
            this.$emit("close");
        },
    },
});
///////////////////////MAIN VUE////////////////////////////

new Vue({
    el: "#main", //this is linked to the div id main -- el is vue's name for elements
    data: {
        name: "imageboard",

        images: [],
        imageSelected: location.hash.slice(1),
        title: "",
        description: "",
        username: "",
        file: null,
        seen: true,
    },
    mounted: function () {
        //mounted is a moment that we know that data is loaded
        //the moment that we access the server
        console.log("my main vue instance has mounted");
        var self = this;
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
        window.addEventListener("hashchange", function () {
            console.log("hashchange has fired", location.hash);
            self.imageSelected = location.hash.slice(1);
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
            // console.log(self.images, "self.images");
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
            //this. is how we access properties on the vue object.
        },

        handleChange: function (e) {
            console.log("files", e.target.files[0]);
            console.log("handlechange is running");
            this.file = e.target.files[0];
        },
        selectImage: function (id) {
            // console.log("user selected a image");
            console.log("id clicked", id);
            this.imageSelected = id;
        },

        closeComponent: function () {
            console.log(
                "the component just used that special keyword by emitting it, i should do something"
            );
            console.log("this in close component", this);
            this.imageSelected = null;
            location.hash = "";
        },
        doMore: function () {
            console.log("more button last image it", this.images.length);
            var lowestId = this.images[this.images.length - 1].id;
            var replacingThis = this;
            axios.get("/more/" + lowestId).then(function (response) {
                console.log("response.data in more", response.data);
                replacingThis.images = [
                    ...replacingThis.images,
                    ...response.data,
                ];

                if (response.data.length <= 0) {
                    replacingThis.seen = !replacingThis.seen;
                }
            });
        },
    },
});

////////////////////////ENCOUNTER//////////////////////////////
/*Vue.component("my-first-component", {
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
});*/
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
