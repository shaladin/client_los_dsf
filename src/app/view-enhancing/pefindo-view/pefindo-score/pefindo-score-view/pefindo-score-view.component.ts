import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pefindo-score-view',
  templateUrl: './pefindo-score-view.component.html',
  styleUrls: ['./pefindo-score-view.component.css']
})
export class PefindoScoreViewComponent implements OnInit {

  @Input() ScoreData: any;
  

  constructor() {
    
   }

  ngOnInit() {
    
  }

}
