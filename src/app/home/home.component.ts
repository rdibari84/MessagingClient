import { Component, OnInit, OnChanges, OnDestroy, SimpleChange, SimpleChanges } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Observable, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  currentUserId: string;
  loggedInUsers: string[];
  subscription: Subscription;
  constructed: boolean;
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    this.currentUserId = sessionStorage.getItem('username');
    this.apiService.register(this.currentUserId);
    this.subscription = this.apiService
      .getAllUsers()
      .subscribe(
        (users: string[]) => {
          console.log(users);
          this.loggedInUsers = users.filter(data => data !== this.currentUserId);
        },
        error => {
          console.log(error);
        }
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  message(id: string): void {
    this.router.navigate(['/message', id]);
  }

}
