import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Request } from './request';

@Injectable()

export class BreathService extends Request {
  user
  constructor(protected http: Http) {
    super(http);
  }

  update(id) {
    var url = '/message/breath?id=' + id;
    return this._get(url);
  }
  
}