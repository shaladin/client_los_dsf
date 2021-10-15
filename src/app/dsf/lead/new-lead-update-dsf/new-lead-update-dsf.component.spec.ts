import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLeadUpdateDsfComponent } from './new-lead-update-dsf.component';

describe('NewLeadUpdateDsfComponent', () => {
  let component: NewLeadUpdateDsfComponent;
  let fixture: ComponentFixture<NewLeadUpdateDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewLeadUpdateDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLeadUpdateDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
