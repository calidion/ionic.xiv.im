import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import * as markdown from 'showdown';
import * as prism from 'prismjs';

let converter = new markdown.Converter();
/*
  Generated class for the Chat page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
  styleUrls: [
    'assets/themes/prism.css',
    'assets/themes/prism-coy.css',
    'assets/themes/prism-dark.css',
    'assets/themes/prism-funky.css',
    'assets/themes/prism-okaidia.css',
    'assets/themes/prism-solarizedlight.css',
    'assets/themes/prism-tomorrow.css',
    'assets/themes/prism-twilight.css'
  ]
})


export class ChatPage {
  user
  message
  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams) {
    this.user = navParams.get('user');
    console.log(prism);


    // hide tabs when view loads
    this.viewCtrl.didEnter.subscribe(() => {
      this.setCSS('.tabbar', 'display', 'none');
      this.update('.document > pre');
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

  update(selector) {
    let domElement = document.querySelectorAll(selector);
    if (domElement !== null) {
      Object.keys(domElement).map((k) => {
        domElement[k].innerHTML = converter.makeHtml(domElement[k].innerHTML);
        console.log(domElement[k].innerHTML);
        // domElement[k].style[key] = value;
      });
    } // end if
    prism.highlightAll(function (data) {
      console.log(data);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
    console.log(this.user);
  }
  getInput(e) {
    this.message = e.target.value.trim();
  }

  send() {

  }
}


