import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lookup-customer',
  templateUrl: './lookup-customer.component.html',
  styleUrls: ['./lookup-customer.component.scss']
})
export class LookupCustomerComponent implements OnInit {
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
      custNo : "CUSTNO001",
      custName : "Customer 1",
      fullAddr : "Jalan Panjang No.18 Kecamatan A Kelurahan B 100/001 Jakarta Barat, Jakarta, 11350",
      custType : "Personal"
    },{
      custNo : "CUSTNO002",
      custName : "Customer 2",
      fullAddr : "Jalan Panjang No.30 Kecamatan A Kelurahan B 100/001 Jakarta Barat, Jakarta, 11350",
      custType : "Personal"
    },{
      custNo : "CUSTNO003",
      custName : "Customer 3",
      fullAddr : "Jalan Panjang No.40 Kecamatan A Kelurahan B 100/001 Jakarta Barat, Jakarta, 11350",
      custType : "Personal"
    },{
      custNo : "CUSTNO004",
      custName : "Customer 4",
      fullAddr : "Jalan Panjang No.50 Kecamatan A Kelurahan B 100/001 Jakarta Barat, Jakarta, 11350",
      custType : "Company"
    }];
  }

  choose(id, name, item) {
    console.log(id + " : " + name);
    console.log(item);
    this.idSelect = id;
    this.nameSelect = name;
    this.jsonSelect = JSON.stringify(item);
    this.modalService.dismissAll();
  }

  doNothing()
  {}

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
