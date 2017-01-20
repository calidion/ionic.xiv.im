import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as moment from 'moment'

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
    });
  }

  addMessage(user, message) {
    var messages = this.getMessages(user) || [];
    messages = messages.filter(function (item) {
      return item.id !== message.id;
    });
    messages.push(message);
    localStorage.setItem(this.message + '_' + user.friend.email, JSON.stringify(messages));
    return messages;
  }

  getUserCount(user) {
    var messages = this.getMessages(user);
    var count = 0;
    for (var i = 0; i < messages.length; i++) {
      if (!messages[i].read) {
        count++;
      }
    }
    return count;
  }

  readMessage(user, ids) {
    var read = this._post('/message/read', {
      id: ids.join(',')
    });
    read.subscribe(json => {
      if (!json.code) {
        var messages = this.getMessages(user) || [];
        messages = messages.map(function (item) {
          if (ids.indexOf(item.id) !== -1) {
            item.read = true;
          }
          return item;
        });
        localStorage.setItem(this.message + '_' + user.friend.email, JSON.stringify(messages));
        return messages;
      }
    });
  }

  removeMessage(user, message) {
    var read = this._post('/message/remove', {
      id: message.id
    });
    read.subscribe(json => {
      if (!json.code) {
        var messages = this.getMessages(user) || [];
        messages = messages.filter(function (item) {
          return item.id !== message.id;
        });
        localStorage.setItem(this.message + '_' + user.friend.email, JSON.stringify(messages));
      }
    });
  }

  getMessageList(friend, page) {
    page = page > 1 ? page : 1;
    var url = '/message/list?id=' + friend.id + '&page=' + page;
    return this._get(url);
  }
}