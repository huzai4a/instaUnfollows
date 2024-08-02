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

let followingList = JSON.parse(localStorage.getItem('followingList')) || initializeFollowing('followingList');
let extraInfo = JSON.parse(localStorage.getItem('extraInfo')) || initializeFollowing('extraInfo');

function iniatializeFollowing (returnType){
    let tempFollowingList = [];
    let tempExtraInfo = [];

    if (returnType === 'followingList'){
        return tempFollowingList;
    } else{
        return tempExtraInfo;
    }
}

let count = 0;
let html = '';


followersObjects.forEach((listItem)=>{
    followersList.push(listItem.string_list_data[0].value);
});

// console.log(followersTimestamp);
// console.log(followersList);

// I can't keep this as an object with both these values since I need to use .includes (only for arrays)

followingObjects.relationships_following.forEach((listItem)=>{
    followingList.push(listItem.string_list_data[0].value);
    
    extraInfo.push({
        timestamp: dayjs.unix(listItem.string_list_data[0].timestamp).format('MMMM D, YYYY'),
        link: listItem.string_list_data[0].href
    });
});

// console.log(followingList);
// console.log(followingTimestamp);



followingList.forEach((following, index)=>{
    // if someones im following is NOT in followersList
    if (!(followersList.includes(following))){
        html+=`
        <div class="ig-line">
            <p class="text">
                ig handle: <a href="${extraInfo[index].link}" target="_blank">@${following}</a>, followed them on ${extraInfo[index].timestamp}
            </p>
            <span class="remove-option js-remove" data-ig-handle="${following}">Remove</span>
        </div>
        `;
        count++;
    }
});

document.querySelector('.js-counter').innerHTML = `Results: (${count} found)`;
document.querySelector('.names').innerHTML = html;

// note: make sure to always have event listeners AFTER the html is sent in
document.querySelectorAll('.js-remove').forEach((link)=>{
    link.addEventListener('click', () => {
        // note: whenever using link.dataset the name should be camelCase of the data-______
        const { igHandle } = link.dataset;
        const index = followingList.indexOf(igHandle);
        
        // removes corresponding ig from the list of nonMutuals
        followingList.splice(index, 1);
        extraInfo.splice(index, 1);

        saveToStorage();
    });
});

function saveToStorage(){
    localStorage.setItem('followingList', JSON.stringify(followersList));
    localStorage.setItem('extraInfo', JSON.stringify(extraInfo));
}