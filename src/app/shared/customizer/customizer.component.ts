import { Component, OnInit, AfterViewChecked, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-customizer',
  templateUrl: './customizer.component.html',
  styleUrls: ['./customizer.component.scss']
})
export class CustomizerComponent implements OnInit, AfterViewChecked {

  options = {
    direction: 'ltr'
  };

  @Output() directionEvent = new EventEmitter<Object>();

  ngOnInit() {
    // Customizer JS File
    $.getScript('./assets/js/customizer.js');
  }

  ngAfterViewChecked() {

    // setTimeout(() => {
    //   var wrapperDiv = document.getElementsByClassName("wrapper")[0];
    //   var dir = wrapperDiv.getAttribute("dir");      
    //   this.options.direction = dir;      
    // }, 3000);


  }

  sendOptions() {
    this.directionEvent.emit(this.options);
  }

}
