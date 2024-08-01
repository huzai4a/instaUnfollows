import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'; // default export

const followers_promise = await fetch('./data/instagram-huzai4a/connections/followers_and_following/followers_1.json');
const following_promise = await fetch('./data/instagram-huzai4a/connections/followers_and_following/following.json');

// these take the above promises and set the variables to lists from them
const followersObjects = await followers_promise.json();
const followingObjects = await following_promise.json();

// testing
// console.log(followersObjects[0].string_list_data[0]);
// console.log(followingObjects.relationships_following[0].string_list_data[0]);

