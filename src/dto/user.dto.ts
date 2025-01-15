export class UserDTO {
    email: string;
    password: string;
    name: string;
  
    constructor(data: any) {
      this.email = data.email;
      this.password = data.password;
      this.name = data.name;
    }
  
    toModel() {
      return {
        email: this.email,
        password: this.password,
        name: this.name,
      };
    }
  }
  