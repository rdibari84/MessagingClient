import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { ApiService, IMessage } from '../service/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnDestroy {
  recievedMessage: string;
  message: string;
  toUsername: string;
  fromUsername: string;
  subscription: Subscription;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    console.log("ngOnInit")
    this.subscription = this.apiService.getMessage()
      .subscribe(
        (msg: IMessage) => {
          console.log('got message', msg);
          this.recievedMessage = msg.message;
          this.fromUsername = msg.fromUsername;
          this.toUsername = msg.toUsername;
          console.log('this.recievedMessage', this.recievedMessage);
        },
        error => {
          console.log(error);
        }
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  sendMessage() {
    this.apiService.sendMessage(this.router.url.split('/message/')[1], sessionStorage.getItem('username'), this.message);
  }

  hasMessage(): boolean {
    return this.recievedMessage !== undefined;
  }
}
