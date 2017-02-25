import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Request } from './request';
// import * as markdown from 'showdown';
import * as moment from 'moment'
// let converter = new markdown.Converter();

moment.locale('zh-CN');

@Injectable()

export class GroupChatService extends Request {
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

  sendMessage(group, text) {
    console.log('group send', group, text);
    return this._post('/group/message/send', {
      group: group,
      text: text
    });
  }

  readMessage(group, messages) {
    var read = this._get('/group/message/list?group=' + group);
    read.subscribe(json => {
      if (!json.code) {
        // messages = messages.map(function (item) {
        //   if (ids.indexOf(item.id) !== -1) {
        //     item.read = true;
        //   }
        //   return item;
        // });
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

  getMessageList(group, page) {
    page = page > 1 ? page : 1;
    var url = '/message/list?group=' + group.id + '&page=' + page;
    return this._get(url);
  }
}