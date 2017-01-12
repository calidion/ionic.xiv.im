import { Http, Response, RequestOptions } from '@angular/http';
import * as io from 'socket.io-client';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

export class Request {
  static socket
  protected static url: string = 'http://forum.webfullstack.me';
  _get(url) {
    let options = new RequestOptions({ withCredentials: true });
    return this.http.get(Request.url + url, options)
      .map((res: Response) => res.json())
      .catch(this.onError);
  }
  _post(url, data) {
    let options = new RequestOptions({ withCredentials: true });
    return this.http.post(Request.url + url, data, options)
      .map((res: Response) => res.json())
      .catch(this.onError);
  }
  constructor(protected http: Http) {
    if (!Request.socket) {
      Request.initSocketIO();
    }
  }

  static initSocketIO() {
    Request.socket = io(Request.url);
  }

  subscribeMessage(cb) {
    var observable = Observable.fromEvent(Request.socket, 'message');
    observable.subscribe(cb);
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