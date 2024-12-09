import { User } from '../entities/user.entity';
import { dataSource } from '../globals/data-source';

export const userRepository = dataSource.getRepository(User).extend({});
