import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestOrderComponent } from './hematology.component';

describe('TestOrderComponent', () => {
  let component: TestOrderComponent;
  let fixture: ComponentFixture<TestOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestOrderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
