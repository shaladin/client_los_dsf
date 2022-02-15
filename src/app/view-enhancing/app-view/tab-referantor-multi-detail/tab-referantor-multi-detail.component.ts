import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppReferantorTaxInfoObj } from 'app/shared/model/app-referantor/app-referantor-tax-info-obj.model';

@Component({
  selector: 'app-tab-referantor-multi-detail',
  templateUrl: './tab-referantor-multi-detail.component.html'
})
export class TabReferantorMultiDetailComponent implements OnInit {

  @Input() AppReferantorTaxInfoObj: AppReferantorTaxInfoObj = new AppReferantorTaxInfoObj();
  
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
