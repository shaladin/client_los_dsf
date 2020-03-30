import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lookup-collateral',
  templateUrl: './lookup-collateral.component.html',
  styleUrls: ['./lookup-collateral.component.scss']
})
export class LookupCollateralComponent implements OnInit {
  @Input() lookupInput: any;
  @Input() parentForm: any;
  @Input() jsonSelect : any;
  @Input() nameSelect: any = "Search ...";
  @Input() idSelect : any;
  @ViewChild('content') contentTemplate;
  resultData: any;
  closeResult: string;
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    if(this.lookupInput != null) this.nameSelect = this.lookupInput.nameSelect;
  }

  searchClick()
  {
    this.resultData = [{
      CollateralName : "Collateral1",
      CollateralCode : "Collateral 1"
    }];
  }

  choose(id, name, item) {
    this.idSelect = id;
    this.nameSelect = name;
    this.jsonSelect = JSON.stringify(item);
    this.modalService.dismissAll();
  }
  doNothing()
  {

  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
