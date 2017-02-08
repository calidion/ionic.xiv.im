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
  socket
  userMessage
  static MIN_MINUTES = 10 * 60 * 6000

  constructor(protected http: Http) {
    super(http);
  }

  getUsers(user) {
    console.log(user);
    var id = user.user ? user.user.id : user.id;
    return JSON.parse(localStorage.getItem(this.key + '_' + id));
  }
  recent(user) {
    return this.getUsers(user);
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
      to: to,
      text: text,
      time: new Date()
    });
  }


  

  // addMessage(message, messages) {

  //   messages = messages.filter(function (item) {
  //     return item.id !== message.id;
  //   });

  //   // Minial time gap for a section to occur.
  //   var lastTime = null;
  //   console.log(message.text);
  //   message.timeText = moment(message.createdAt).format('LL[ ]LT');
  //   message.timeStatus = moment(message.createdAt).format('MM-DD HH:mm');
  //   message.text = converter.makeHtml(message.text);

  //   messages = messages.map(function (item) {
  //     if (!lastTime || (item.createdAt - lastTime) > ChatService.MIN_MINUTES) {
  //       item.timed = true;
  //     }
  //     lastTime = item.createdAt;
  //     return item;
  //   });
  //   messages.push(message);
  //   messages = messages.sort(function (a, b) {
  //     return a.createdAt - b.createdAt;
  //   });
  //   // json[user.friend.email] = messages;
  //   // data[user.user.id] = json;
  //   // this.userMessage = data;
  //   // localStorage.setItem(this.getKey(user), JSON.stringify(data));
  //   return messages;
  // }

  // getUserCount(user) {
  //   let messages = this.getMessages(user) || [];
  //   var count = 0;
  //   for (var i = 0; i < messages.length; i++) {
  //     if (!messages[i].read) {
  //       count++;
  //     }
  //   }
  //   return count;
  // }

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
      id: message.id
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