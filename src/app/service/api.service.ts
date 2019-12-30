import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiURL = 'http://www.server.com/api/';
  currentUserValue: string;

  constructor(private httpClient: HttpClient) {
  }

  login(username: string, password: string): Observable<string> {
    this.currentUserValue = 'username';
    return of('1');
  }

  logout() {
    this.currentUserValue = '';
  }

  register() {

  }
}
