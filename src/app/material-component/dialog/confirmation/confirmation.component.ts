import { Component, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  onEmitStatusChange = new EventEmitter();
  deails: any = {
    
  }
  constructor() { }

  ngOnInit(): void {
  }

}
