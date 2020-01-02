import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {
  }

  ngOnInit() {
    this.apiService.logout(sessionStorage.getItem('username'));
    sessionStorage.removeItem('username');
    this.router.navigate(['/login']);
  }

}
