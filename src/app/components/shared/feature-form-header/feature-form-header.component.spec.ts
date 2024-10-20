import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureFormHeaderComponent } from './feature-form-header.component';

describe('FeatureFormHeaderComponent', () => {
  let component: FeatureFormHeaderComponent;
  let fixture: ComponentFixture<FeatureFormHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureFormHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeatureFormHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
