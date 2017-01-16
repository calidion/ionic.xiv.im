import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// import * as io from 'socket.io-client';

import { Request } from './request';

@Injectable()

export class ChatService extends Request {
  key = 'user'
  message = 'message'
  socket
  constructor(protected http: Http) {
    super(http);
  }

  getUsers() {
    return JSON.parse(localStorage.getItem(this.key));
  }
  recent() {
    return this.getUsers();
  }

  addUser(user, message) {
    var users = this.getUsers() || [];
    users = users.filter(function (item) {
      return item.friend.email !== user.friend.email
    });
    user.time = new Date();
    user.message = message;
    users.unshift(user);
    localStorage.setItem(this.key, JSON.stringify(users));
  }

  getMessages(user) {
    var key = this.message + '_' + user.friend.email;
    var messages = localStorage.getItem(key) || '[]';
    return JSON.parse(messages);
  }
  sendMessage(to, text) {
    return this._post('/message/new', {
      to: to,
      text: text,
      time: new Date()
    })
  }

  addMessage(user, message) {
    var messages = this.getMessages(user) || [];
    messages = messages.filter(function(item) {
      return item.id !== message.id;
    });
    messages.push(message);
    localStorage.setItem(this.message + '_' + user.friend.email, JSON.stringify(messages));
    return messages;
  }

  removeMessage(user, message) {

  }
}