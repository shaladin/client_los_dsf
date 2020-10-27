import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankSectionComponent } from './bank-section.component';

describe('BankSectionComponent', () => {
  let component: BankSectionComponent;
  let fixture: ComponentFixture<BankSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
