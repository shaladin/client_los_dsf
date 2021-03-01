import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/Report/InputReportObj.model';

@Component({
  selector: 'app-rental-summary',
  templateUrl: './rental-summary.component.html'
})
export class RentalSummaryComponent implements OnInit {

  mode: string = "Default";
  Marketing: boolean;
  Supplier : boolean;
  Product : boolean;
  BrandType : boolean;

  inputReportObj: InputReportObj = new InputReportObj();

  constructor() { 
  }

  ngOnInit() {
  }

  back(){
    this.mode = 'Default';
  }
  
  setPaging(event)
  {
    this.mode = event;
    if(this.mode == 'Marketing'){
      this.Marketing = true;
    }
    else if (this.mode == 'Supplier'){
      this.Supplier = true;
    }
    else if (this.mode == 'Product'){
      this.Product = true;
    }
    else if (this.mode == 'BrandType'){
      this.BrandType = true;
    }
  }

}
