import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreGoLivePagingDsfComponent } from './pre-go-live-paging-dsf.component';

describe('PreGoLivePagingDsfComponent', () => {
  let component: PreGoLivePagingDsfComponent;
  let fixture: ComponentFixture<PreGoLivePagingDsfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreGoLivePagingDsfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreGoLivePagingDsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
