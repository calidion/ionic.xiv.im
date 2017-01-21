import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Request } from './request';
import * as markdown from 'showdown';
import * as prism from 'prismjs';
import * as moment from 'moment'
let converter = new markdown.Converter();

moment.locale('zh-CN');

@Injectable()

export class ChatService extends Request {
  key = 'friends'
  message = 'message'
  socket
  userMessage
  constructor(protected http: Http) {
    super(http);
  }

  getUsers(user) {
    console.log(user);
    return JSON.parse(localStorage.getItem(this.key + '_' + user.id));
  }
  recent(user) {
    return this.getUsers(user);
  }

  addUser(user, message) {
    var users = this.getUsers(user.user) || [];
    users = users.filter(function (item) {
      return item.friend.email !== user.friend.email
    });
    user.message = message;
    users.unshift(user);
    localStorage.setItem(this.key + '_' + user.user.id, JSON.stringify(users));
  }

  getKey(user) {
    return this.message + '_' + user.user.id;
  }

  getMessages(user) {
    if (this.userMessage && this.userMessage[user.user.id]) {
      return this.userMessage[user.user.id][user.friend.email];
    }
    var storage = localStorage.getItem(this.getKey(user)) || '{}';
    var data = JSON.parse(storage);
    var json = data[user.user.id] || {};
    return json[user.friend.email] || [];
  }

  setMessages(user, messages) {
    var storage = localStorage.getItem(this.getKey(user)) || '{}';
    var data = JSON.parse(storage);
    var json = data[user.user.id] || {};
    json[user.friend.email] = messages;
    data[user.user.id] = json;
    this.userMessage = data;
    console.log(data);
    localStorage.setItem(this.getKey(user), JSON.stringify(data));
  }

  sendMessage(to, text) {
    return this._post('/message/new', {
      to: to,
      text: text,
      time: new Date()
    });
  }

  addMessage(user, message) {
    var storage = localStorage.getItem(this.getKey(user)) || '{}';
    var data = JSON.parse(storage);
    var json = data[user.user.id] || {};
    console.log(json);

    var messages = json[user.friend.email] || [];
    console.log(messages);
    messages = messages.filter(function (item) {
      return item.id !== message.id;
    });

    // Minial time gap for a section to occur.

    const MIN_MINUTES = 10 * 60 * 6000;

    var lastTime = null;
    console.log(message.text);
    message.timeText = moment(message.createdAt).format('LL[ ]LT');
    message.timeStatus = moment(message.createdAt).format('MM-DD HH:mm');
    message.text = converter.makeHtml(message.text);

    messages = messages.map(function (item) {
      if (!lastTime || (item.createdAt - lastTime) > MIN_MINUTES) {
        item.timed = true;
      }
      lastTime = item.createdAt;
      return item;
    });
    messages.push(message);
    messages = messages.sort(function (a, b) {
      return a.createdAt - b.createdAt;
    });
    json[user.friend.email] = messages;
    data[user.user.id] = json;
    this.userMessage = data;
    localStorage.setItem(this.getKey(user), JSON.stringify(data));
    return messages;
  }

  getUserCount(user) {
    let messages = this.getMessages(user) || [];
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
        this.setMessages(user, messages);
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

  getMessageList(user, page) {
    page = page > 1 ? page : 1;
    var url = '/message/list?id=' + user.friend.id + '&page=' + page;
    return this._get(url);
  }
}