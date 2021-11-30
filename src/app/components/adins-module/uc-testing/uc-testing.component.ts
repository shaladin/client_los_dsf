import { Component, ElementRef, forwardRef, HostListener, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import "rxjs/add/operator/filter"

const KEY_CODE = {
  enter: 13,
  arrowUp: 38,
  arrowDown: 40,
  esc: 27,
}

const CSS_CLASS_NAMES = {
  highLight: 'dd-highlight-item',
}

@Component({
  selector: 'app-uc-testing',
  templateUrl: './uc-testing.component.html',
  styleUrls: ['./uc-testing.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UcTestingComponent),
      multi: true
    }
  ]
})
export class UcTestingComponent  implements ControlValueAccessor{
  @ViewChild('filterInput') filterInput: ElementRef;
  @ViewChild('displayLabel') displayLabel: ElementRef;
  @ViewChildren('listItems') listItems: QueryList<ElementRef>;
  @HostListener('document:click', ['$event'])
  onClick(ev: MouseEvent) {
    const clickInside = this.elemRef.nativeElement.contains(ev.target);
    if (!clickInside) {
      this.isListHide = true;
    }
  }
  _items = [];

  _list = new BehaviorSubject<any[]>([]);
  @Input() placeholder = 'Select';
  _value: string;
  _display: string = 'Select';

  isListHide = true;

  searchText = '';

  onChange: any = () => { };
  onTouched: any = () => { };

  keyDowns: Observable<KeyboardEvent> = Observable.fromEvent(this.elemRef.nativeElement, 'keydown');

  pressEnterKey: Observable<KeyboardEvent>;
  @Input()
  set list(list) {
    this._list.next(list);
  }

  set items(list) {
    this._items = list;
  }
  get items(): Array<{ id: number, display: string }> {
    return this._items;
  }
  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
  }

  get display() {
    return this._display;
  }
  set display(value) {
    this._display = value;
  }
  constructor(private elemRef: ElementRef) {
    this.pressEnterKey = this.keyDowns.filter((e: KeyboardEvent) => e.keyCode === KEY_CODE.enter);
  }

  ngOnInit() {
    this._list.subscribe((list) => {
      this.items = list
      this.setItem(this.findItem(this.value));
    });


    this.pressEnterKey.filter(() => !this.isListHide).subscribe(() => {
      const hightLightItem = this.listItems.find((elem) => elem.nativeElement.classList.contains(CSS_CLASS_NAMES.highLight));
      if (hightLightItem) {
        const item = JSON.parse(hightLightItem.nativeElement.getAttribute('data-dd-value'));
        this.setItem(item);
        this.onChange(item.id);
      }
    })

    this.pressEnterKey.subscribe((e) => {
      this.toggle();
    });

    this.keyDowns.filter((e) => e.keyCode === KEY_CODE.esc).subscribe(() => {
      this.isListHide = true;
      this.focus();
    });
    this.keyDowns.filter((e) => ((e.keyCode === KEY_CODE.arrowDown || e.keyCode === KEY_CODE.arrowUp) && !this.isListHide)).subscribe((e) => {
      this.moveUpAndDown(e.keyCode);
    })
  }

  scrollToView(elem?: HTMLElement) {
    if (elem) {
      setTimeout(() => elem.scrollIntoView(), 0)
    } else {
      const selectedItem = this.listItems.find((item) => JSON.parse(item.nativeElement.getAttribute('data-dd-value'))['id'] === this.value);
      if (selectedItem) {
        setTimeout(() => selectedItem.nativeElement.scrollIntoView(), 0);
      }
    }
  }

  toggle() {
    this.isListHide = !this.isListHide;
    this.searchText = '';
    if (!this.isListHide) {
      setTimeout(() => this.filterInput.nativeElement.focus(), 0);
      this.listItems.forEach((item) => {
        if (JSON.parse(item.nativeElement.getAttribute('data-dd-value'))['id'] === this.value) {
          this.addHightLightClass(item.nativeElement);
          this.scrollToView(item.nativeElement);
        } else {
          this.removeHightLightClass(item.nativeElement);
        }
      })
    }
  }

  focus() {
    setTimeout(() => this.displayLabel.nativeElement.focus(), 0);
  }

  onItemSelect(item) {
    this.setItem(item);
    this.toggle();
    if (item !== undefined) {
      this.onChange(item.id);
    } else {
      this.onChange('');
    }
    this.focus();
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  findItem(value) {
    return this.items.find((item) => +item.id === +value);
  }

  writeValue(value) {
    const item = this.findItem(value)
    this.value = value;
    this.display = item ? item.display : '';
  }

  setItem(item) {
    if (item) {
      if (item.id) {
        this.value = item.id;
      }
      if (item.display) {
        this.display = item.display;
      }
    } else {
      this.value = '';
      this.display = this.placeholder;
    }
  }

  onKeyPress(e: KeyboardEvent) {
    if (e.keyCode === KEY_CODE.enter) {
      this.focus();
      return false;
    }
  }

  addHightLightClass(elem: HTMLElement) {
    elem.classList.add(CSS_CLASS_NAMES.highLight)
  }

  removeHightLightClass(elem: HTMLElement) {
    elem.classList.remove(CSS_CLASS_NAMES.highLight);
  }

  moveUpAndDown(key: number) {
    const selectedItem = this.listItems.find((li) => li.nativeElement.classList.contains(CSS_CLASS_NAMES.highLight));
    if (selectedItem) {
      let hightLightedItem: HTMLElement;
      if (key === KEY_CODE.arrowUp) {
        //check for first element
        if (selectedItem !== this.listItems.first) {
          hightLightedItem = selectedItem.nativeElement.previousSibling;
        }
      } else if (key === KEY_CODE.arrowDown) {
        //check for last element
        if (selectedItem !== this.listItems.last) {
          hightLightedItem = selectedItem.nativeElement.nextSibling;
        }
      }
      if (hightLightedItem) {
        this.clearHlightClass();
        this.removeHightLightClass(selectedItem.nativeElement);
        this.addHightLightClass(hightLightedItem);
        this.scrollToView(hightLightedItem);
      }
    } else {
      let highLightedItem: ElementRef;
      if (key === KEY_CODE.arrowUp) {
        highLightedItem = this.listItems.last;
      }
      else if (key === KEY_CODE.arrowDown) {
        highLightedItem = this.listItems.first;
      }
      if(highLightedItem){
        this.addHightLightClass(highLightedItem.nativeElement);
        this.scrollToView(highLightedItem.nativeElement);
      }
    }
  }

  isSelected(item: { id: number, display: string }) {
    return +item.id === +this.value;
  }

  stringify(item) {
    return JSON.stringify(item);
  }

  onHover(event: MouseEvent) {
    this.clearHlightClass();
    const target = event.target as HTMLElement;
    if (event.type === 'mouseover') {
      target.classList.add(CSS_CLASS_NAMES.highLight)
    } else {
      target.classList.remove(CSS_CLASS_NAMES.highLight);
    }
  }

  clearHlightClass() {
    this.listItems.forEach((item) => {
      this.removeHightLightClass(item.nativeElement);
    })
  }
}