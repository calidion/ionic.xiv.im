import { Component, ViewChild } from '@angular/core';
import { NavController, ViewController, NavParams, Content } from 'ionic-angular';
import * as markdown from 'showdown';
import * as prism from 'prismjs';
import { ChatService } from '../../lib/chat'
import * as moment from 'moment'
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
  end = false
  fetched = false
  lastTime = null
  newMessage = false;
  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public chatService: ChatService,
    public navParams: NavParams) {
    this.user = navParams.get('user');

    var timer = null;

    // this.messages = this.chatService.getMessages(this.user) || [];

    // this.page = parseInt((this.messages.length / this.limit).toFixed(0));

    // From Socket.IO
    this.chatService.subscribeMessage(message => {
      console.log('inside socket.io messages');
      this.messages = this.onMessage(message);
      this.newMessage = true;
      if (timer) {
        return;
      }
      timer = setTimeout(() => {
        this.messages = this.chatService.getMessages(this.user);
        this.updateMessage(true);
        timer = null;
      }, 1000);
    });
    this.getMessageList(true);
    // hide tabs when view loads
    this.viewCtrl.didEnter.subscribe(() => {
      this.setCSS('.tabbar', 'display', 'none');
      this.messages = this.chatService.getMessages(this.user);
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
        console.log(messages);
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
        var ids = [];
        for (var i = 0; i < messages.length; i++) {
          var message = messages[i];
          if (!message.read) {
            ids.push(message.id);
          }
          this.onMessage(message);
        }
        this.chatService.readMessage(this.user, ids);
        this.messages = this.chatService.getMessages(this.user);
        this.updateMessage(scroll);
      }
    });
  }

  onMessage(message) {
    if (message.receiver.id === this.user.friend.id) {
      message.type = 'to';
    } else if (message.sender.id === this.user.friend.id) {
      message.type = 'from';
    } else {
      return;
    }
    this.chatService.addUser(this.user, message);
    return this.chatService.addMessage(this.user, message);
  }
  setCSS(selector, key, value) {
    let domElement = document.querySelectorAll(selector);
    if (domElement !== null) {
      Object.keys(domElement).map((k) => {
        domElement[k].style[key] = value;
      });
    } // end if
  }

  updateMessage(scroll) {
    if (this.messages && this.messages.length) {
      console.log(this.messages.length);
      setTimeout(function () {
        prism.highlightAll('', function (data) {
          // console.log('prism renderred');
          // console.log(data);
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

  send() {
    this.newMessage = false;
    var observable = this.chatService.sendMessage(this.user.friend.id, this.message);
    this.message = '';
    observable.subscribe((json) => {
      // this.messages = this.chatService.addMessage(this.user, this.message, 'from');
      // this.updateMessage();
      setTimeout(() => {
        if (this.newMessage) {
          this.page = 1;
          this.getMessageList(true);
        }
      }, 1000);
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


