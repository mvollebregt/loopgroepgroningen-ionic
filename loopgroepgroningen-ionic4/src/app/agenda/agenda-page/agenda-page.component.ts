import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Evenement} from '../../api';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {AgendaState, getAgendaEvenementen} from '../store/agenda.state';
import {LaadAgendaEvenementdetails, LaadAgendaEvenementen} from '../store/agenda.action';

@Component({
  selector: 'lg-agenda-page',
  templateUrl: 'agenda-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgendaPageComponent implements OnInit {

  evenementen: Observable<Evenement[]>;

  // spinning = true;

  constructor(private router: Router, private agendaStore: Store<AgendaState>) {
  }

  ngOnInit() {
    this.evenementen = this.agendaStore.pipe(select(getAgendaEvenementen));
    this.agendaStore.dispatch(new LaadAgendaEvenementen());
  }


  onItemClicked(evenement: Evenement) {
    this.agendaStore.dispatch(new LaadAgendaEvenementdetails(evenement.id));
    this.router.navigate(['agenda', evenement.id]);
  }

}
