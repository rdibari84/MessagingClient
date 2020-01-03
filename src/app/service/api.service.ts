import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { of, Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  socket;
  apiURL = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) {
    // create websocket connection on construction
    this.socket = io(this.apiURL);
  }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders().set('Content-Type', 'application/json');
  }

  login(username: string, password: string): Observable<string> {
    return this.httpClient.post<any>(this.apiURL + '/login', {
      'username': username,
      'password': password
    }, {
      headers: this.createHeaders()
    }).pipe(
      catchError(this._handleError)
    );
  }

  logout(username: string): void {
    this.socket.emit('logout', username);
  }

  register(username: string) {
    this.socket.emit('register', username);
  }

  sendMessage(username: string, fromUsername: string, message: string) {
    const msg = new IMessage(username, fromUsername, message);
    console.log('sending message:', msg);
    this.socket.emit('message', msg);
  }

  getMessage(): Observable<IMessage> {
    return Observable.create((observer) => {
      this.socket.on('message', (msg: IMessage) => {
        console.log('received message', msg);
        observer.next(msg);
      });
    });
  }

  getAllUsers(): Observable<string[]> {
    console.log("getAllUsers");
    return Observable.create((observer) => {
      this.socket.on('users', (user) => {
        observer.next(user);
      });
    });
  }

  private _handleError(resp: HttpErrorResponse) {
    if (resp.error instanceof ErrorEvent) {
      // a clientside or network error occured
      console.error(`An error occurred: ${resp.error.message}`);
    } else {
      // backend returned non 200
      console.error(`Received API response status ${resp.status}`);
    }

    return throwError({
      description: 'An error occured',
      status_code: resp.status,
      errors: resp.error
    } as ApiError);
  }
}

export interface ApiError {
  description: string,
  status_code: number,
  errors: any | null,
}

export class IMessage {
  constructor(public toUsername: string, public fromUsername: string, public message: string) { }
}