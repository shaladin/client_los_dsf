import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MouExecutionDetailXDsfComponent } from './mou-execution-detail-x-dsf.component';

describe('MouExecutionDetailXDsfComponent', () => {
  let component: MouExecutionDetailXDsfComponent;
  let fixture: ComponentFixture<MouExecutionDetailXDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MouExecutionDetailXDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MouExecutionDetailXDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
