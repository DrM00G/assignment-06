// ===== CLASSES =====
class Post {
    constructor(content, user, timdat) {
        this.content = content;
        this.poster = user;
        this.comments = [];
        this.views = [];
    }


}

class Comment {
    constructor(content, poster, post, timeanddate) {
        this.content = content;
        this.poster = poster;
        this.post = post;
        this.timdat = timeanddate;
    }
}

class User {
    constructor(username, name) {
        this.name = name;
        this.username = username;

        this.age = -1;
        this.gender = "n/a";
        this.nicknames = [];
        this.workplace = null;
        this.location = null;

        this.follows = [];
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
    addnickname(name) {
        if (!this.nicknames.includes(name)) {
            this.nicknames.push(name);
        }
    }


    follow(user) {
        if (!this.follows.includes(user)) {
            this.follows.push(user);
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
    block(user) {
        if (!this.blocked.includes(user)) {
            this.blocked.push(user);
        }
    }

    makepost(content, timdat) {
        const post = new Post(content, this, timdat);
        this.authposts.push(post);
    }

    viewPost(post) {
        if (!post.views.includes(this.username)) {
            post.views.push(this.username);
            this.readposts.push(post);
        }
    }

    makeComment(content, post, timdat) {
        const comment = new Comment(content, this.username, post, timdat);
        this.owncomments.push(comment);
        post.comments.push(comment);
    }
}

class SocialGraph {
    constructor() {
        this.users = new Map();
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

    connectUsersBlok(blockerUN, blockeeUN) {
        const blocker = this.getUser(blockerUN);
        const blockee = this.getUser(blockeeUN);
        if (blocker && blockee) {
            blocker.block(blockee);
        } else {
            throw new Error(`Invalid username(s): ${blockerUN}, ${blockeeUN}`);
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
}

// ===== DATA GENERATION =====
// ===== DATA GENERATION =====
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomDate = () => {
    const start = new Date(2022, 0, 1); // Start from Jan 1, 2022
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

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
    "Traveling is food for the soul.",
];

const sampleLocations = ["Hawaii", "California", "New York", "Texas", "Florida"];
const sampleGenders = ["Male", "Female", "Non-binary", "Other"];

const generateSocialMediaData = () => {
    const graph = new SocialGraph();
    const usernames = ["Alice", "Bob", "Frank", "Dave", "Bill", "Jas", "Kalea"];

    // Add users with attributes
    const users = usernames.map(username => {
        const user = graph.addUser(username.toLowerCase(), username);
        user.setage(getRandomInt(18, 65));
        user.setgender(sampleGenders[getRandomInt(0, sampleGenders.length - 1)]);
        user.setlocation(sampleLocations[getRandomInt(0, sampleLocations.length - 1)]);
        return user;
    });

    // Create random posts for each user
    users.forEach(user => {
        const postCount = getRandomInt(2, 5); // Each user creates 2-5 posts
        for (let i = 0; i < postCount; i++) {
            const content = samplePosts[getRandomInt(0, samplePosts.length - 1)];
            const timestamp = getRandomDate();
            user.makepost(content, timestamp);
        }
    });

    // Randomly generate "blocked" connections
    users.forEach(user => {
        const blockCount = getRandomInt(0, 3); // Each user follows 0-3 others

        for (let i = 0; i < blockCount; i++) {
            const randomUser = users[getRandomInt(0, users.length - 1)];
            if (randomUser !== user && !user.blocked.includes(randomUser) && Math.random() > 0.5) {//Blocking should be rare
                graph.connectUsersBlok(user.username, randomUser.username);
            }
        }
    });
    // Randomly generate "following" connections
    users.forEach(user => {
        const followCount = getRandomInt(1, 7); // Each user follows 1-5 others
        for (let i = 0; i < followCount; i++) {
            const randomUser = users[getRandomInt(0, users.length - 1)];
            if (randomUser !== user && !user.follows.includes(randomUser) && !randomUser.blocked.includes(user)) {
                graph.connectUsersFol(user.username, randomUser.username);
            }
        }
    });

    // Randomly generate "friend" connections
    users.forEach(user => {
        const friendCount = getRandomInt(1, 2); // Each user is friends with at least 1-2 others 
        for (let i = 0; i < friendCount; i++) {
            const randomUser = users[getRandomInt(0, users.length - 1)];
            if (randomUser !== user && !user.friends.includes(randomUser)) {
                graph.connectUsersFrnd(user.username, randomUser.username);
            }
        }
    });
    return graph;
};

const assignRandomViews = (graph) => {
    graph.users.forEach((user, username) => {
        user.authposts.forEach(post => {
            graph.users.forEach((viewer, viewerUsername) => {
                // Ensure the poster does not view their own post
                if (viewerUsername !== username && Math.random() > 0.5 && !user.blocked.includes(viewer)) {
                    viewer.viewPost(post);
                    console.log("Bingo");
                }
            });
        });
    });
};

const calculateUserMetrics = (graph) => {
    graph.users.forEach((user, username) => {
        const numFollowers = graph.users.size - user.follows.length; // Estimate followers
        const numFriends = user.friends.length;
        const numBlocked = user.blocked.length;

        // Calculate post popularity among specific demographics
        let genderPopularity = { male: 0, female: 0, nonBinary: 0, other: 0 };
        let locationPopularity = {};
        let totalViews = 0;
        
        user.authposts.forEach(post => {
            post.views.forEach(viewerUsername => {
                const viewer = graph.getUser(viewerUsername);
                if (viewer) {
                    // Track gender
                    genderPopularity[viewer.gender.toLowerCase()] =
                        (genderPopularity[viewer.gender.toLowerCase()] || 0) + 1;

                    // Track location
                    if (!locationPopularity[viewer.location]) {
                        locationPopularity[viewer.location] = 0;
                    }
                    locationPopularity[viewer.location]++;

                    totalViews++;
                }
            });
        });

        // Store metrics in user node data
        console.log("numFollowers:",numFollowers)
        const node = cy.getElementById(username);
        node.data({
            followers: numFollowers,
            friends: numFriends,
            blocked: numBlocked,
            genderPopularity,
            locationPopularity,
            totalViews: totalViews,
        });
        console.log("node.genderPopularity['male']:",(node.data('genderPopularity')['male']))
    });
};

// ===== DATA TRANSFORMATION FOR CYTOSCAPE =====
const generateCytoscapeData = (graph) => {
    const elements = [];
    graph.users.forEach((user, username) => {
        // Add user node
        elements.push({
            data: {
                id: username,
                label: `${user.name} (User)`,
                type: 'user',
                followers: 0, // Default
                friends: 0, // Default
                blocked: 0, // Default
                sizeMult: 1,
                colorMult: 1,
                totalViews: 0,
                genderPopularity: {}, // Default
                locationPopularity: {}, // Default
            },
        });
        user.authposts.forEach((post, index) => {
            const postId = `${username}-post${index + 1}`; // Unique ID for the post

            elements.push({
                data: {
                    id: postId,
                    label: post.content, // Post content as the label
                    type: 'post',
                    viewCount: post.views.length, // Number of views
                    poster: username, // Poster ID for connections
                },
            });

            // Add edge between user and their post
            elements.push({
                data: {
                    source: username, // User node ID
                    target: postId, // Post node ID
                    label: 'Authored', // Edge label
                    type: 'authored',
                },
            });
        });
    });
    // Generate connections (following, friends, blocked)
    graph.users.forEach((user, username) => {
        user.follows.forEach(followedUser => {
            elements.push({
                data: {
                    source: username,
                    target: followedUser.username,
                    label: 'Follows',
                    type: 'Following',
                },
            });
        });

        user.friends.forEach(friend => {
            elements.push({
                data: {
                    source: username,
                    target: friend.username,
                    label: 'Friends',
                    type: 'Friend',
                },
            });
        });

        user.blocked.forEach(blockedUser => {
            elements.push({
                data: {
                    source: username,
                    target: blockedUser.username,
                    label: 'Blocked',
                    type: 'Blocked',
                },
            });
        });
    });

    return elements;
};

//#F5F5F5
// ===== VISUALIZATION =====
let globalGraph;
let cy; // Declare cy globally

document.addEventListener("DOMContentLoaded", () => {
    globalGraph = generateSocialMediaData(); // Generate the social graph data
    assignRandomViews(globalGraph); // Assign random views for better engagement metrics
    const elements = generateCytoscapeData(globalGraph); // Generate elements for Cytoscape
    console.log("Data generated!");

    // Initialize Cytoscape instance
    cy = cytoscape({
        container: document.getElementById('cy'),
        elements,
        style: [
            // General node styles
            { selector: 'node', style: { 'label': 'data(label)' } },

            // User node styles
            { 
                selector: 'node[type="user"]', 
                style: {
                    'background-color': 'yellow', // Fewer followers = yellow, more = red
                    'width': '20', // Friend-based width
                    'height': '20', // Friend-based height
                    'font-size': '10px',
                    'text-valign': 'center',
                    'text-halign': 'center',
                },
            },
            // Post node styles
            { 
                selector: 'node[type="post"]', 
                style: {
                    'background-color': '#2196F3', // Default blue for posts
                    'shape': 'rectangle', // Posts as rectangles
                    'width': 10, // Scale width based on views
                    'height': 10, // Fixed height for post nodes
                    'font-size': '4px',
                    'text-valign': 'center',
                    'text-halign': 'center',
                },
            },

            // Authored edge styles
            { 
                selector: 'edge[type="authored"]', 
                style: {
                    'line-color': '#FF9800', // Orange for authored edges
                    'curve-style': 'bezier', // Bezier style for visual flow
                    'target-arrow-color': '#FF9800',
                    'target-arrow-shape': 'triangle',
                    'width': 2,
                },
            },
            // Following edge styles
            { 
                selector: 'edge[type="Following"]', 
                style: { 
                    'line-color': '#B8E8B8',
                    'curve-style': 'bezier',
                    'target-arrow-color': '#B8E8B8',
                    'target-arrow-shape': 'triangle',
                },
            },

            // Friend edge styles
            { 
                selector: 'edge[type="Friend"]', 
                style: { 
                    'line-color': '#EBB0E6',
                    'width': 2,
                },
            },

            // Blocked edge styles
            { 
                selector: 'edge[type="Blocked"]', 
                style: { 
                    'line-color': '#EA4244',
                    'width': 2,
                    'line-style': 'dashed',
                },
            },
        ],
        layout: { name: 'cose' }, // Force-directed layout
    });
});

document.getElementById('applySettings').addEventListener('click', () => {
    console.log("Button Pressed");
    calculateUserMetrics(globalGraph); // Recalculate metrics for users
    if (cy) { // Ensure cy is defined
        cy.nodes().forEach(node => {
            if (node.data().type === 'user') {
                // Initialize sizeRatio and colorRatio
                let sizeMult = 1;
                let colorMult = 1;
                
                // Adjust sizeRatio based on checkboxes
                if (document.getElementById('followsSizeCheckbox').checked) {
                    console.log("node.data().followers:",node.data('followers'))
                    sizeMult *= (node.data('followers')/6) || 0;
                }
                if (document.getElementById('viewsSizeCheckbox').checked) {
                    sizeMult *= node.data('totalViews')/25 || 0;
                }
                if (document.getElementById('viewsperpostSizeCheckbox').checked) {
                    sizeMult *= (node.data('totalViews')/globalGraph.getUser(node.data("id")).authposts.length)/6 || 0;
                }
                if (document.getElementById('binarygenderRatioSizeCheckbox').checked) {
                    sizeMult *= (node.data('genderPopularity')['male']/node.data('genderPopularity')['female']) || 1;
                }       
                if (document.getElementById('binarytonbgenderRatioSizeCheckbox').checked) {
                    sizeMult *= (node.data('genderPopularity')['male']+node.data('genderPopularity')['female'])/(node.data('genderPopularity')['nonBinary']+node.data('genderPopularity')['other']) || 1;
                }        
                console.log("sizeMult:",sizeMult)

                // Adjust colorRatio based on checkboxes
                if (document.getElementById('followsColorCheckbox').checked) {
                    console.log("node.data().followers:",node.data('followers'))
                    colorMult *= (node.data('followers')/6) || 0;
                }
                if (document.getElementById('viewsColorCheckbox').checked) {
                    colorMult *= node.data('totalViews')/25 || 0;
                }
                if (document.getElementById('viewsperpostColorCheckbox').checked) {
                    colorMult *= (node.data('totalViews')/globalGraph.getUser(node.data("id")).authposts.length)/6 || 0;
                }
                if (document.getElementById('binarygenderRatioColorCheckbox').checked) {
                    colorMult *= (node.data('genderPopularity')['male']/node.data('genderPopularity')['female']) || 1;
                }       
                if (document.getElementById('binarytonbgenderRatioColorCheckbox').checked) {
                    colorMult *= (node.data('genderPopularity')['male']+node.data('genderPopularity')['female'])/(node.data('genderPopularity')['nonBinary']+node.data('genderPopularity')['other']) || 1;
                }        
                console.log("sizeMult:",sizeMult)
                node.data({
                    sizeMult: sizeMult,
                    colorMult: colorMult,
                });
            }
        });
                        
        cy.style()
            .selector('node[type="user"]')
            .style({
                'background-color': 'mapData(colorMult, 0, 1, yellow, red)', // Follower-based color
                'width': 'mapData(sizeMult, 0, 1, 20, 50)', // Friend-based size
                'height': 'mapData(sizeMult, 0, 1, 20, 50)', // Same as width
            })
            .update();
    } else {
        console.error("Cytoscape instance (cy) is not initialized.");
    }
});

