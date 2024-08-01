import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'; // default export

const followers_promise = await fetch('./data/instagram-huzai4a/connections/followers_and_following/followers_1.json');
const following_promise = await fetch('./data/instagram-huzai4a/connections/followers_and_following/following.json');

// these take the above promises and set the variables to lists from them
const followersObjects = await followers_promise.json();
const followingObjects = await following_promise.json();

// testing
// console.log(followersObjects[0].string_list_data[0]);
// console.log(followingObjects.relationships_following[0].string_list_data[0]);

// I can't keep this as an object with both these values since I need to use .includes (only for arrays)
let followersList = [];
let followersTimestamp = [];

followersObjects.forEach((listItem)=>{
    followersList.push(listItem.string_list_data[0].value);
    followersTimestamp.push(dayjs.unix(listItem.string_list_data[0].timestamp).format('MMMM D, YYYY'));
});

// console.log(followersTimestamp);
// console.log(followersList);

// I can't keep this as an object with both these values since I need to use .includes (only for arrays)
let followingList = [];
let followingTimestamp = [];

followingObjects.relationships_following.forEach((listItem)=>{
    followingList.push(listItem.string_list_data[0].value);
    followingTimestamp.push(dayjs.unix(listItem.string_list_data[0].timestamp).format('MMMM D, YYYY'));
});

// console.log(followingList);
// console.log(followingTimestamp);
