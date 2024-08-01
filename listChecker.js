import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'; // default export

const followers_promise = await fetch('./data/instagram-huzai4a/connections/followers_and_following/followers_1.json');
const following_promise = await fetch('./data/instagram-huzai4a/connections/followers_and_following/following.json');

