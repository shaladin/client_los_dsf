import { Component, OnInit, Input } from '@angular/core';
import { InputFieldObj } from '../model/InputFieldObj.Model';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  @Input() inputField;

  constructor() { }

  ngOnInit() {
    console.log(this.inputField);
  }
  onSelect(event)
  {
    console.log(event);
    this.inputField.areaCode2 = event.kelurahan;
    this.inputField.areaCode1 = event.kecamatan;
    this.inputField.city = event.city;
    this.inputField.zipcode = event.zipcode;
    this.inputField.subZipCode = event.subZipcode;
  }
}
