import { Component, OnInit, OnChanges } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnChanges {
  message: string;
  toUsername: string;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) { 
    this.toUsername = this.router.url.split("/message/")[2];
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.apiService.getMessage();
  }

  sendMessage() {
    console.log("this.message", this.message);
    this.apiService.sendMessage(this.toUsername, this.message);
    this.message = '';
  }
}
