import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lookup-zipcode',
  templateUrl: './lookup-zipcode.component.html',
  styleUrls: ['./lookup-zipcode.component.scss']
})
export class LookupZipcodeComponent implements OnInit {
  @Input() lookupInput: any;
  nameSelect : any;
  idSelect : any;
  jsonSelect : any;
  resultData : any;
  closeResult : any;
  @Output() select : EventEmitter<any> = new EventEmitter();
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    if(this.lookupInput != null)
    {
      this.nameSelect = this.lookupInput.nameSelect;
    }
  }

  choose(id, name, item) {
    this.idSelect = id;
    this.nameSelect = name;
    this.jsonSelect = JSON.stringify(item);
    this.lookupInput.nameSelect = name;
    this.modalService.dismissAll();
    this.select.emit(item);
    
  }

  searchClick()
  {
    this.resultData = [{
      city : "Jakarta Barat",
      zipcode : "11110",
      kecamatan : "Taman Sari",
      kelurahan : "Pinangsia"
    },{
      city : "Jakarta Barat",
      zipcode : "11130",
      kecamatan : "Taman Sari",
      kelurahan : "Keagungan"
    },{
      city : "Jakarta Barat",
      zipcode : "11530",
      kecamatan : "Kebon Jeruk",
      kelurahan : "Kebon Jeruk"
    },{
      city : "Jakarta Barat",
      zipcode : "11650",
      kecamatan : "Kembangan",
      kelurahan : "Meruya Selatan"
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
