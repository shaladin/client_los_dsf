import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppReferantorTaxInfoObj } from 'app/shared/model/app-referantor/app-referantor-tax-info-obj.model';

@Component({
  selector: 'app-referantor-data-new-detail',
  templateUrl: './referantor-data-new-detail.component.html'
})
export class ReferantorDataNewDetailComponent implements OnInit {

  @Input() AppReferantorTaxInfoObj: AppReferantorTaxInfoObj = new AppReferantorTaxInfoObj();
  
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {

  }

}
