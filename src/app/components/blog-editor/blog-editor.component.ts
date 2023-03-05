import { DatePipe } from '@angular/common';
import { Component, OnInit, Pipe } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { BlogService } from 'src/app/services/blog.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map, Subject, takeUntil } from 'rxjs';
//  import { DatePipe } from '@angular/common';
//  import { BlogService } from 'src/app/services/blog.service';
//  import { Router, ActivatedRoute } from '@angular/router';
// import { UntilDestroy, untilDestroyed } from '
@UntilDestroy()
@Component({
  selector: 'app-blog-editor',
  templateUrl: './blog-editor.component.html',
  styleUrls: ['./blog-editor.component.scss'],
  providers: [DatePipe],
})
export class BlogEditorComponent implements OnInit {
  public Editor = ClassicEditor;
  private unsubscribe$ = new Subject<void>();

  ckeConfig: any;
  postData = new Post();
  formTitle = 'Add';
  postId: any;

  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private blogService: BlogService,
    private router: Router
  ) {
    if (this.route.snapshot.params['id']) {
      this.postId = this.route.snapshot.paramMap.get('id');
    }
  }

  ngOnInit(): void {
    this.setEditorConfig();
    if (this.postId) {
      this.formTitle = 'Edit';
      this.blogService
        .getPostbyId(this.postId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((result) => {
          this.setPostFormData(result);
        });
    }
  }
  setPostFormData(ev: any) {
    this.postData.title = ev.title;
    this.postData.content = ev.content;
  }
  setEditorConfig() {
    this.ckeConfig = {
      // removePlugins: ['ImageUpload', 'MediaEmbed'],
      heading: {
        options: [
          {
            model: 'paragraph',
            title: 'Paragraph',
            class: 'ck-heading_paragraph',
          },
          {
            model: 'heading1',
            view: 'h1',
            title: 'Heading 1',
            class: 'ck-heading_heading1',
          },
          {
            model: 'heading2',
            view: 'h2',
            title: 'Heading 2',
            class: 'ck-heading_heading2',
          },
          {
            model: 'heading3',
            view: 'h3',
            title: 'Heading 3',
            class: 'ck-heading_heading3',
          },
          {
            model: 'heading4',
            view: 'h4',
            title: 'Heading 4',
            class: 'ck-heading_heading4',
          },
          {
            model: 'heading5',
            view: 'h5',
            title: 'Heading 5',
            class: 'ck-heading_heading5',
          },
          {
            model: 'heading6',
            view: 'h6',
            title: 'Heading 6',
            class: 'ck-heading_heading6',
          },
          { model: 'Formatted', view: 'pre', title: 'Formatted' },
        ],
      },
    };
  }
  saveBlogPost() {
    if (this.postId) {
      this.blogService.updatePost(this.postId, this.postData).then(() => {
        this.router.navigate(['/']);
      });
    } else {
      this.postData.createdDate = this.datePipe.transform(
        Date.now(),
        'MM-dd-yyyy HH:mm'
      );
      this.blogService.createPost(this.postData).then(() => {
        this.router.navigate(['/']);
      });
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
