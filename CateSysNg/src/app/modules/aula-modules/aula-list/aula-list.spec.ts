import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AulaList } from './aula-list';

describe('Aluno', () => {
  let component: AulaList;
  let fixture: ComponentFixture<AulaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AulaList],
    }).compileComponents();

    fixture = TestBed.createComponent(AulaList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
