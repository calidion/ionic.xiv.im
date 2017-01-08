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

  user
  message
  messages = []
  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public chatService: ChatService,
    public navParams: NavParams) {
    this.user = navParams.get('user');
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
  setCSS(selector, key, value) {
    let domElement = document.querySelectorAll(selector);
    if (domElement !== null) {
      Object.keys(domElement).map((k) => {
        domElement[k].style[key] = value;
      });
    } // end if
  }

  updateMessage() {
    this.messages = this.messages.map(function (item) {
      item.text = converter.makeHtml(item.text);
      item.time = moment(item.time).format('LL[ ]LT');
      // console.log(item);
      return item;
    });
    setTimeout(function () {
      prism.highlightAll('', function (data) {
        console.log('prism renderred');
        console.log(data);
      });
      this.content.scrollToBottom();

    }.bind(this), 1000);

  }

  ionViewDidLoad() {

  }

  send() {
    this.messages = this.chatService.addMessage(this.user, this.message, 'from');
    this.updateMessage();
    this.message = '';
  }
}


