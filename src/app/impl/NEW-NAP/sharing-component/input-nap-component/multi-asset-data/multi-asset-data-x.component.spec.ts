import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiAssetDataXComponent } from './multi-asset-data-x.component';

describe('MultiAssetDataXComponent', () => {
  let component: MultiAssetDataXComponent;
  let fixture: ComponentFixture<MultiAssetDataXComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiAssetDataXComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiAssetDataXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
