import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser({ username, password }: AuthCredentialsDto): Promise<void> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = this.create({ username, password: hashedPassword });

    try {
      await this.save(newUser);
    } catch (error) {
      if ((error as { code: string }).code === '23505') {
        // Unique violation error code for PostgreSQL
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
