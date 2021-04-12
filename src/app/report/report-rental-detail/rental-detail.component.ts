import { Component, OnInit } from '@angular/core';
import { InputReportObj } from 'app/shared/model/library/InputReportObj.model';

@Component({
  selector: 'app-rental-detail',
  templateUrl: './rental-detail.component.html'
})
export class RentalDetailComponent implements OnInit {

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
