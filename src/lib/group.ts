import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Request } from './request';
import * as querystring from 'querystring';


@Injectable()

export class GroupService extends Request {

  constructor(protected http: Http) {
    super(http);
  }

  list(page = 1, limit = 10) {
    let url = '/group/list'
    let query = {

    };
    if (page > 1) {
      query['page'] = page;
    }
    if (limit > 0) {
      query['limit'] = limit;
    }
    url += '?' + querystring.stringify(query);
    return this._get(url);
  }
}