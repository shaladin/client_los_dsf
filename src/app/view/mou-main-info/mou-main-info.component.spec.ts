import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouMainInfoComponent } from './mou-main-info.component';

describe('MouMainInfoComponent', () => {
  let component: MouMainInfoComponent;
  let fixture: ComponentFixture<MouMainInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouMainInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouMainInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
