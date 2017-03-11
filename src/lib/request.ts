import { Http, Response, RequestOptions } from '@angular/http';
import * as io from 'socket.io-client';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

export class Request {
  static socket
  cbs = []
  observable
  protected static url: string;
  protected static urlSocketIO: string;
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
    Request.initUrl();
    Request.initSocketIO();
    this.observable = Observable.fromEvent(Request.socket, 'message');
    this.observable.subscribe((json) => {
      for (let i = 0; this.cbs.length > i; i++) {
        this.cbs[i](json);
      }
    });
  }

  static setUrl(host, ssl = false) {
    if (ssl) {
      localStorage.setItem('url', 'https://' + host);
      localStorage.setItem('url-socket.io', 'wss://' + host);
    } else {
      localStorage.setItem('url', 'http://' + host);
      localStorage.setItem('url-socket.io', 'ws://' + host);
    }

    Request.initUrl();
  }

  static initUrl() {
    // var host = 'forum.webfullstack.me';
    // var host = 'server.xiv.im';
    var host = 'localhost:8101';
    Request.url = localStorage.getItem('url') || 'http://' + host;
    Request.urlSocketIO = localStorage.getItem('url-socket.io') || 'ws://' + host;
  }

  static initSocketIO() {
    if (!Request.socket) {
      // Request.socket = io(Request.urlSocketIO);
    }
  }

  subscribeMessage(cb) {
    this.cbs.push(cb);
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