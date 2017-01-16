import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { UserService } from '../../lib/user';
import { ChatService } from '../../lib/chat';
import { UserSearchPage } from '../user/search';
import { ProgressService } from '../../lib/ui/progresses'
import { ChatPage } from '../chat/chat';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  public type
  public friends
  users
  initialized
  selected
  constructor(public navCtrl: NavController,
    private toastCtrl: ToastController,
    public userService: UserService,
    public progressService: ProgressService,
    public chatService: ChatService
  ) {
    this.type = 'dialogs';
    this.initialized = true;
    this.selected = false;
  }
  ionViewDidLoad() {
    console.log('on view load');
    this.getDialogs()
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
    this.progressService.stop();
    this.selected = true;
  }

  getFriends() {
    console.log('inside get friends');
    if (!this.friends) {
      var observable = this.userService.getFriends();
      this.progressService.show('正在获取好友信息...');
      observable.subscribe(this.onFriends.bind(this));
    }
  }
  getDialogs() {
    this.progressService.show('正在获取聊天信息...');
    this.users = this.chatService.recent();
    console.log(this.users);
    this.progressService.stop();
  }

  gotoAddPage() {
    this.navCtrl.push(UserSearchPage);
  }

  chat(user) {
    console.log(user);
    console.log('inside add chat');
    this.chatService.addUser(user, '');
    this.navCtrl.push(ChatPage, {
      user: user
    });
  }
}
