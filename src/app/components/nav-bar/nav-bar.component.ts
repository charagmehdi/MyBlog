import { BlogService } from './../../services/blog.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AppUser } from 'src/app/models/appuser';
import { CommonService } from 'src/app/services/common.service';
interface Bank {
  name: string;
}
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  appUser: AppUser;
  private _onDestroy = new Subject<void>();
  public bankCtrl: FormControl = new FormControl();
  private unsubscribe$ = new Subject<void>();
  public bankFilterCtrl: FormControl = new FormControl();

  /** list of banks */

  /** list of banks filtered by search keyword */
  // public filteredBanks: ReplaySubject<Bank[]> = new ReplaySubject<Bank[]>(1);
  blogPost: any = [];
  blogTitleList: any = [];
  titleValue: any;
  filteredBanks: any = [];
  finalList: any = [];
  constructor(
    private blogService: BlogService,
    private authService: AuthService,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    //this.bankCtrl.setValue(this.banks[10]);
    this.authService.appUser$.subscribe((appUser) => (this.appUser = appUser));
    this.blogService
      .getAllPosts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.blogPost = result;
        this.blogPost.forEach((el: any) => {
          this.filteredBanks.push({ name: el.title });
        });
      });
    this.filteredBanks.unshift({ name: 'All' });
    this.bankFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();
      });
  }
  private filterBanks() {
    if (!this.filteredBanks) {
      return;
    }
    // get the search keyword
    let search = this.bankFilterCtrl.value;
    if (!search) {
      // this.filteredBanks.next(this.filteredBanks.slice());
      return;
    } else {
      search = search?.data?.toLowerCase();
    }

    // filter the banks
    this.filteredBanks = this.filteredBanks.filter(
      (bank) => bank.name.toLowerCase().indexOf(search) > -1
    );
    console.log('asdsa', this.finalList);
  }
  login() {
    this.authService.login();
  }
  logout() {
    this.authService.logout();
  }
  getCard() {
    this.blogService.setTitle(this.titleValue);
  }
  onBlur(ev: any) {}
  onInputChange(ev: any) {}
  handleKeydown(ev: any) {}
}
