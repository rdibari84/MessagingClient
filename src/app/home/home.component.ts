import { Component, OnInit, OnChanges, OnDestroy, SimpleChange, SimpleChanges } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Observable, Subscription } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  currentUserId: string;
  loggedInUsers: string[];
  subscription: Subscription;
  routerSubscription: Subscription;
  constructed: boolean;
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router) {
      this.currentUserId = sessionStorage.getItem('username');
      this.routerSubscription = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd &&
          event.id === 1
        ) {
          console.log('browser refreshed');
          this.apiService.register(this.currentUserId);
        }
      });
  }

  ngOnInit() {
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
    this.routerSubscription.unsubscribe();
  }

  message(id: string): void {
    this.router.navigate(['/message', id]);
  }

}
