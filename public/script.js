Vue.component('login', {
  data: function () {
    return {
      login: '',
      password: '',
      error: '',
    };
  },
  methods: {
    onLogin: async function (e) {
      e.preventDefault();
      this.error = '';
      try {
        const res = await axios.post('/auth/login', {
          login: this.login,
          password: this.password,
          error: '',
        });
        this.$emit('on-login', res.data);
      } catch (e) {
        if (e.response && e.response.data && e.response.data.message) {
          let message = e.response.data.message;
          if (Array.isArray(message)) {
            message = message[0];
          }
          this.error = message;
          return;
        }
        this.error = e.message;
      }
    },
  },
  template: `<div>
  <h2>Login</h2>
  <form v-on:submit.prevent="onLogin">
  <div class="alert alert-danger" v-if="error.length > 0" role="alert">
        {{ error }}
    </div>
  <div class="form-group">
    <label for="exampleInputEmail1">Login</label>
    <input v-model="login" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter username">
  </div>
  <div class="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input v-model="password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
  </div>
  <button type="submit" class="btn btn-primary">Login</button>
</form>
</div>`,
});

Vue.component('register', {
  data: function () {
    return {
      login: '',
      password: '',
      error: '',
      success: false,
    };
  },
  methods: {
    onRegister: async function (e) {
      e.preventDefault();
      this.error = '';
      this.success = false;
      try {
        const res = await axios.post('/auth/register', {
          login: this.login,
          password: this.password,
        });
        this.$emit('myEvent');
        this.$emit('onRegister', res.data);
        this.success = true;
      } catch (e) {
        if (e.response && e.response.data && e.response.data.message) {
          let message = e.response.data.message;
          if (Array.isArray(message)) {
            message = message[0];
          }
          this.error = message;
          return;
        }
        this.error = e.message;
      }
    },
  },
  template: `<div>
    <h2>Register</h2>
    <form v-on:submit.prevent="onRegister">
    <div class="alert alert-danger" v-if="error.length > 0" role="alert">
        {{error}}
    </div>
    <div class="alert alert-success" v-if="success" role="alert">
   Successfully registered. Please login
  </div>
    <div class="form-group">
      <label for="exampleInputEmail1">Login</label>
      <input v-model="login" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter username">
    </div>
    <div class="form-group">
      <label for="exampleInputPassword1">Password</label>
      <input v-model="password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
    </div>
    <button type="submit" class="btn btn-primary">Register</button>
  </form>
  </div>`,
});

Vue.component('chats', {
  props: ['chatList'],
  data: function () {
    return {
      username: '',
    };
  },
  methods: {
    beginChat: function (e) {
      e.preventDefault();
      this.$emit('create-chat', { username: this.username });
    },
    getChats: function () {
      this.$emit('get-chats');
    },
    onSelectChat: function (chat) {
      this.$emit('select-chat', chat);
    },
  },
  template: `<div class="d-flex flex-column">
    <div><h2 @click="getChats">Chats</h2> </div>
    <div class="chats-container d-flex flex-column">
      <div class="chats-list d-flex flex-column">
          <chat_item v-for="chat in chatList" :chat="chat" @select-chat="onSelectChat"></chat_item>
      </div>
       <div class="chat-create">
          <form v-on:submit.prevent="beginChat">
            <div class="form-group">
              <label for="createChatUsername">Username</label>
              <input v-model="username" type="text" class="form-control" id="createChatUsername" placeholder="Username for chat">
            </div>
            <button type="submit" class="btn btn-success">Begin chat</button>
          </form>
      </div>
    </div>
  </div>`,
});

Vue.component('chat_item', {
  props: ['chat'],
  methods: {
    selectChat: function () {
      console.log('selected event', this.chat);
      this.$emit('select-chat', this.chat);
      this.$emit('test', this.chat);
    },
  },
  template: `<div >
                <a href='#' @click="selectChat" class="chat">{{chat.friend?.username}} </a>
            </div>`,
});

Vue.component('chat-message', {
  props: ['message'],
  template: `<div class="message-content">
                <div class="message">{{ message.text }}</div>
                <div class="message-file" v-if="message.file">
                    <a :href="message.file.url" > {{message.file.name}} </a>
                </div>
                <div v-if="message.user" class="message-user">
                  {{ message.user.username }}
                </div>
                <hr/>
  </div>`,
});

Vue.component('chat_container', {
  props: ['chat', 'messages'],
  data: function () {
    return {
      message: '',
      file: null,
    };
  },
  methods: {
    sendMessage: function () {
      console.log('test', this.message, this.file);

      this.$emit('send-message', {
        id: this.chat.id,
        user_id: this.chat?.friend?.id,
        message: this.message,
        file: this.file,
      });

      this.file = null;
      this.message = '';
      document.getElementById('fileId').value = '';
    },
    getExtention(name) {
      return name.split('.').pop();
    },
    onFileUpload: function (e) {
      console.log(e);
      console.log(e.target);
      if (e.target.files && e.target.files[0]) {
        const FR = new FileReader();

        FR.addEventListener('load', (ev) => {
          this.file = {};
          this.file.content = ev.target.result
            .toString()
            .replace(/^data:(.*,)?/, '');
          this.file.type = e.target.files[0].type;
          this.file.name = e.target.files[0].name;
          this.file.extension = this.getExtention(this.file.name);
        });

        FR.readAsDataURL(e.target.files[0]);
      }
    },
  },
  watch: {
    chat: function (news, old) {
      console.log('message chane', news, old);
      this.messages = news.messages;
    },
    messages: function (news, old) {
      console.log('messages changed', news, old);
      this.messages = news;
    },
    deep: true,
  },
  template: `<div class="d-flex flex-column">
      <div class="chat-header">
        <h2>Chat with {{chat.friend?.username}} </h2>
      </div>
      <div class="chat-messages">
          <chat-message v-for="message in messages" :message="message"></chat-message>
      </div> 
      <div class="chat-form">
        <form v-on:submit.prevent="sendMessage"  enctype='multipart/form-data' >
          <div class="form-group">
            <label for="createChatUsername">Message</label>
            <input v-model="message" type="text" class="form-control" id="createChatUsername" placeholder="message">
          </div>
          <div class="form-group">
            <label for="fileId">File</label>
            <input @change="onFileUpload" type="file" class="form-control" id="fileId">
          </div>
          <button type="submit" class="btn btn-primary">Send message</button>
        </form>
      </div> 
  </div>`,
});

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    isIn: false,
    token: null,
    user_id: null,
    chats: [],
    socket: null,
    selectedChat: null,
    currentMessages: [],
  },
  methods: {
    onLogin: function (data) {
      this.isIn = true;
      this.token = data.token;
      this.user_id = data.id;
      this.createSocket();
    },
    onCreateChat: function ({ username }) {
      console.log('create chat', username);
      this.socket.emit('createChat', { username });
    },
    onGetChats: function () {
      this.socket.emit('chats');
    },
    onSelectChat: function (chat) {
      this.selectedChat = chat;
      this.currentMessages = chat.messages || [];
      console.log('selectted chat', chat);
    },
    onTest: function (data) {
      console.log('test event', data);
    },
    onSendMessage: function (message) {
      this.socket.emit('create-message', message);
    },
    onNewMessage(msg) {
      const chat = this.chats.find((chat) => +chat.id === msg.chat_id);
      if (chat === -1) {
        return;
      }

      if (!chat.messages) {
        chat.messages = [];
      }

      chat.messages.push(msg);
      if (this.selectedChat && +this.selectedChat.id === +chat.id) {
        this.currentMessages.push(msg);
      }
    },
    createSocket: function () {
      this.socket = io({
        extraHeaders: {
          authorization: 'Bearer ' + this.token,
        },
      });

      this.socket.emit('chats');

      this.socket.on('chat-create', (chat) => {
        this.chats.push(chat);
        this.onSelectChat(chat);
        console.log('chat created', chat);
      });

      this.socket.on('new-chat', (chat) => {
        this.chats.push(chat);
        alert('You have new chat');
      });

      this.socket.on('chats', (chats) => {
        console.log('chats', chats);
        this.chats = chats;
      });

      this.socket.on('new-message', (msg) => {
        // this.chats = chats;
        alert('new message');
        this.onNewMessage(msg);
      });

      this.socket.on('message-created', (msg) => {
        console.log('new message', msg);
        this.onNewMessage(msg);
      });

      this.socket.on('exception', function (e) {
        alert(e.message);
        console.error('exception', e);
      });
    },
  },
});
