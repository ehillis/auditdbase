import {Page, Modal, NavController, MenuController, NavParams} from 'ionic-angular';
import {PageManagerService} from '../../page-manager-service';
import {DataService} from '../../data-service.ts';
import {VoteService} from '../../vote-service';
import {SignInPage} from './signin';
import {Toast} from 'ionic-native';

@Page({
    templateUrl: 'build/pages/signin/login.html',
})
export class LogInPage {
    error: any;
    showpwchecked: boolean = false;
    pageMgrSvc:PageManagerService;
    voteSvc:VoteService;
    dataSvc:DataService;
    email: string;
    password: string;
    pin: string;
    // firebase: any;
    showpw: boolean;

    constructor(private nav: NavController, navParams: NavParams, 
                private menu: MenuController,
                pageMgrSvc:PageManagerService, voteSvc:VoteService, dataSvc: DataService ) {
        // If we navigated to this page, we will have an item available as a nav param
        // this.party = null;
        // this.firebase = null; // navParams.get('firebase');
        // console.log('beginning cons');
        this.nav = nav;
        this.menu = menu;
        this.pageMgrSvc = pageMgrSvc; // navParams.get('pageMgrSvc');
        this.voteSvc = voteSvc; // navParams.get('voteSvc');
        this.dataSvc = dataSvc; // navParams.get('dataSvc');
        if (this.dataSvc) {
            this.dataSvc.setupFirebase();
        }
        if (this.pageMgrSvc) {
            this.pageMgrSvc.setMenu(menu);
        }
        var oldEmail = navParams.get('email');
        if (oldEmail) {
            this.email = oldEmail;
            this.showpw = false;
        } else {
            this.email = null;
            this.showpw = true;
        }
        /* 
        if (this.dataSvc.isAuthenticated()) {
            this.email = this.dataSvc.getEmail()
        }
        */
        this.password = null;
        this.pin = null;
        // console.log('ending cons');
    }

    onChangeEmail(value) {
        // console.log('email setting to:' + value);
        
        if (this.dataSvc.setEmail(value)) {
            this.email = value;
        }
    }

    onChangePassword(value) {
        // console.log('password setting to' + value);
        this.password = value;
        this.dataSvc.setPassword(value);
    }

    onChangePin(value) {
        // console.log('pin setting to' + value);
        this.pin = value;
        this.dataSvc.setPin(value);
    }

    onChange() {
        this.showpwchecked = !this.showpwchecked;
    }

    /*
    onLogin() {
        if (this.dataSvc.signInValuesNotFilled()) {
            alert('email or password is null!');
        } else {
            if (!this.dataSvc.login()) {
                alert('login failure!');
            } else {
                // alert('about to open page' + this.pageMgrSvc.getDefaultPage());
                this.nav.setRoot(SignInPage, {
                    // this.nav.setRoot(this.pageMgrSvc.getInitPage(), { 
                    // this.nav.push(this.pageMgrSvc.getInitPage(),{ 
                    pageMgrSvc: this.pageMgrSvc,
                    voteSvc: this.voteSvc,
                    dataSvc: this.dataSvc
                });
            }
        }
    }
    */

    onSubmit(credentials) {
        var that = this;
        try {
            // login usig the email/password auth provider
            that.dataSvc.login(credentials).subscribe(
                (data: any) => {
                    console.log('data for login = '+ data.toString());
                    that.nav.setRoot(SignInPage, {
                        // that.nav.setRoot(that.pageMgrSvc.getInitPage(), { 
                        // that.nav.push(that.pageMgrSvc.getInitPage(),{ 
                        pageMgrSvc: that.pageMgrSvc,
                        voteSvc: that.voteSvc,
                        dataSvc: that.dataSvc
                    });
                },
                (error) => {
                    console.log('error onSubmit ' + error.toString());
                    let msg = "Error Logging In: " + error.toString();
                    Toast.show(msg, "3000", "center");
                    if ((!that.error) ||
                        (that.error !== that.dataSvc.getNotAuthenticatedMsg())) {
                        that.error = error.toString();
                    } else {
                        /* If we already got this error once, then we just allow
                           to go into a test mode... */
                        that.error = null;
                        that.dataSvc.setTestMode(true);
                        that.nav.setRoot(SignInPage, {
                            // that.nav.setRoot(that.pageMgrSvc.getInitPage(), { 
                            // that.nav.push(that.pageMgrSvc.getInitPage(),{ 
                            pageMgrSvc: that.pageMgrSvc,
                            voteSvc: that.voteSvc,
                            dataSvc: that.dataSvc
                        });
                    }
                }
            );
        } catch (EE) {
            console.log('error in Submitting, exc='+ EE.toString())
        }
    }
}
