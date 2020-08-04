import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lookup-customer-group',
  templateUrl: './lookup-customer-group.component.html',
  styleUrls: ['./lookup-customer-group.component.scss']
})
export class LookupCustomerGroupComponent implements OnInit {
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
  }

  doNothing()
  {

  }

  searchClick()
  {
    this.resultData = [{
      CustGroupName : "Customer Group 1",
      CustGroupNo : "CustGroupNo1"
    },{
      CustGroupName : "Customer Group 2",
      CustGroupNo : "CustGroupNo2"
    },{
      CustGroupName : "Customer Group 3",
      CustGroupNo : "CustGroupNo3"
    },{
      CustGroupName : "Customer Group 4",
      CustGroupNo : "CustGroupNo4"
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

  choose(id, name, item) {
    this.idSelect = id;
    this.nameSelect = name;
    this.jsonSelect = JSON.stringify(item);
    this.modalService.dismissAll();
  }

}
