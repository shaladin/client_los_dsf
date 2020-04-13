import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreGoLivePagingComponent } from './pre-go-live-paging.component';

describe('PreGoLivePagingComponent', () => {
  let component: PreGoLivePagingComponent;
  let fixture: ComponentFixture<PreGoLivePagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreGoLivePagingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreGoLivePagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
