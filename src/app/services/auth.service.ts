import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';
import firebase from 'firebase/compat/app';
import { AppUser } from '../models/appuser';
import { CommonService } from './common.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  appUser$: Observable<any>;

  constructor(
    public afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private router: Router,
    private db: AngularFirestore,
    private commonService: CommonService
  ) {
    this.appUser$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.db.doc<AppUser>(`appusers/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }
  private updateUserData(user: any) {
    const userRef = this.db.doc(`appusers/${user.uid}`);
    const data = {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };
    return userRef.set(data, { merge: true });
  }
  async login() {
    const returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl') || this.router.url;
    localStorage.setItem('returnUrl', returnUrl);
    const credential = await this.afAuth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    );
    this.commonService.isLoggedUser = true;
    return this.updateUserData(credential.user);
  }
  async logout() {
    await this.afAuth.signOut().then(() => {
      this.router.navigate(['/']);
    });
    this.commonService.isLoggedUser = false;
  }
}
