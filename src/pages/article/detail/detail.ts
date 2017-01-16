import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { ArticleService } from '../../../lib/article';

import * as markdown from 'showdown';
import * as prism from 'prismjs';
import * as moment from 'moment'
moment.locale('zh-CN');
let converter = new markdown.Converter();


@Component({
  selector: 'page-article-detail',
  templateUrl: 'detail.html'
})
export class ArticleDetailPage {
  data
  page
  replies
  count
  article
  constructor(public navCtrl: NavController, navParams: NavParams, public articleService: ArticleService) {
    this.article = navParams.get('article');
    console.log(this.article);
    this.article.text = converter.makeHtml(this.article.content);
    this.article.time = moment(this.article.update_at).format('LL LT');
    // this.article.timeL = moment(this.article.update_at).format('LT');

  }
  ionViewDidLoad() {
    console.log('on view load');
    var sub = this.articleService.list();
    sub.subscribe((json) => {
      if (json.code === 0) {
        json = json.data;
        this.count = json.count;
        this.replies = json.results;
        this.page = json.page;
      }
      setTimeout(function () {
        prism.highlightAll('', function (data) {
        });
      }.bind(this), 1000);
      console.log(this.data);
    });
  }
}
