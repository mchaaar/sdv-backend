import { IUserPresenter } from '../types/presenter';
import { IUser } from '../types/user';

export class UserPresenter {
  static present(user: IUser): IUserPresenter {
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };
  }
}
