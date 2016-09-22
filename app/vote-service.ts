import {Injectable, bind} from '@angular/core';
import {Http} from '@angular/http';
import {PARTIES} from './parties';
import {DataService} from './data-service.ts';

@Injectable()
export class VoteService {

    key : string;
    nppparty: string;
    party : string;
    realparty : string;
    nppSelected : number;
    signedIn: boolean;
    http:  Http;
    pres: number;
    senator: number;
    presName: string;
    senName: string;
    partySizes: Array<number>;
    partyOffset: Array<number>;
    dataSvc: DataService;
    cont: boolean;
    voted: boolean;
    lastKey: string;

    constructor(http: Http) {
        // console.log('begin of voteSvc');
        // this.http = http;
        this.dataSvc = null; // dataSvc;
        this.voted = false;
        this.lastKey = null;
        this.reInitialize();
        this.partyOffset = [0];
        this.partySizes = [0];
        var tot = 0;
        var ii:number;
        // tot += PARTIES[ii]["candidates"].length-1;
        // Initialize Arrays..
        for (ii=0;ii<PARTIES.length;ii++) {
            this.partyOffset.push(0);
            this.partySizes.push(0);
        }
        for (ii=0;ii<PARTIES.length;ii++) {
            var firstval = 
                PARTIES[ii]["candidates"][0]["val"];
            if (firstval != 0) {
                var rem = firstval % 100;
                var pos = (firstval-rem)/100;
                this.partySizes[pos] = PARTIES[ii]["candidates"].length-1;
            }
        }
        for (ii=1;ii<PARTIES.length+1;ii++) {
            this.partyOffset[ii-1] = tot;
            // increase by the previous party size
            tot += this.partySizes[ii-1];
        }
        // console.log('end of voteSvc');
    }

    public reInitialize() {
        this.nppparty = null;
        this.nppSelected = 0;
        this.party = null;
        this.realparty = null;
        this.key = null;
        this.signedIn = false;
        this.pres = -1;
        this.senator = -1;
        this.key = this.getNewKey();
    }

    public getKey() {
        if (this.key == null) {
            // possible lazy evaluation of this...
            this.key = this.getNewKey();
        }
        return this.key;
    }

    setDataService(dataSvc) {
        this.dataSvc = dataSvc;
    }

    checkKeyVoted(keyval) {
        var that = this;
        if (this.dataSvc == null) {
            return null;
        }
        var keyRef =  that.dataSvc.getBaseRef().child(keyval);
        /*
        var isComplete = false;
        keyRef.once("value", function(snapshot) {
            var currentData = snapshot.val();
            console.log(currentData);
            if ((currentData === null) || (!currentData.voted)) {
                if (doset) {
                    that.voted = false;
                    keyRef.set({ keyused: true, voted: false, pres: 0, sen: 0, 
                                 devuser: that.dataSvc.getEmail(), ts: new Date().getTime() });
                }
                return false;
            } else {
                // found and has voted..
                return true;
            }
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
            return false;
        });
        */
        keyRef.transaction(function(currentData) {
            if ((currentData === null) || (!currentData.voted)) {
                that.voted = false;
                return { keyused: true, voted: false, pres: 0, sen: 0, 
                         devuser: that.dataSvc.getEmail(), 
                         ts: new Date().getTime(), party: "none", npp: "none" };
            } else {
                that.cont = true;
                console.log('vote key:' + keyval + ' already exists, and voted');
                // try again for another random number..
                return;
            }
        }, function(error, committed, snapshot) {
            if (error) {
                console.log('Transaction failed abnormally!', error.toString());
                that.cont = false;
            } else if (!committed) {
                that.cont = true;
                console.log('We aborted the transaction (because key already exists).');
            } else {
                console.log('User key added!');
            }
            if (snapshot) {
                console.log("Key's data: ", snapshot.val());
            }
        });
        /*
        if (!isComplete) {
            //code before the pause
            setTimeout(function(){
                //do what you need here
            }, 200);
        }
        */
        return null;
    }

    getNewRandomKey() {
        var hexval = "0123456789ABCDEF";
        var pattern = "xxxx-xxxx-xxxx-xxxx";
        var retval = '';
        var ii:number;
        for (ii=0;ii<pattern.length;ii++) {
            if (pattern[ii] == 'x') {
                var thispos = Math.floor(Math.random() * 16);
                retval = retval + hexval[thispos];
            } else {
                retval = retval + pattern[ii];
            }
        }
        return retval;
    }

    getNewKey() {
        var that = this;
        if ((!this.voted) && (this.lastKey)) {
            return this.lastKey;
        }
        // Try to create a key for new instance, but only if key isn't already taken
        if ((that.dataSvc == null) ||
            (((that.dataSvc.getBaseRef() == null) ||
              (!that.dataSvc.isAuthenticated())) &&
             (!that.dataSvc.isTestMode()))) {
            // not defined yet
            console.log('database ref not yet defined.. will wait...');
            /* 
            //code before the pause
            setTimeout(function(){
                console.log('waiting for 2 seconds in getNewKey()...');
                //do what you need here
            }, 2000);       
            */
            return null;
        }
        that.cont = true;
        var randomKey = null;
        while (that.cont) {
            // console.log('in loop...');
            randomKey = that.getNewRandomKey();
            that.cont = false;
            if (!that.dataSvc.isTestMode()) {
                var retval = this.checkKeyVoted(randomKey);
                if (!retval) {
                    that.cont = false;
                } else {
                    that.cont = true;
                }
            }
        }
        // At this point we should have found an unused value...
        console.log('exiting with generated key='+ randomKey);
        return randomKey;
    }

    public isValidKey(inval:string) {
        // allow null key for initialization
        // console.log('in isvalid..');
        var savevoted = this.voted;
        this.cont = false;
        var retval = this.checkKeyVoted(inval);
        this.voted = savevoted;
        if (this.cont) {
            return false;
        } else {
            return true;
        }
    }
    
    public setKey(inval:string) {
        if (this.isValidKey(inval)) {
            this.voted = false;
            this.key = inval;
            return true;
        } else {
            alert('Error:Key already completed voting[' + inval + '],\nTry again.');
            return false;
        }
    }

    public setVoted() {
	var that = this;
        if (this.dataSvc == null) {
            return null;
        }
        // Try to create a key for new instance, but only if key isn't already taken
        if ((this.dataSvc.getBaseRef() == null) || (this.key == null)) {
            // not defined yet
            if (!this.dataSvc.isTestMode()) {
                alert('database ref or key not yet defined.. error?...');
            } else {
                this.voted = true;
            }
            return null;
        }

        var onComplete = function(error) {
            if (error) {
                alert('Vote failed to send to DB:' + error.toString());
                that.voted = false;
            } else {
                console.log('Synchronization of Vote succeeded');
            }
        };
        var keyRef =  this.dataSvc.getBaseRef().child(this.key);

        keyRef.set({ keyused: true, voted: true, pres: this.pres, sen: this.senator,
                     devuser: this.dataSvc.getEmail(), ts: new Date().getTime(),
                     party: this.getParty(), npp: this.getNppParty()}, onComplete);
        this.voted = true;
    }

    public getNppParty() {
        return this.nppparty;
    }
    public setNppParty(inval:string) {
        this.nppparty = inval;
    }
    public getParty() {
        return this.party;
    }
    public setParty(inval:string) {
        this.party = inval;
    }
    public getNppSelected() {
        return this.nppSelected;
    }
    public setNppSelected(inval:number) {
        this.nppSelected = inval;
    }
    public isSignedIn() {
        return this.signedIn;
    }
    public setSignedIn(inval: boolean) {
        this.signedIn = inval;
    }

    public signInValuesNotFilled() {
        return ((this.key == null) || 
                (this.party == null));
    }

    public choosePres(inval:number, name:string) {
        this.pres = inval;
        this.presName = name;
    }

    public chooseSen(inval:number, name:string) {
        this.senator = inval;
        this.senName = name;
    }

    public getPres() {
        return this.pres;
    }
    public getPresName() {
        return this.presName;
    }
    public getPresPollId() {
        var presNum = this.pres;
        if (presNum < 0) {
            return 0;
        } else {
            var rem = presNum % 100;
            var offset = (presNum-rem) / 100;
            return this.partyOffset[offset] + rem;
        }
    }

    public getSenator() {
        return this.senator;
    }
    public getSenName() {
        return this.senName;
    }

    public setPartyVals(party, nppparty) {
        this.party = party;
        this.nppparty = nppparty;
        if ((party == 'npp') || (party == 'prov')) {
            this.realparty = nppparty;
        } else {
            this.realparty = party;
        }
    }

    public getRealParty() {
        return this.realparty;
    }
}
