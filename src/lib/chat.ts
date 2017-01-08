import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

// import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class ChatService {
  key = 'user'
  message = 'message'
  // private url: string = 'http://forum.webfullstack.me'
  constructor(private http: Http) {

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

  addMessage(user, text, type) {
    var messages = this.getMessages(user) || [];
    user.time = new Date();
    user.text = text;
    user.type = type || 'from';
    messages.push(user);
    localStorage.setItem(this.message + '_' + user.friend.email, JSON.stringify(messages));
    return messages;
  }

  removeMessage(user, message) {

  }
}