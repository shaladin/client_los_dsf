import { Component, OnInit, Input } from '@angular/core';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lookup-supplier',
  templateUrl: './lookup-supplier.component.html',
  styleUrls: ['./lookup-supplier.component.scss']
})
export class LookupSupplierComponent implements OnInit {
  @Input() lookupInput: any = new InputLookupObj();
  nameSelect : any;
  idSelect : any;
  jsonSelect : any;
  resultData : any;
  closeResult : any;
  
  constructor(private modalService: NgbModal) { }

  searchClick()
  {
    this.resultData = [{
      supplierCode : "001",
      supplierName : "Supplier 1"
    },{
      supplierCode : "002",
      supplierName : "Supplier 2"
    },{
      supplierCode : "003",
      supplierName : "Supplier 3"
    },{
      supplierCode : "004",
      supplierName : "Supplier 4"
    }];
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

  ngOnInit() {
  }

  choose(id, name, item) {
    this.idSelect = id;
    this.nameSelect = name;
    this.lookupInput.nameSelect = name;
    this.jsonSelect = JSON.stringify(item);
    this.modalService.dismissAll();
    this.resultData = [];
  }
}
