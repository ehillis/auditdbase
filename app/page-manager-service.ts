import {Injectable, bind} from '@angular/core';
import {MenuController} from 'ionic-angular';
import {Http} from '@angular/http';

import { Vote } from './vote';
import {PARTIES} from './parties';
import {PartyListPage} from './pages/preslist/parties';
import {SenatorsListPage} from './pages/senatelist/senlist';
import {SignInPage} from './pages/signin/signin';
import {LogInPage} from './pages/signin/login';
class PageRef {
    title: string;
    component: any;
}

@Injectable()
export class PageManagerService {

    signedInPages: Array<PageRef>;
    initPage: PageRef;
    curPage: PageRef;
    senatorPage: PageRef;
    http: Http;
    menu: MenuController;
    menus: Array<{title: string, mid: string, candidates: Vote[],
                  pages:Array<PageRef> }>;

    constructor(http: Http) {
        // console.log('begin of pagemgr');
        this.http = http;
        this.signedInPages = null;
        this.senatorPage = null;
        this.initPage = { title: 'Login', component: LogInPage };
        this.curPage = this.initPage;
        this.menu = null;
        this.menus = null;
        // console.log('end of pagemgr');
    }
    
    public getInitPage() {
        return this.initPage.component;
    }

    public getCurPage() { 
        return this.curPage;
    }

    public getDefaultPage() {
        if (this.curPage) {
            return this.curPage.component;
        } else {
            alert('no curpage');
        }
    }

    public getSenatePage() {
        return this.senatorPage.component;
    }

    // Called in app.ts when created..
    public setMenu(menuval) {
        this.menu = menuval;
    }

    public getCandidates(mid, whichState) {
        var ii: number;
        var retval = null;
        if (whichState == 'DC') {
            mid = mid + '-dc';
        }
        for (ii=0;ii<this.menus.length;ii++) {
            if (this.menus[ii].mid == mid) {
                retval = this.menus[ii].candidates;
                break;
            }
        }
        return retval;
    }

    public getPartyTitle(mid) {
        var ii: number;
        var retval = null;
        for (ii=0;ii<this.menus.length;ii++) {
            if (this.menus[ii].mid == mid) {
                retval = this.menus[ii].title;
                break;
            }
        }
        return retval;
    }

    public chooseMenu(mid) {
        this.signedInPages = null;
        var ii: number;
        for (ii=0;ii<this.menus.length;ii++) {
            if (this.menus[ii].mid == mid) {
                this.signedInPages = this.menus[ii].pages;
                break;
            }
        }
        if (!this.signedInPages) {
            this.signedInPages = [this.senatorPage];
        }
        this.curPage = this.signedInPages[0];
        // this.menu.enable(mid);
    }
    public setSignedInPages(party, nppparty) {
        if (this.menu == null) {
            alert('no menu defined!');
            return;
        }
        if (party == 'npp') {
            if (nppparty == null) {
                alert('No Party Affiliation Chosen not Voting as any other Party\n'
                      + 'You will be forwarded directly to the Senator page.\n'
                      + 'If this was not desired go back and select Vote As');
                party = null;
            } else {
                party = nppparty;
            }
        }
        this.chooseMenu(party);
    }
    public getSignInPages() {
        return this.signedInPages;
    }
    public setupMenus() {
        // console.log('begin of setupms');
        this.senatorPage =
            { title: 'Senator Candidates',
              component: SenatorsListPage };
        this.menus = [
            { title: 'Sign-In Menu', mid: 'signin', candidates: null,
              pages: [this.initPage, 
                      { title: 'Sign-In', component: SignInPage}]
            }
        ];
        var ii: number;
        for (ii=0;ii<PARTIES.length;ii++) {
            var newelem = { title: PARTIES[ii]["title"],
                            mid: PARTIES[ii]["mid"],
                            candidates: PARTIES[ii]["candidates"],
                            pages: [
                                { title: PARTIES[ii]["title"] + ' Candidates',
                                  component: PartyListPage },
                                this.senatorPage
                            ]
                          };
            this.menus.push(newelem);
        }
        // console.log('end of setupms');
        return this.menus;
    }
}
