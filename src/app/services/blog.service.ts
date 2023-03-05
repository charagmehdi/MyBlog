import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root',
})
export class BlogService {
  users: any = [];
  private metaTitle = new Subject<string>();
  constructor(private db: AngularFirestore, public dialog: MatDialog) {}
  createPost(post: Post) {
    const postData = JSON.parse(JSON.stringify(post));
    return this.db.collection('blogs').add(postData);
  }
  getAllPosts(): Observable<Post[]> {
    const blogs = this.db
      .collection<Post>('blogs', (ref) => ref.orderBy('createdDate', 'desc'))
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((c) => ({
            postId: c.payload.doc.id,
            title: c.payload.doc.data().title,
            author: c.payload.doc.data().author,
            content: c.payload.doc.data().content,
            createdDate: c.payload.doc.data().createdDate,
          }));
        })
      );

    return blogs;
  }
  getPostbyId(id: string): Observable<Post | undefined> {
    const blogDetails = this.db.doc<Post>('blogs/' + id).valueChanges();
    return blogDetails;
  }
  deletePost(postId: string) {
    return this.db.doc('blogs/' + postId).delete();
  }
  updatePost(postId: string, post: Post) {
    const putData = JSON.parse(JSON.stringify(post));
    return this.db.doc('blogs/' + postId).update(putData);
  }
  setTitle(data: any) {
    return this.metaTitle.next(data);
  }
  getTitle() {
    return this.metaTitle.asObservable();
  }
}
