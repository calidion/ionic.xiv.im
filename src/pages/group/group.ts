import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { UserService } from '../../lib/user';
import { GroupService } from '../../lib/group';
import { ProgressService } from '../../lib/ui/progresses'
import { AlertService } from '../../lib/ui/alerts'
import { AlertController } from 'ionic-angular';
import { GroupChatPage } from '../group-chat/chat';


@Component({
  selector: 'page-group',
  templateUrl: 'group.html'
})
export class GroupPage {
  type
  user
  initialized
  groups
  selected
  counts
  constructor(
    public navCtrl: NavController,
    public userService: UserService,
    public progressService: ProgressService,
    public alertService: AlertService,
    public alertCtrl: AlertController,
    public groupService: GroupService
  ) {
    this.type = 'recent';
    this.initialized = true;
    this.user = this.userService.get();
  }

  onChange(e) {
    console.log(e);
    console.log(this.type);
    switch (this.type) {
      case 'recent':
        this.getRecent();
        break;
      default:
        this.getGroups();
    }
  }
  getRecent() {

  }
  getGroups() {
    console.log('inside get friends');
    if (!this.groups) {
      var observable = this.groupService.list();
      this.progressService.show('正在获取群组信息...');
      observable.subscribe(this.onGroup.bind(this));
    }
    this.type = 'groups';
  }
  onGroup(json) {
    console.log(json);
    if (json.code === 0) {
      this.groups = json.data;
      console.log(json.data);
    }
    this.progressService.stop();
    this.selected = true;
  }

  createGroup() {
    this.showCreateGroupDialog().then(data => {
      this.create(data['name'], data['desc']);
    });
  }

  create(name, desc) {
    var observable = this.groupService.create(name, desc);
    this.progressService.show('正在创建群组...');
    observable.subscribe(this.onCreated.bind(this));
  }
  onCreated(json) {
    console.log(json);
    if (json.code === 0) {
      this.alertService.timed('成功！', '群组创建成功!', 500);
      this.getGroups();
    } else {
      this.alertService.timed('失败！', '群组创建失败，请确保网络正常! 错误原因: ' + json.message, 500);
    }
    this.progressService.stop();
  }

  chat(group) {
    console.log(group);
    console.log('inside group chat');
    this.navCtrl.push(GroupChatPage, {
      group: group,
      user: this.user
    });
  }

  showCreateGroupDialog() {
    return new Promise((resolve, reject) => {
      let alert = this.alertCtrl.create({
        title: '创建群',
        inputs: [
          {
            name: 'name',
            placeholder: '请输入群名'
          },
          {
            name: 'desc',
            placeholder: '请输入群描述'
          },
        ],
        buttons: [
          {
            text: '取消',
            role: 'cancel',
            handler: data => {
              resolve(false);
            }
          },
          {
            text: '创建',
            handler: data => {
              console.log(data.name, data.desc);
              resolve(data);
            }
          }
        ]
      });
      alert.present();
    });
  }
}
