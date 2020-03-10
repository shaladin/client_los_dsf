import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { InputLookupObj } from 'app/shared/model/InputLookupObj.Model';

@Component({
  selector: 'app-lookup-profession',
  templateUrl: './lookup-profession.component.html',
  styleUrls: ['./lookup-profession.component.scss']
})
export class LookupProfessionComponent implements OnInit {
  @Input() lookupInput: any = new InputLookupObj();
  nameSelect : any;
  idSelect : any;
  jsonSelect : any;
  resultData : any;
  closeResult : any;
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    if(this.lookupInput != null) this.nameSelect = this.lookupInput.nameSelect;
  }
  doNothing()
  {}

  choose(id, name, item) {
    this.idSelect = id;
    this.nameSelect = name;
    this.jsonSelect = JSON.stringify(item);
    this.modalService.dismissAll();
    this.lookupInput.nameSelect = name;
  }

  searchClick()
  {
    this.resultData = [{
      professionName : "Akunting/Keuangan",
      professionCode : "001"
    },{
      professionName : "Engineering",
      professionCode : "002"
    },{
      professionName : "Administrasi Umum",
      professionCode : "003"
    },{
      professionName : "Konsultan",
      professionCode : "004"
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
}
