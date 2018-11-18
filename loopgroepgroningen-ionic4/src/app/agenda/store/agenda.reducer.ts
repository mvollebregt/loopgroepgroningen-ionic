import {AgendaAction, AgendaActionType} from './agenda.action';
import {AgendaState, EvenementState} from './agenda.state';
import {AanroepStatus} from '../../shared/backend/aanroep-status';
import {Evenement} from '../../api';

const initialAgendaState: AgendaState = {
  laadstatus: AanroepStatus.succes,
  evenementStates: null,
};

const initialEvenementState: EvenementState = {
  laadstatus: AanroepStatus.succes,
  evenement: null,
  teVerzendenBericht: '',
  inschrijvingVerzendstatus: AanroepStatus.succes,
  berichtVerzendstatus: AanroepStatus.succes
};

export function agendaReducer(
  state = initialAgendaState,
  action: AgendaAction
): AgendaState {

  function metEvenementstate(id: string, evenementState: Partial<EvenementState>): Map<string, EvenementState> {
    const evenementen = new Map(state.evenementStates);
    const evenement = {...evenementen.get(id) || initialEvenementState, ...evenementState};
    return evenementen.set(id, evenement);
  }

  function voegSamenMetBestaande(evenement: Evenement): [string, EvenementState] {
    const bestaande = state.evenementStates && state.evenementStates.get(evenement.id);
    return [evenement.id, {
      ...initialEvenementState,
      evenement: {
        ...evenement,
        naam: evenement.naam.endsWith('...') && bestaande ? bestaande.evenement.naam : evenement.naam,
        details: bestaande ? bestaande.evenement.details : null
      }
    }];
  }

  switch (action.type) {

    case AgendaActionType.HerstelOpgeslagenState:
    case AgendaActionType.LaadEvenementen:
      return {
        ...state,
        laadstatus: AanroepStatus.bezig
      };

    case AgendaActionType.LaadEvenementdetails:
      return {
        ...state,
        evenementStates: metEvenementstate(action.id, {
          laadstatus: AanroepStatus.bezig
        })
      };


    case AgendaActionType.HerstelOpgeslagenStateSucces:
      return {...state, ...action.agendaState, laadstatus: AanroepStatus.succes};

    case AgendaActionType.LaadEvenementenSucces:
      return {
        ...state,
        laadstatus: AanroepStatus.succes,
        evenementStates: new Map(action.evenementen.map(voegSamenMetBestaande))
      };

    case AgendaActionType.LaadEvenementdetailsSucces:
      return {
        ...state,
        evenementStates: metEvenementstate(action.id, {
          laadstatus: AanroepStatus.succes,
          evenement: action.evenement
        })
      };

    case AgendaActionType.HerstelOpgeslagenStateFout:
    case AgendaActionType.LaadEvenementenFout:
      return {
        ...state,
        laadstatus: AanroepStatus.fout(action.fout)
      };


    case AgendaActionType.LaadEvenementdetailsFout:
      return {
        ...state,
        evenementStates: metEvenementstate(action.id, {
          laadstatus: AanroepStatus.fout(action.fout)
        })
      };
  }

  return state;
}
