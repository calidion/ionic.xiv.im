import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';

/*
  Generated class for the Chat page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})


export class ChatPage {
  user
  message
  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams) {
    this.user = navParams.get('user');

    // hide tabs when view loads
    this.viewCtrl.didEnter.subscribe(() => {
      this.setCSS('.tabbar', 'display', 'none');
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


