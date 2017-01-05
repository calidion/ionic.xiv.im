import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

// Pages
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { UserPage } from '../pages/user/user';
import { UserDetailsPage } from '../pages/user/details';
import { UserSearchPage } from '../pages/user/search';
import { UserPasswordResetPage } from '../pages/user/password/reset';
import { UserItemGitHubPage } from '../pages/user/github/item';
import { GroupPage } from '../pages/group/group';
import { FriendItemPage } from '../pages/friend/item/item';
import { ChatPage } from '../pages/chat/chat';
import { ChatBarPage } from '../pages/chat-bar/chat-bar';


// Services
import { UserService } from '../lib/user';
import { GitHubService } from '../lib/github';
import { ProgressService } from '../lib/ui/progresses';
import { AlertService } from '../lib/ui/alerts';
import { ChatService } from '../lib/chat';
// import { MessageService } from '../lib/message';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    UserPage,
    TabsPage,
    UserDetailsPage,
    UserPasswordResetPage,
    UserSearchPage,
    UserItemGitHubPage,
    GroupPage,
    FriendItemPage,
    ChatPage,
    ChatBarPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    UserPage,
    TabsPage,
    UserDetailsPage,
    UserPasswordResetPage,
    UserSearchPage,
    UserItemGitHubPage,
    GroupPage,
    FriendItemPage,
    ChatPage,
    ChatBarPage
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    UserService, GitHubService,
    ProgressService, AlertService,
    ChatService
  ]
})
export class AppModule { }
