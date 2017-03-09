import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Request } from './request';
// import * as markdown from 'showdown';
import * as moment from 'moment'
// let converter = new markdown.Converter();

moment.locale('zh-CN');

@Injectable()

export class ChatService extends Request {
  key = 'friends'
  socket
  userMessage
  static MIN_MINUTES = 10 * 60 * 6000

  constructor(protected http: Http) {
    super(http);
  }

  getUsers(user) {
    var id = user.user ? user.user.id : user.id;
    return JSON.parse(localStorage.getItem(this.key + '_' + id));
  }
  recent(user) {
    return this.getUsers(user);
  }

  addRecentFriend(friend, message) {
    this.addUser(friend, message);
  }

  addUser(user, message) {
    console.log(message);
    if (!user) {
      return;
    }
    if (message && message.sender.email !== user.friend.email) {
      return;
    }
    var users = this.getUsers(user.user) || [];
    var extracted = user;
    users = users.filter(function (item) {
      if (item.friend.email === user.friend.email) {
        extracted = item;
      }
      return item.friend.email !== user.friend.email
    });
    if (extracted.message) {
      if (message.createdAt > extracted.message.createdAt) {
        extracted.message = message;
      }
    } else {
      extracted.message = message;
    }
    if (message && message.createdAt) {
      extracted.timeStatus = moment(message.createdAt).format('MM-DD HH:mm');
    }

    console.log('updated friend info');
    users.unshift(extracted);
    localStorage.setItem(this.key + '_' + user.user.id, JSON.stringify(users));
  }

  sendMessage(to, text) {
    return this._post('/message/new', {
      to: String(to),
      text: text,
      time: new Date()
    });
  }

  readMessage(user, ids, messages) {
    var read = this._post('/message/read', {
      id: ids.join(',')
    });
    read.subscribe(json => {
      if (!json.code) {
        messages = messages.map(function (item) {
          if (ids.indexOf(item.id) !== -1) {
            item.read = true;
          }
          return item;
        });
      }
    });
  }

  removeMessage(user, message, messages) {
    var read = this._post('/message/remove', {
      id: String(message.id)
    });
    read.subscribe(json => {
      if (!json.code) {
        messages = messages.filter(function (item) {
          return item.id !== message.id;
        });
      }
    });
  }

  getMessageList(user, page) {
    page = page > 1 ? page : 1;
    var url = '/message/list?id=' + user.friend.id + '&page=' + page;
    return this._get(url);
  }
}