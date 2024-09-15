async function sendZip (){
    const myZip = document.querySelector('.js-zip').files;

    // check whether user input is of the right type from .find of list of zip types 
    const formData = new FormData();

    // this try catch stops the name from causing an error before tthe middleware gets to respond
    try {
        // NOTE: .item just used in node to get the name of the file from the myZip var
        formData.append(myZip[Object.keys(myZip)].name , myZip[Object.keys(myZip)]);
    } catch{
        // next i need to check the file size limit functiin
    }

    // made it for instagram specifically so it can be changed for other sites as well in the future based on the page the user submits from
    
    const response = await fetch('/api/uploadZip/instagram', {
        method: 'POST',
        body: formData
    });

    const json = await response.json();

    
    console.log(`message: ${json.message}`)
    if (json.message){
        if (json.message === 'logged'){
            document.querySelector('.status-container').classList.remove('failed');
        } else{
            document.querySelector('.js-form-status').innerHTML = `${json.message}`;
            document.querySelector('.status-container').classList.add('failed');
        }
        
    }
    // console.log(json.message);
}

/* added timeout since this static file is loaded before the html 
(no timeout= no event to set the event listener to) */
document.querySelector('.uploadForm').addEventListener('submit', (event)=>{
    // html5 form auto reloads on submit, so this prevents that default action
    event.preventDefault();
    sendZip();
});
