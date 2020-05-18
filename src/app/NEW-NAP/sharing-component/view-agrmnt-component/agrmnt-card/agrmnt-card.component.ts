import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-agrmnt-card',
  templateUrl: './agrmnt-card.component.html'
})
export class AgrmntCardComponent implements OnInit {

  constructor() { } 
  @Input() AgrmntId: number;
  ngOnInit() { 
  }

}
