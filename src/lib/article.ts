import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Request } from './request';

@Injectable()

export class ArticleService extends Request {
  user
  constructor(protected http: Http) {
    super(http);
  }

  list() {
    return this._get('/thread/list');
  }
}