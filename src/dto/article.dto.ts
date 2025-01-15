export class ArticleDTO {
    title: string;
    content: string;
  
    constructor(data: any) {
      this.title = data.title;
      this.content = data.content;
    }
  
    toModel() {
      return {
        title: this.title,
        content: this.content,
      };
    }
  }
  