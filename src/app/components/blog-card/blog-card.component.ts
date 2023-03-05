import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { BlogService } from 'src/app/services/blog.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { MatdialogComponent } from '../matdialog/matdialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { AppUser } from 'src/app/models/appuser';
@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.scss'],
})
export class BlogCardComponent implements OnInit, OnDestroy {
  //blogPost: Post[] = [];
  appUser: AppUser;
  blogPost: any = [];
  private unsubscribe$ = new Subject<void>();
  blogTitleList: any = [];
  titleData: any;
  constructor(
    private blogService: BlogService,
    private snackBarService: SnackbarService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.authService.appUser$.subscribe((appUser) => (this.appUser = appUser));
  }

  ngOnInit(): void {
    this.getBlogPosts();
    this.blogService
      .getTitle()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.titleData = result;
        if (this.titleData != 'All') {
          this.blogPost = this.blogPost.filter(
            (item: any) => item.title === this.titleData
          );
        } else {
          this.getBlogPosts();
        }
        //console.log('blogPost', this.blogPost);
      });
  }
  getBlogPosts() {
    this.blogService
      .getAllPosts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.blogPost = result;
        result[0].content;
        document.querySelectorAll(result[0].content);
        this.blogPost.forEach((el: any) => {
          this.blogTitleList.push({ name: el.title });
        });
      });
  }
  delete(postId: string) {
    const dialogRef = this.dialog.open(MatdialogComponent, {
      data: {
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: 'Save',
          cancel: 'No',
        },
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.blogService.deletePost(postId).then(() => {
          this.snackBarService.showSnackBar('Blog post deleted successfully');
        });
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
