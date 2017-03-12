import { Component, ViewChild } from '@angular/core';
import { NavController, ViewController, NavParams, Content } from 'ionic-angular';
import * as markdown from 'showdown';
import * as prism from 'prismjs';
import { ChatService } from '../../lib/chat'
import * as moment from 'moment'

let converter = new markdown.Converter();

moment.locale('zh-CN');

/*
  Generated class for the Chat page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
  queries: {
    content: new ViewChild(Content)
  }
})


export class ChatPage {
  @ViewChild(Content) content: Content;
  limit = 20
  page = 1
  user
  message
  messages = []
  // 是否消息结尾
  end = false
  fetched = false
  // 最后消息活动时间
  lastTime = null
  newMessage = false;
  sending = false
  failed = false
  sendingMessage = ''
  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public chatService: ChatService,
    public navParams: NavParams) {
    this.user = navParams.get('user');

    // From Socket.IO
    this.chatService.subscribeMessage(message => {
      this.messages = this.messages.concat(message);
      this.updateFullMessage(this.messages, true);
    });

    this.getMessageList(true);

    // hide tabs when view loads
    this.viewCtrl.didEnter.subscribe(() => {
      this.setCSS('.tabbar', 'display', 'none');
      // this.messages = this.chatService.getMessages(this.user);
      this.updateMessage(false);
    });

    // show tabs when view exits
    this.viewCtrl.willLeave.subscribe(() => {
      this.setCSS('.tabbar', 'display', 'flex');
    });
  }

  getMessageList(scroll) {
    if (this.end) {
      return;
    }
    // Get Initial Messages
    var sub = this.chatService.getMessageList(this.user, this.page++);
    sub.subscribe(json => {
      if (!json.code) {
        var messages = json.data;
        this.fetched = true;
        if (!messages.length) {
          this.end = true;
          return;
        }
        this.newMessage = true;
        if (messages.length < this.limit) {
          this.end = true;
        } else {
          this.end = false;
        }
        // var ids = [];
        messages = this.messages.concat(messages);
        this.updateFullMessage(messages, scroll);

        // messages = messages.map(function (item) {
        //   item.createdAt = new Date(item.createdAt).getTime();
        //   return item;
        // });
        // messages = messages.sort(function (a, b) {
        //   return a.createdAt - b.createdAt;
        // });
        // messages = messages.map(function (item) {
        //   if (!item.read) {
        //     ids.push(item.id);
        //   }
        //   return this.updateItem(item);
        //   // item.timeText = moment(item.createdAt).format('LL[ ]LT');
        //   // item.timeStatus = moment(item.createdAt).format('MM-DD HH:mm');
        //   // item.html = converter.makeHtml(item.text);
        //   // this.onMessage(item);
        //   // if (!this.lastTime || (item.createdAt - this.lastTime) > ChatService.MIN_MINUTES) {
        //   //   item.timed = true;
        //   // }
        //   // this.lastTime = item.createdAt;
        //   // return item;
        // }.bind(this));


        // this.chatService.readMessage(this.user, ids, messages);
        // this.messages = messages;
        // this.updateMessage(scroll);
      }
    });
  }

  updateFullMessage(messages, scroll) {
    var ids = [];
    messages = messages.map(function (item) {
      item.createdAt = new Date(item.createdAt).getTime();
      return item;
    });
    messages = messages.sort(function (a, b) {
      return a.createdAt - b.createdAt;
    });
    messages = messages.map(function (item) {
      if (!item.read) {
        ids.push(item.id);
      }
      return this.updateItem(item);
    }.bind(this));
    this.messages = messages;
    this.chatService.readMessage(this.user, ids, messages);
    this.updateMessage(scroll);
  }

  updateItem(item) {
    item.timeText = moment(item.createdAt).format('LL[ ]LT');
    item.timeStatus = moment(item.createdAt).format('MM-DD HH:mm');
    item.html = converter.makeHtml(item.text);
    this.onMessage(item);
    if (!this.lastTime || (item.createdAt - this.lastTime) > ChatService.MIN_MINUTES) {
      item.timed = true;
    }
    this.lastTime = item.createdAt;
    return item;
  }

  addToQueue() {

  }

  onMessage(message) {
    if (!message) {
      return;
    }
    if (message.receiver.id === this.user.friend.id) {
      message.type = 'to';
    } else if (message.sender.id === this.user.friend.id) {
      message.type = 'from';
    }
    this.chatService.addUser(this.user, message);
  }

  setCSS(selector, key, value) {
    let domElement = document.querySelectorAll(selector);
    if (domElement !== null) {
      Object.keys(domElement).map((k) => {
        domElement[k].style[key] = value;
      });
    } // end if
  }

  scrollToBottom() {

  }

  updateMessage(scroll) {
    if (this.messages && this.messages.length) {
      console.log(this.messages.length);
      setTimeout(function () {
        prism.highlightAll('', function (data) {
        });
        if (scroll && this && this.content && this.content.scrollToBottom) {
          if (this.content.scrollToBottom instanceof Function) {
            this.content.scrollToBottom();
          }
        }
      }.bind(this), 1000);
    }
  }

  ionViewDidLoad() {

  }

  toBottom() {
    setTimeout(function () {
      if (this.content && this.content.scrollToBottom) {
        if (this.content.scrollToBottom instanceof Function) {
          this.content.scrollToBottom();
        }
      }
    }.bind(this), 1);
  }

  send(sendingMessage = '') {
    this.message = sendingMessage || this.message;
    this.sending = true;
    this.failed = false;
    this.newMessage = false;
    var observable = this.chatService.sendMessage(this.user.friend.id, this.message);
    this.sendingMessage = this.message;
    this.toBottom();
    this.message = '';
    observable.subscribe((json) => {
      this.sending = false;
      if (json.code) {
        this.failed = true;
        return;
      }
      var message = json.data;
      message = this.updateItem(message);

      this.messages.push(message);
      this.updateMessage(true);
    });
  }
  keyup(event) {
    console.log('inside key up');
    console.log(event);
    this.send();
  }

  more() {
    this.getMessageList(false);
  }
}


