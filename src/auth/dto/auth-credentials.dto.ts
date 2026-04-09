import {
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username!: string;

  @IsString()
  @MaxLength(32)
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message:
        'Password is too weak. It should contain at least 8 characters, including uppercase, lowercase, numbers, and symbols.',
    },
  )
  password!: string;
}
