import { Component, OnInit, Input } from '@angular/core';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lookup-agency',
  templateUrl: './lookup-agency.component.html',
  styleUrls: ['./lookup-agency.component.scss']
})
export class LookupAgencyComponent implements OnInit {
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
      agencyCode : "001",
      agencyName : "Agency 1"
    },{
      agencyCode : "002",
      agencyName : "Agency 2"
    },{
      agencyCode : "003",
      agencyName : "Agency 3"
    },{
      agencyCode : "004",
      agencyName : "Agency 4"
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
    this.jsonSelect = JSON.stringify(item);
    this.modalService.dismissAll();
    this.resultData = [];
  }
}
