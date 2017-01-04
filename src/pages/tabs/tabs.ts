import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { GroupPage } from '../group/group';
import { ContactPage } from '../contact/contact';
import { UserPage } from '../user/user';
import { UserService } from '../../lib/user'
import { ProgressService } from '../../lib/ui/progresses'


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  chat: any = HomePage;
  group: any = GroupPage;
  article: any = ContactPage;
  user: any = UserPage;

  constructor(
    userSerivce: UserService,
    navController: NavController,
    progress: ProgressService) {
    progress.show('正在请求用户信息...');
    let observable = userSerivce.profile();
    observable.subscribe((json) => {
      if (json['code'] !== 0) {
        userSerivce.auth();
      } else {
        userSerivce.set(json.data);
        progress.stop();
      }
    });
  }
}
