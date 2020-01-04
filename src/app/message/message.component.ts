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
  recievedMessages: IMessage[] = [];
  messageToSend: string;
  subscription: Subscription;
  chattingWithPerson: string;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.chattingWithPerson = this.router.url.split('/message/')[1];
  }

  ngOnInit() {
    console.log("ngOnInit");
    this.apiService.getMessageHistory(this.router.url.split('/message/')[1], sessionStorage.getItem('username'));
    this.subscription = this.apiService.getMessage()
      .subscribe(
        (msgs: IMessage[]) => this.recievedMessages = msgs,
        error => {
          console.log(error);
        }
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  sendMessage() {
    this.apiService.sendMessage(this.router.url.split('/message/')[1], sessionStorage.getItem('username'), this.messageToSend);
  }

  hasMessage(): boolean {
    return this.recievedMessages.length > 0;
  }
}
