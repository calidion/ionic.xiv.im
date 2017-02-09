import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { GroupPage } from '../group/group';
import { ArticlePage } from '../article/article';
import { UserPage } from '../user/user';
import { UserService } from '../../lib/user'
import { ProgressService } from '../../lib/ui/progresses'
import { BreathService } from '../../lib/breath'


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  chat: any = HomePage;
  group: any = GroupPage;
  article: any = ArticlePage;
  user: any = UserPage;
  count = 0;
  constructor(
    public userSerivce: UserService,
    navController: NavController,
    progress: ProgressService,
    public breathService: BreathService) {
    progress.show('正在请求用户信息...');
    let observable = userSerivce.profile();
    observable.subscribe((json) => {
      if (json['code'] !== 0) {
        userSerivce.auth();
      } else {
        userSerivce.set(json.data);
        progress.stop();
        setInterval(() => {
          this.breath();
        }, 10000);
      }
    });
  }

  breath() {
    var user = this.userSerivce.get();
    var updates = this.breathService.update(user.id);
    updates.subscribe(json => {
      console.log(json);
      if (json.code === 0) {
        this.count = json.data;
      }
    });
  }
}
