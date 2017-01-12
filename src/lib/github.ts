import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()

export class GitHubService {
  private githubOptions = {
    client_id: '29f4e928b4d220d773d8',
    client_secret: '8694a890987ad26729edece51344ea3c1bf4ab8c'
  }
  constructor(private http: Http) {

  }

  search(q) {
    let url = 'https://api.github.com/search/users?q=' + encodeURIComponent(q) + '&'
      + this.getOptions();
    return this.http.get(url)
      .map((res: Response) => res.json())
      .catch(this.onError);
  }

  getOptions() {
    var data = [];
    for (var key in this.githubOptions) {
      data.push(key + '=' + this.githubOptions[key]);
    }
    return data.join('&');
  }

  getUser(username) {
    var url = 'https://api.github.com/users/' + encodeURIComponent(username) + '?'
      + this.getOptions();
    return this.http.get(url)
      .map((res: Response) => res.json())
      .catch(this.onError);
  }

  onError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }
}