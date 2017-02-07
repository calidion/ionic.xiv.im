import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

// Pages
import { AboutPage } from '../pages/about/about';
import { ArticlePage } from '../pages/article/article';
import { ArticleDetailPage } from '../pages/article/detail/detail';
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
import { MessageItemPage } from '../pages/chat/message/message';


// Services
import { UserService } from '../lib/user';
import { GitHubService } from '../lib/github';
import { ProgressService } from '../lib/ui/progresses';
import { AlertService } from '../lib/ui/alerts';
import { ChatService } from '../lib/chat';
import { ArticleService } from '../lib/article';
import { BreathService } from '../lib/breath';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ArticlePage,
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
    MessageItemPage,
    ArticleDetailPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      mode: 'ios'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ArticlePage,
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
    MessageItemPage,
    ArticleDetailPage
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    UserService, GitHubService,
    ProgressService, AlertService,
    ChatService, ArticleService,
    BreathService
  ]
})
export class AppModule { }
