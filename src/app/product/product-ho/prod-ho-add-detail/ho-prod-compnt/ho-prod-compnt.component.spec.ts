import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoProdCompntComponent } from './ho-prod-compnt.component';

describe('HoProdCompntComponent', () => {
  let component: HoProdCompntComponent;
  let fixture: ComponentFixture<HoProdCompntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoProdCompntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoProdCompntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
