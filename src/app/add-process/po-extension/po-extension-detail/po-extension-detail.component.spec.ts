import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoExtensionDetailComponent } from './po-extension-detail.component';

describe('PoExtensionDetailComponent', () => {
  let component: PoExtensionDetailComponent;
  let fixture: ComponentFixture<PoExtensionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoExtensionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoExtensionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
