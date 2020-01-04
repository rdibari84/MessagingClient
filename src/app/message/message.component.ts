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
    console.log('this.chattingWithPerson', this.chattingWithPerson);
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.apiService.getMessageHistory(this.router.url.split('/message/')[1], sessionStorage.getItem('username'))
      .subscribe(
        (msgs: IMessage[]) => this.recievedMessages = msgs,
        error => {
          console.log(error);
        }
      );
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
    this.apiService.sendMessage(this.chattingWithPerson, sessionStorage.getItem('username'), this.messageToSend, new Date().toTimeString());
  }

  hasMessage(): boolean {
    return this.recievedMessages.length > 0;
  }
}
