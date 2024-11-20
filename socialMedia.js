class Post {
    constructor(content, userun, timdat) {
        this.content = content;
        // this.postId = id; // Unique identifier
        this.posterUN = userun; // poster's username

        this.comments = [];
        this.views = [];
    }
}

class Comment {
    constructor(content, poster, post, timeanddate) {
        this.content = content;
        this.poster = poster;
        this.post = post;
        this.timdat = timeanddate
    }
}
class User {
    constructor(username, name) {
        this.name = name; // User's name
        this.username = username; // Unique identifier

        this.age = -1;
        this.gender = "n/a";
        this.nicknames = [];
        this.workplace = null;
        this.location = null; 

        this.follows = []; // List of users this user is following
        this.friends = [];
        this.coworkers = [];
        this.blocked = [];

        this.authposts = [];
        this.readposts = [];
        this.owncomments = [];
    }
    setage(age) {
        this.age = age;
    }
    setgender(gender) {
        this.gender = gender;
    }
    setwork(workplace) {
        this.workplace = workplace;
    }
    setlocation(loc) {
        this.location = loc;
    }
    follow(user) {
        if (!this.follows.includes(user)) {
            this.follows.push(user);
        }
    }
    addnickname(name) {
        if (!this.nicknames.includes(name)) {
            this.nicknames.push(name);
        }
    }
    addFriend(user) {
        if (!this.friends.includes(user)) {
            this.friends.push(user);
        }
    }

    addcoWorker(user) {
        if (!this.coworkers.includes(user)) {
            this.coworkers.push(user);
        }
    }



    getFollowing() {
        return this.follows.map(user => user.name);
    }

    getFriends() {
        return this.friends.map(user => user.name);
    }

    getcoWorkers() {
        return this.coworkers.map(user => user.name);
    }


    makepost(content, timdat) {
        const post = new Post(content, this.username, timdat);
        this.authposts.push(post);
    }

    viewPost (post){
        if (!post.views.includes(this.username)) {
            post.views.push(this.username);
            this.readposts.push(post);
        }
    }

    makeComment (content, post, timdat){
        const comment = new Comment(content, this.username, post, timdat);
        this.owncomments.push(comment);
        post.comments.push(comment)
    }
}

class SocialGraph {
    constructor() {
        this.users = new Map(); // Store users by username
    }

    addUser(username, name) {
        if (!this.users.has(username)) {
            const user = new User(username, name);
            this.users.set(username, user);
            return user;
        }
        throw new Error(`User with username ${username} already exists.`);
    }

    getUser(username) {
        return this.users.get(username);
    }

    connectUsersFol(followerUN, followingUN) {
        const follower = this.getUser(followerUN);
        const following = this.getUser(followingUN);
        if (follower && following) {
            follower.follow(following);
        } else {
            throw new Error(`Invalid username(s): ${followerUN}, ${followingUN}`);
        }
    }

    connectUsersFrnd(userUN1, userUN2) {
        const friendee = this.getUser(userUN1);
        const friender = this.getUser(userUN2);
        if (friendee && friender) {
            friendee.addFriend(friender);
            friender.addFriend(friendee);
        } else {
            throw new Error(`Invalid user username(s): ${userUN1}, ${userUN2}`);
        }
    }

    connectUserscoWrkr(userId1, userId2) {
        const cowkr1 = this.getUser(userId1);
        const cowkr2 = this.getUser(userId2);
        if (cowkr1 && cowkr2) {
            cowkr2.addcoWorker(cowkr1);
            cowkr1.addcoWorker(cowkr2);
        } else {
            throw new Error(`Invalid user username(s): ${userUN1}, ${userUN2}`);
        }
    }

    displayGraph() {
        console.log("\n=== Social Graph ===\n");
        for (const [username, user] of this.users) {
            console.log(`User: ${user.name} (Username: ${user.username})`);
            console.log(`  Age: ${user.age} | Gender: ${user.gender} | Location: ${user.location || "N/A"}`);
            console.log(`  Nicknames: ${user.nicknames.join(", ") || "None"}`);
            console.log("  Relationships:");
            console.log(`    Follows: ${user.getFollowing().join(", ") || "No one"}`);
            console.log(`    Friends: ${user.getFriends().join(", ") || "No one"}`);
            console.log(`    Co-Workers: ${user.getcoWorkers().join(", ") || "No one"}`);
            
            console.log("\n  Authored Posts:");
            user.authposts.forEach(post => {
                console.log(`    - "${post.content}" (Created: ${post.timdat})`);
                console.log(`      Views: ${post.views.join(", ") || "No views yet"}`);
                console.log(`      Comments:`);
                post.comments.forEach(comment => {
                    console.log(`        * ${comment.content} (By: ${comment.poster} at ${comment.timdat})`);
                });
            });

            console.log("\n  Posts Viewed:");
            user.readposts.forEach(post => {
                console.log(`    - "${post.content}" (By: ${post.posterUN})`);
            });

            console.log("\n  Comments Made:");
            user.owncomments.forEach(comment => {
                console.log(`    - "${comment.content}" (On: "${comment.post.content}" by ${comment.post.posterUN})`);
            });

            console.log("\n-----------------------------------\n");
        }
    }
}
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomDate = () => {
    const start = new Date(2022, 0, 1); // Start from Jan 1, 2022
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

// Sample datasets for user attributes
const samplePosts = [
    "Had a great sandwich today",
    "Isn't golf just a walk in the park?",
    "Read a fantastic book yesterday!",
    "Loving this new coding challenge!",
    "Exploring the wonders of the universe.",
    "Can’t wait for the weekend!",
    "Life is too short to skip dessert.",
    "Walking in the rain feels magical.",
    "Who else loves a good cup of coffee?",
    "Traveling is food for the soul."
];

const sampleLocations = ["Hawaii", "California", "New York", "Texas", "Florida"];
const sampleGenders = ["Male", "Female", "Non-binary", "Other"];
const minAge = 18;
const maxAge = 65;

// Enhanced Data Generator
const generateSocialMediaData = () => {
    const graph = new SocialGraph();

    // Add Users with attributes
    const usernames = ["Alice", "Bob", "Charlie", "Dana", "Eve", "Frank"];
    const users = usernames.map(username => {
        const user = graph.addUser(username.toLowerCase(), username);
        user.setage(getRandomInt(minAge, maxAge));
        user.setgender(sampleGenders[getRandomInt(0, sampleGenders.length - 1)]);
        user.setlocation(sampleLocations[getRandomInt(0, sampleLocations.length - 1)]);
        return user;
    });

    // Add Posts with timestamps
    users.forEach(user => {
        const postCount = getRandomInt(2, 5); // Each user creates 2-5 posts
        for (let i = 0; i < postCount; i++) {
            const content = samplePosts[getRandomInt(0, samplePosts.length - 1)];
            const timestamp = getRandomDate();
            user.makepost(content, timestamp);
        }
    });

    // Randomly generate connections (follows, friends, co-workers)
    for (let i = 0; i < 15; i++) {
        const user1 = users[getRandomInt(0, users.length - 1)];
        const user2 = users[getRandomInt(0, users.length - 1)];
        if (user1 !== user2) {
            const relation = getRandomInt(0, 2);
            switch (relation) {
                case 0: // Follow
                    graph.connectUsersFol(user1.username, user2.username);
                    break;
                case 1: // Friend
                    graph.connectUsersFrnd(user1.username, user2.username);
                    break;
                case 2: // Co-worker
                    graph.connectUserscoWrkr(user1.username, user2.username);
                    break;
            }
        }
    }

    // Add Views and Comments
    users.forEach(viewer => {
        const viewCount = getRandomInt(3, 10); // Each user views 3-10 posts
        for (let i = 0; i < viewCount; i++) {
            const randomUser = users[getRandomInt(0, users.length - 1)];
            if (randomUser.authposts.length > 0) {
                const post = randomUser.authposts[getRandomInt(0, randomUser.authposts.length - 1)];
                viewer.viewPost(post);
                if (Math.random() > 0.5) {
                    const commentContent = samplePosts[getRandomInt(0, samplePosts.length - 1)];
                    const timestamp = getRandomDate();
                    viewer.makeComment(commentContent, post, timestamp);
                }
            }
        }
    });

    return graph;
};

// Generate and Display Data
const graph = generateSocialMediaData();
graph.displayGraph();


// Output:
// Alice follows: Bob, Charlie
// Bob follows: Charlie
// Charlie follows: No one
