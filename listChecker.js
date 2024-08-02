import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'; // default export

// fetches the promises from the json files
const followers_promise = await fetch('./data/instagram-huzai4a/connections/followers_and_following/followers_1.json');
const following_promise = await fetch('./data/instagram-huzai4a/connections/followers_and_following/following.json');

// these take the above promises and set the variables to lists from them
const followersObjects = await followers_promise.json();
const followingObjects = await following_promise.json();

// I can't keep this as an object with both these values since I need to use .includes (only for arrays)
let followersList = [];

// followers list is consistent (the one being compared to)
followersObjects.forEach((listItem)=>{
    followersList.push(listItem.string_list_data[0].value);
});

let followingObj = {};
// note: had a problem where after deleting a handle the count wasn't changing, this kind of feels lazy using a global var to modify count directly 
let count = 0;

// if local storage has values then use that, otherwise initialize from json files
if(localStorage.getItem('followingObj')){
    // followingObj holds a list and extraInfo object all in a general object
    followingObj = JSON.parse(localStorage.getItem('followingObj'));
} else{
    followingObj = initializeFollowing();
}

renderResults();

function initializeFollowing (){
    let tempFollowingList = [];
    let tempExtraInfo = [];

    followingObjects.relationships_following.forEach((listItem)=>{
        tempFollowingList.push(listItem.string_list_data[0].value);
        
        tempExtraInfo.push({
            timestamp: dayjs.unix(listItem.string_list_data[0].timestamp).format('MMMM D, YYYY'),
            link: listItem.string_list_data[0].href
        });
    });

    // sends an object of the info so that it doesnt
    return {
        followingList: tempFollowingList, 
        extraInfo: tempExtraInfo
    };
}

function renderResults(){
    let html = '';
    
    followingObj.followingList.forEach((following, index)=>{
        // if someones im following is NOT in followersList
        if (!(followersList.includes(following))){
            html+=`
            <div class="ig-line">
                <p class="text">
                    ig handle: <a href="${followingObj.extraInfo[index].link}" target="_blank">@${following}</a>, followed on ${followingObj.extraInfo[index].timestamp}
                </p>
                <span class="remove-option js-remove" data-ig-handle="${following}">Remove</span>
            </div>
            `;
            count++;
        }
    });
    
    // if null
    if (!html){
        html = `Everybody that you follow has followed you back :)`;
    }
    
    document.querySelector('.js-counter').innerHTML = `Results: (${count} found)`;
    document.querySelector('.names').innerHTML = html;
}

// saves followingObj
function saveToStorage(){
    localStorage.setItem('followingObj', JSON.stringify(followingObj));
}

// note: make sure to always have event listeners AFTER the html is sent in
document.querySelectorAll('.js-remove').forEach((link)=>{
    
    link.addEventListener('click', () => {
        // put inside a timeout for 0.1s so multiple buttons aren't clicked on the same click
        setTimeout(()=>{
            // note: whenever using link.dataset the name should be camelCase of the data-______
            const { igHandle } = link.dataset;
            const index = followingObj.followingList.indexOf(igHandle);
            
            // removes corresponding ig from the list of nonMutuals
            followingObj.followingList.splice(index, 1);
            followingObj.extraInfo.splice(index, 1);
    
            saveToStorage();
    
            count--;
            document.querySelector('.js-counter').innerHTML = `Results: (${count} found)`;
            // removes the handle from the page by using the remove buttons parent div which also holds the handle text
            link.closest('.ig-line').innerHTML = '';
        }, 100);
    });
});