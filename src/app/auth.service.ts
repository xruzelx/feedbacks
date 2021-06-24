import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of, Subject } from 'rxjs';

@Injectable()
export class AurhService{
     userState: any;
     subject = new Subject<any>();

    constructor(
        public afAuth: AngularFireAuth,
        public afs: AngularFirestore,
    ){}
    

    doRegister(value: { email: any; password: any; }){
        return new Promise<any>((resolve, reject) => {
          this.afAuth.createUserWithEmailAndPassword(value.email, value.password)
          .then(res => {
            resolve(res);
          }, err => reject(err))
        })
    }

    getStatus(): Observable<any> {
        return this.subject.asObservable();
    }

    doLogIn(value: { email: any; password: any; }) {
        return new Promise<any>((resolve, reject) => {
            this.afAuth.signInWithEmailAndPassword(value.email, value.password)
            .then(res => {
                localStorage.setItem('user', JSON.stringify(res.user));
                this.subject.next();
                resolve(res);
            }, err => reject(err))
          })
    }
    
    SetUserData(user: any) {
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
        const userState = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified
        }
        return userRef.set(userState, {
            merge: true
        })
    }

    doLogOut() {
        return this.afAuth.signOut().then(() => {
          localStorage.removeItem('user');
          this.subject.next();
        })
    }

    isAuthorized(): Observable<boolean> {
        const user = localStorage.getItem('user');
        if(user !== null){
            return of(true)
        } else {
            return of(false)
        }
        
    }
}