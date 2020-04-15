import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lead-view',
  templateUrl: './lead-view.component.html'
})

export class LeadViewComponent implements OnInit {

  constructor() { }

  leadViewHeader: any;
  isLeadData: any;
  isCustomerData: any;
  ngOnInit() {
    this.leadViewHeader = "./assets/ucviewgeneric/viewLeadHeader.json";
  }

  EnterTab(type) {
    if (type == "customerData") {
      this.isCustomerData = true;
      this.isLeadData = false;
    }
    else if (type == "leadData") {
      this.isCustomerData = false;
      this.isLeadData = true;
    }
  }
}
