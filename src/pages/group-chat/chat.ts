import { Component, ViewChild } from '@angular/core';
import { NavController, ViewController, NavParams, Content } from 'ionic-angular';
import * as markdown from 'showdown';
import * as prism from 'prismjs';
import { GroupChatService } from '../../lib/groupchat'
import * as moment from 'moment'

import { GroupSettingsPage } from '../group-settings/settings';

let converter = new markdown.Converter();

moment.locale('zh-CN');

/*

  Generated class for the Chat page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.

*/

@Component({
  selector: 'page-group-chat',
  templateUrl: 'chat.html',
  queries: {
    content: new ViewChild(Content)
  }
})

export class GroupChatPage {
  @ViewChild(Content) content: Content;
  limit = 20
  page = 1
  group
  message
  messages = []
  end = false
  fetched = false
  lastTime = null
  newMessage = false;
  user
  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public chatService: GroupChatService,
    public navParams: NavParams) {
    this.group = navParams.get('group');
    this.user = navParams.get('user');

    var timer = null;

    // From Socket.IO
    this.chatService.subscribeMessage(message => {
      this.newMessage = true;
      if (timer) {
        return;
      }
      timer = setTimeout(() => {
        this.updateMessage(true);
        timer = null;
      }, 1000);
    });

    this.getMessageList(true);

    // hide tabs when view loads
    this.viewCtrl.didEnter.subscribe(() => {
      this.setCSS('.tabbar', 'display', 'none');
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
    var sub = this.chatService.getMessageList(this.group.group, this.page++);
    sub.subscribe(json => {
      if (!json.code) {
        var messages = json.data.messages;
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

        var lastTime = null;

        messages = this.messages.concat(messages);
        messages = messages.sort(function (a, b) {
          return a.createdAt - b.createdAt;
        });
        messages = messages.map(function (item) {
          item.timeText = moment(item.createdAt).format('LL[ ]LT');
          item.timeStatus = moment(item.createdAt).format('MM-DD HH:mm');
          item.html = converter.makeHtml(item.text);
          this.onMessage(item);
          if (!lastTime || (item.createdAt - lastTime) > GroupChatService.MIN_MINUTES) {
            item.timed = true;
          }
          lastTime = item.createdAt;
          return item;
        }.bind(this));
        this.messages = messages;
        this.updateMessage(scroll);
      }
    });
  }

  onMessage(message) {
    console.log(message.sender);
    console.log(this.user);
    if (message.sender.id === this.user.id) {
      message.type = 'to';
    } else {
      message.type = 'from';
    }
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

  send() {
    this.newMessage = false;
    console.log('send group message');
    console.log(this.group);
    var observable = this.chatService.sendMessage(this.group.group, this.message);
    this.message = '';
    observable.subscribe((json) => {
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

  settingsGroup(group) {
    this.navCtrl.push(GroupSettingsPage, {
      group: group,
      user: this.user
    });
  }
}


