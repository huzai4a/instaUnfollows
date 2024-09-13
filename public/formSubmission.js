async function sendZip (){
    const myZip = document.querySelector('.js-zip').files;

    // check whether user input is of the right type from .find of list of zip types 
    const formData = new FormData();
    // NOTE: .item just used in node to get the name of the file from the myZip var
    formData.append(myZip.item(0).name , myZip.item(0));

    // made it for instagram specifically so it can be changed for other sites as well in the future based on the page the user submits from
    const response = await fetch('/api/uploadZip/instagram', {
        method: 'POST',
        body: formData
    });

    const json = await response.json();

    console.log(json);
}

/* added timeout since this static file is loaded before the html 
(no timeout= no event to set the event listener to) */
document.querySelector('.uploadForm').addEventListener('submit', (event)=>{
    // html5 form auto reloads on submit, so this prevents that default action
    event.preventDefault();
    sendZip();
});
