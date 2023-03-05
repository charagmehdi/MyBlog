export class Post {
  postId: string;
  title: string;
  content: string;
  author: string;
  createdDate: any;
  constructor() {
    this.content = '';
    this.postId = '';
    this.title = '';
    this.author = '';
  }
}
