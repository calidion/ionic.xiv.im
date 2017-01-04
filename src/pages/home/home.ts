import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { UserService } from '../../lib/user';
import { ChatService } from '../../lib/chat';
import { UserSearchPage } from '../user/search';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  public type
  public friends
  initialized
  constructor(public navCtrl: NavController,
    private toastCtrl: ToastController,
    public userService: UserService) {
    this.type = 'dialogs';
    this.initialized = false;
  }
  onChange(e) {
    console.log(e);
    console.log(this.type);
    switch (this.type) {
      case 'friends':
        this.getFriends();
        break;
      default:
        this.getDialogs();
    }
  }

  onFriends(json) {
    console.log(json);
    if (json.code === 0) {
      this.friends = json.data;
      console.log(this.friends);
    } else {

    }
    this.initialized = true;
  }

  getFriends() {
    console.log('inside get friends');
    if (!this.friends) {
      var observable = this.userService.getFriends();
      observable.subscribe(this.onFriends.bind(this));
    }
  }
  getDialogs() {

  }

  gotoAddPage() {
    this.navCtrl.push(UserSearchPage);
  }
}
