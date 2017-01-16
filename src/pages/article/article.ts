import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { ArticleService } from '../../lib/article';
import { ArticleDetailPage } from './detail/detail';

@Component({
  selector: 'page-article',
  templateUrl: 'article.html'
})
export class ArticlePage {
  data
  page
  articles
  count
  constructor(public navCtrl: NavController, public articleService: ArticleService) {

  }
  ionViewDidLoad() {
    console.log('on view load');
    var sub = this.articleService.list();
    sub.subscribe((json) => {
      if (json.code === 0) {
        json = json.data;
        this.count = json.count;
        this.articles = json.results;
        this.page = json.page;
      }

      console.log(this.data);
    });
  }
  read(article) {
    this.navCtrl.push(ArticleDetailPage, {
      article: article
    });
  }
}
