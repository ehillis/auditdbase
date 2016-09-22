import {Page, NavController, MenuController, NavParams} from 'ionic-angular';
import {PageManagerService} from '../../page-manager-service';
import {DataService} from '../../data-service';
import {VoteService} from '../../vote-service';
import {BarcodeScanner} from 'ionic-native';

@Page({
    templateUrl: 'build/pages/signin/signin.html',
    // providers: [VoteService]
})
export class SignInPage {
    nppSelected: number = 0;
    whichState: string = 'CA';
    pageMgrSvc:PageManagerService;
    voteSvc:VoteService;
    dataSvc:DataService;
    party: string;
    nppparty: string;
    cryptokey: string;

    constructor(private nav: NavController, navParams: NavParams, 
                private menu: MenuController /*,
                pageMgrSvc:PageManagerService, voteSvc:VoteService */) {
        // If we navigated to this page, we will have an item available as a nav param
        this.nav = nav;
        this.menu = menu;
        this.pageMgrSvc = navParams.get('pageMgrSvc');
        this.voteSvc = navParams.get('voteSvc');
        this.dataSvc = navParams.get('dataSvc');
        this.pageMgrSvc.setMenu(menu);
        this.onKeyChange(this.voteSvc.getKey());
        if (this.whichState == 'DC') {
            this.onChange("democrat");
        }
    }

    onChange(value) {
        this.party = value;
        this.voteSvc.setParty(value);
        if (value == 'npp') {
            this.nppSelected = 1;
        } else if (value == 'prov') {
            this.nppSelected = 2;
        } else {
            this.nppSelected = 0;
        }
    }

    onNppChange(value) {
        this.nppparty = value;
        this.voteSvc.setNppParty(value);
    }

    onKeyChange(value) {
        console.log('calling onKeyChange..' + value);
        if (this.voteSvc.setKey(value)) {
            console.log('since thinks valid.. continue update from:' + this.cryptokey);
            this.cryptokey = value;
            console.log('value updated to ' + value);
        } else {
            console.log('since thinks invalid.. update as null');
            this.voteSvc.setKey(null);
            this.cryptokey = null;
        }
    }

    onSignIn() {
        if (this.whichState == 'DC') {
            if (this.nppSelected == 2) {
                this.onNppChange('democrat');
            }
        }
        if (this.voteSvc.signInValuesNotFilled()) {
            alert('Not all Sign-In values are set!');
        } else {
            var vs = this.voteSvc;
            this.pageMgrSvc.setSignedInPages(vs.getParty(), vs.getNppParty());
            this.voteSvc.setSignedIn(true);
            this.voteSvc.setPartyVals(vs.getParty(), vs.getNppParty());
            // alert('about to open page' + this.pageMgrSvc.getDefaultPage());
            this.nav.push(this.pageMgrSvc.getDefaultPage(), {
            /* this.nav.setRoot(this.pageMgrSvc.getDefaultPage(),{ */
                pageMgrSvc: this.pageMgrSvc,
                voteSvc: this.voteSvc, 
                dataSvc: this.dataSvc, 
                whichState: this.whichState,
                party: vs.getRealParty()
            });
        }
    }
    onSubmit() {
        // ignore this...  seems to cause trouble.
    }
    scanBarcode() {
        BarcodeScanner.scan().then((barcodeData) => {
            if (this.voteSvc.setKey(barcodeData.text)) {
                this.cryptokey = barcodeData.text;
            }
        }, (err) => {
            alert('Error during scan of key code:' + err);
        });
    }
}
