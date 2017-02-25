import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { UserService } from '../../lib/user';
import { ChatService } from '../../lib/chat';
import { BreathService } from '../../lib/breath';
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
  TIME_LIMIT = 100000
  users
  initialized
  selected
  user
  counts = {}
  interval
  constructor(public navCtrl: NavController,
    private toastCtrl: ToastController,
    public userService: UserService,
    public progressService: ProgressService,
    public chatService: ChatService,
    public breathService: BreathService
  ) {
    this.type = 'dialogs';
    this.initialized = true;
    this.selected = false;
    this.user = this.userService.get();

  }
  breath(friends = null) {
    friends = null;
    this.breathService.breathes((friends, counts) => {
      this.counts = counts;
    }, friends);
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      this.breathService.breathes((friends, counts) => {
        this.counts = counts;
      }, friends);
    }, this.TIME_LIMIT);
  }
  ionViewDidLoad() {
    console.log('on view load');
    this.getDialogs()
  }
  onPageWillEnter() {
    // You can execute what you want here and it will be executed right before you enter the view
    this.getDialogs();
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
      this.counts = this.breathService.counts;
      console.log(this.friends);
      this.breath(this.friends);
    }
    this.progressService.stop();
    this.type = 'friends';
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
    if (this.user) {
      this.progressService.stop();
      this.users = this.chatService.recent(this.userService.get());
      this.breath(this.users);
    } else {
      this.progressService.show('正在获取聊天信息...', true);
      setTimeout(() => {
        this.user = this.userService.get();
        this.getDialogs();
      }, 100);
    }
    this.type = 'dialogs';
    console.log(this.users);
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
