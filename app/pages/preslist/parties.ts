import {NavController, NavParams, App, IonicApp, Page} from 'ionic-angular';
import {MenuController} from 'ionic-angular';
import {
    Control,
    ControlGroup,
    NgForm,
    Validators,
    NgControl,
    ControlValueAccessor,
    NgControlName,
    NgFormModel,
    FormBuilder
} from '@angular/common';
import {Vote} from '../../vote';

import {VoteService} from '../../vote-service';
import {PageManagerService} from '../../page-manager-service';
import {DataService} from '../../data-service';

@Page({
  templateUrl: 'build/pages/preslist/party.html'
})
export class PartyListPage {

    pageMgrSvc:PageManagerService;
    voteSvc:VoteService;
    dataSvc:DataService;
    partySym: string;
    whichState: string;
    party: string;
    candidates : Vote[] = [];
    cands: Control;
    president: ControlGroup;
    pres: number;

    constructor(private nav: NavController, navParams: NavParams,
                private menu: MenuController
               ) {
        this.pageMgrSvc = navParams.get('pageMgrSvc');
        this.voteSvc = navParams.get('voteSvc');
        this.dataSvc = navParams.get('dataSvc');
	this.whichState = navParams.get('whichState');
        this.partySym = navParams.get('party');
        this.party = this.pageMgrSvc.getPartyTitle(this.partySym);
        this.candidates = this.pageMgrSvc.getCandidates(this.partySym, this.whichState);
        this.cands = new Control("");
        this.president = new ControlGroup({
            "cands": this.cands
        });
        this.pres = -1;
    }

    onCandChange(inval:Vote) {
        this.pres = inval.val;
        this.voteSvc.choosePres(this.pres, inval.label);
    }

    onVote() {
        // console.log('Submitting form', this.pres);
        // event.preventDefault();
        if (this.pres < 0) {
            alert('No Candidate for President was Chosen!\n'
		 + 'Choose One or None of the Above Option');
        } else {
            var pg = this.pageMgrSvc.getSenatePage();
	    if (this.whichState == 'DC') {
		pg = this.pageMgrSvc.getInitPage();
		var vs = this.voteSvc;
		var presval;
		var ballot;
		if (vs.getPresName()) {
                    presval = vs.getPresName();
		} else {
                    presval = 'NOBODY'
		}
		if (vs.getParty() == 'prov') {
		    ballot = "\n\non a Provisional Ballot";
		} else {
		    ballot = "";
		}
		this.voteSvc.setVoted();
		var testString = '';
		if (this.dataSvc.isTestMode()) {
                    testString = "\n\nNOTE:: NO data sent.  In Test Mode!";
		}
		alert('You [' + vs.getKey() + '] voted for:\n' + presval + ' for President=' + 
                      vs.getPresPollId() + ballot + testString);
		/* Do something else */
		this.pageMgrSvc.setSignedInPages('signin',null);
		this.voteSvc.reInitialize();
		this.nav.setRoot(this.pageMgrSvc.getInitPage(),{
                    /* pageMgrSvc: this.pageMgrSvc,
                       voteSvc: vs, 
                       dataSvc: this.dataSvc,
                       party: vs.getRealParty() */
		    email: this.dataSvc.getEmail()
		});
	    } else if (pg) {
                /* this.nav.setRoot(pg, { */
                this.nav.push(pg, {
                    pageMgrSvc: this.pageMgrSvc,
                    voteSvc: this.voteSvc,
                    dataSvc: this.dataSvc
                });
            }
        }
    }
}
