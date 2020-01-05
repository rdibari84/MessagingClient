import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { ApiService, IMessage } from '../service/api.service';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnDestroy {
  recievedMessages: IMessage[] = [];
  messageToSend: string;
  toUser: string;
  fromUser: string = sessionStorage.getItem('username');
  messageForm: FormGroup;
  recievedMessagesSubscription: Subscription;
  messageHistorySubscription: Subscription;
  routerSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.toUser = this.router.url.split('/message/')[1];
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd &&
        event.id === 1
      ) {
        console.log('browser refreshed');
        this.apiService.register(this.fromUser);
      }
    });
  }

  ngOnInit() {
    console.log('ngOnInit');

    this.messageForm = this.formBuilder.group({
      messageToSend: ['']
    });

    this.messageHistorySubscription = this.apiService.getMessageHistory(this.toUser, this.fromUser)
      .subscribe(
        (msgs: IMessage[]) => this.recievedMessages = msgs,
        error => {
          console.log(error);
        }
      );

    this.recievedMessagesSubscription = this.apiService.getMessage()
      .subscribe(
        (msgs: IMessage[]) => this.recievedMessages = msgs,
        error => {
          console.log(error);
        }
      );
  }

  ngOnDestroy() {
    this.recievedMessagesSubscription.unsubscribe();
    this.messageHistorySubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }

  get formInputs() { return this.messageForm.controls; }

  sendMessage() {
    const d = new Date();
    const dateStr = `${d.getHours()}:${d.getMinutes()} ${d.getMonth() + 1}-${d.getDate()}-${d.getFullYear()}`;
    this.apiService.sendMessage(this.toUser, this.fromUser, this.formInputs.messageToSend.value, dateStr);
    this.formInputs.messageToSend.setValue('');
  }

  hasMessage(): boolean {
    return this.recievedMessages.length > 0;
  }
}
