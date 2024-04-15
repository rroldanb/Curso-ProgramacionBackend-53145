const socket = io()

const input = document.getElementById('message')
const messagesList = document.getElementById('messagesList')

input.addEventListener('keyup', evt => {
    if (evt.key ==='Enter'){
        socket.emit('client_message', input.value)
        input.value='';
        input.focus();
    }
})
socket.on('server_message', data=>{
    appendMessage(data)
})

socket.on('load_server_messages', data=>{
    renderMessages(data)
})

const messageRend = (data) => {
    const div = document.createElement("div");
    const getTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };
    div.innerHTML = `
    <div class=" card card-body 
    autoscrollrounded-0 animate__animated animate__fadeInLeft
    mb-2">
        <div class=" mensage">
        <p class="fw-bold mt-2 mb-0 pb-0"> ${getTime()}  </p>
        <p class="fw-bold mt-0 mb-0 pb-0"> From ${data.id}</p>
        </div>
        <p class="mb-0">${data.messge}</p>
    </div>
  `;

  return div;
}

const renderMessages = (messages) => {
    messagesList.innerHTML = "";
    messages.forEach((message) => {
        let newMessageDiv=messageRend(message)
        messagesList.append(newMessageDiv);
        newMessageDiv.scrollIntoView
});
  };
  



  const appendMessage = (message) => {
    const newMessageDiv = messageRend(message);
    messagesList.appendChild(newMessageDiv);
    newMessageDiv.scrollIntoView();
  };

// socket.emit('message', 'esta es mi data')

// socket.on('socket_individual', data =>{
//     console.log(data)
// })
// socket.on('para_todos_menos_uno', data =>{
//     console.log(data)
// })
// socket.on('evento_para_todos', data =>{
//     console.log(data)
// })
