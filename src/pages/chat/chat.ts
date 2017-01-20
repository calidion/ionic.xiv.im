import { Component, ViewChild } from '@angular/core';
import { NavController, ViewController, NavParams, Content } from 'ionic-angular';
import * as markdown from 'showdown';
import * as prism from 'prismjs';
import { ChatService } from '../../lib/chat'
import * as moment from 'moment'
moment.locale('zh-CN');

let converter = new markdown.Converter();
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
  page: 1
  user
  message
  messages = []
  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public chatService: ChatService,
    public navParams: NavParams) {
    this.user = navParams.get('user');
    this.chatService.subscribeMessage(function (message) {
      if (message.receiver.id === this.user.friend.id) {
        message.type = 'to';
      } else if (message.sender.id === this.user.friend.id) {
        message.type = 'from';
      } else {
        return;
      }
      this.chatService.addUser(this.user, message);
      this.messages = this.chatService.addMessage(this.user, message);
      this.updateMessage();
    }.bind(this));
    
    var sub = this.chatService.getMessageList(this.user.friend, this.page++);
    sub.subscribe(json => {
      console.log('on get message ')
      console.log(json);
      console.log(!json.code);
      console.log(json.data);
      if (!json.code) {
        console.log('inisd aa e');
        var messages = json.data;
        var ids = [];
        for (var i = 0; i < messages.length; i++) {
          console.log('on message');
          ids.push(messages[i].id);
          this.onMessage(messages[i]);
        }
        this.chatService.readMessage(this.user, ids);
        this.updateMessage();
      }
    });
    // hide tabs when view loads
    this.viewCtrl.didEnter.subscribe(() => {
      this.setCSS('.tabbar', 'display', 'none');
      this.messages = this.chatService.getMessages(this.user);
      this.updateMessage();
    });

    // show tabs when view exits
    this.viewCtrl.willLeave.subscribe(() => {
      this.setCSS('.tabbar', 'display', 'flex');
    });
  }

  onMessage(message) {
    console.log('on get message');
    console.log(message);
    console.log(this.user);
    if (message.receiver.id === this.user.friend.id) {
      message.type = 'to';
    } else if (message.sender.id === this.user.friend.id) {
      message.type = 'from';
    } else {
      return;
    }
    this.chatService.addUser(this.user, message);
    this.chatService.addMessage(this.user, message);
  }
  setCSS(selector, key, value) {
    let domElement = document.querySelectorAll(selector);
    if (domElement !== null) {
      Object.keys(domElement).map((k) => {
        domElement[k].style[key] = value;
      });
    } // end if
  }

  updateMessage() {
    console.log(this.messages.length);
    var ids = [];
    this.messages = this.messages.sort(function (a, b) {
      return a.createdAt - b.createdAt;
    });
    this.messages = this.messages.map(function (item) {
      ids.push(item.id);
      item.text = converter.makeHtml(item.text);
      item.timeText = moment(item.time).format('LL[ ]LT');
      item.timeStatus = moment(item.time).format('MM-DD HH:mm');
      console.log(item);
      return item;
    });
    setTimeout(function () {
      prism.highlightAll('', function (data) {
        // console.log('prism renderred');
        // console.log(data);
      });
      if (this && this.content && this.content.scrollToBottom) {
        if (this.content.scrollToBottom instanceof Function) {
          this.content.scrollToBottom();
        }
      }
    }.bind(this), 1000);
  }

  ionViewDidLoad() {

  }

  send() {
    var observable = this.chatService.sendMessage(this.user.friend.id, this.message);
    this.message = '';
    observable.subscribe((json) => {
      // this.messages = this.chatService.addMessage(this.user, this.message, 'from');
      // this.updateMessage();
    });
  }
}


