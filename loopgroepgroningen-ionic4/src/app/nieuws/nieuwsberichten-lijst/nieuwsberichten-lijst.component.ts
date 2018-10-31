import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Nieuwsbericht} from '../../api';
import {CustomDatePipe} from '../../shared/shared/pipes/custom-date-pipe';

@Component({
  selector: 'lg-nieuwsberichten-lijst',
  templateUrl: './nieuwsberichten-lijst.component.html',
  styleUrls: ['./nieuwsberichten-lijst.component.scss']
})
export class NieuwsberichtenLijstComponent {

  @Input() nieuwsberichten: Nieuwsbericht[];
  @Output() itemClicked = new EventEmitter<Nieuwsbericht>();

  constructor(private datePipe: CustomDatePipe) {
  }

  getSectieTitel(nieuwsbericht: Nieuwsbericht) {
    return this.datePipe.transform(nieuwsbericht.datum, 'MMMM YYYY');
  }

  getId(nieuwsbericht: Nieuwsbericht) {
    return nieuwsbericht.id;
  }

  onItemClicked(nieuwsbericht: Nieuwsbericht) {
    this.itemClicked.emit(nieuwsbericht);
  }
}