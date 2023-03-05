import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgMaterialModule } from './ng-material/ng-material.module';
import { HomeComponent } from './components/home/home.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { BlogEditorComponent } from './components/blog-editor/blog-editor.component';
import { ExcerptPipe } from './customPipes/excerpt.pipe';
import { SlugPipe } from './customPipes/slug.pipe';
import { BlogCardComponent } from './components/blog-card/blog-card.component';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { BlogComponent } from './components/blog/blog.component';
import { MatdialogComponent } from './components/matdialog/matdialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegistrationPageComponent } from './components/registration-page/registration-page.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { MatSelectSearchComponent } from './components/mat-select-search/mat-select-search.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent,
    BlogEditorComponent,
    ExcerptPipe,
    SlugPipe,
    BlogCardComponent,
    BlogComponent,
    MatdialogComponent,
    LoginPageComponent,
    RegistrationPageComponent,
    MatSelectSearchComponent,
  ],
  imports: [
    ReactiveFormsModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgMaterialModule,
    CKEditorModule,
    FormsModule,
    MatFormFieldModule,
    RouterModule.forRoot(
      [
        { path: '', component: HomeComponent, pathMatch: 'full' },
        { path: 'page/:pagenum', component: HomeComponent },
        {
          path: 'addpost',
          component: BlogEditorComponent,
        },
        { path: 'blog/:id/:slug', component: BlogComponent },
        { path: 'editpost/:id', component: BlogEditorComponent },
        { path: 'login', component: LoginPageComponent },

        { path: '**', component: HomeComponent },
      ],
      { relativeLinkResolution: 'legacy' }
    ),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
