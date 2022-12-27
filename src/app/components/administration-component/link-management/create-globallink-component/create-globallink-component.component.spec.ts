import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGloballinkComponentComponent } from './create-globallink-component.component';

describe('CreateGloballinkComponentComponent', () => {
  let component: CreateGloballinkComponentComponent;
  let fixture: ComponentFixture<CreateGloballinkComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateGloballinkComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGloballinkComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
