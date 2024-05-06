

const getUsername = async () => {
    const username = localStorage.getItem('username')
    if (username) {
      console.log(`User existed ${username}`)
      return username
    }

   
        const { value: inputUsername } = await Swal.fire({
          title: "Se requiere un nombre de usuario",
          input: "email",
          inputLabel: "Indique su correo",
          inputPlaceholder: "tu correo aquí"
        });
        if (!inputUsername) {
          return "Debes indicar un correo!";
        }



    localStorage.setItem('username', inputUsername)
    return inputUsername
  }


  (async () => {
    const socket = io({
        auth: {
            username: await getUsername(),
            serverOffset: 0
        }
    });


const form = document.getElementById('form')
const input = document.getElementById('input')
const messages = document.getElementById('messages')

document.getElementById("chat-btn-logout").addEventListener("click", () => {
  localStorage.removeItem("username");
  window.location.reload();
});

const getTime = (msgTimeStr) => {
    const msgTime = new Date(msgTimeStr); 
    const hours = msgTime.getHours().toString().padStart(2, '0');
    const minutes = msgTime.getMinutes().toString().padStart(2, '0');
    const seconds = msgTime.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};

function escapeHtml(html) {
    return html.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;")
               .replace(/'/g, "&#39;");
}


socket.on('server_message', (msg) => {
    // console.log(msg)
    const item = `<li>
    
    <div class="message_head">
    <small>${msg.username}</small>
    <small>${getTime(msg.dateTime)}</small>
    
    </div>
      <p>${escapeHtml(msg.message)}</p>
    </li>`
    messages.insertAdjacentHTML('beforeend', item)
    socket.auth.serverOffset = msg.lastRow
    messages.scrollTop = messages.scrollHeight
  })


  form.addEventListener('submit', (e) => {
    e.preventDefault()

    if (input.value.trim().length > 0) {
      socket.emit('client_message', input.value.trim())
      input.value = ''
      input.focus();
    }
  })
  })()
