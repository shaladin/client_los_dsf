import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NapDetailPagingDsfComponent } from './nap-detail-paging-dsf.component';

describe('NapDetailPagingDsfComponent', () => {
  let component: NapDetailPagingDsfComponent;
  let fixture: ComponentFixture<NapDetailPagingDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NapDetailPagingDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NapDetailPagingDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
