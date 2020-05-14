import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lead-view',
  templateUrl: './lead-view.component.html'
})

export class LeadViewComponent implements OnInit {

  constructor() { } 
  leadViewHeader: string;
   
  ngOnInit() {
    this.leadViewHeader = "./assets/ucviewgeneric/viewLeadHeader.json";
  }
 
}
