import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { UserService } from '../../../lib/user'
import { ChatService } from '../../../lib/chat'
import { AlertService } from '../../../lib/ui/alerts'
import { ChatPage } from '../../chat/chat';


/*
  Generated class for the User page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'friend-item',
  templateUrl: 'item.html',
  inputs: ['friends']
})

export class FriendItemPage {
  friends
  constructor(
    public navCtrl: NavController,
    public alertService: AlertService,
    public chatService: ChatService,
    public userService: UserService) {
    console.log(this.friends);
  }

  onRemove(json) {
    console.log(json);
    if (json.code === 0) {
      this.alertService.showAlert(
        '删除成功！',
        '你的好友已经成功删除！'
      );
    }
  }

  remove(user) {
    console.log(user);
    var self = this;
    this.alertService.showConfirm(
      '确定删除好友[' + user.friend.nickname + ']?',
      '你的好友[' + user.friend.nickname + ']将会被永久删除，你确定需要继续？',
      function () {
        console.log(user.friend);
        var observable = self.userService.removeFriend(user.friend.id);
        observable.subscribe(self.onRemove.bind(self));
      });
  }
  chat(user) {
    console.log(user);
    this.chatService.addUser(user.friend);
    this.navCtrl.push(ChatPage, {
      user: user
    });
  }
}
