'use server';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from '@/lib/constants';
import db from '@/lib/db';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import getSession from '@/lib/session';

const checkUsername = (username: string) => {
  return username.includes('potato') ? false : true;
};

const checkPassword = ({
  password,
  comfirmPassword,
}: {
  password: string;
  comfirmPassword: string;
}) => password === comfirmPassword;

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: 'Username must be a string! ',
        required_error: 'Where is my username?',
      })
      .trim()
      .toLowerCase()

      .refine((username) => checkUsername(username), 'No potato allowed'),
    avatar: z.string(),
    email: z
      .string({
        invalid_type_error: 'Email must be a string!',
        required_error: 'Where is my email',
      })
      .email()
      .toLowerCase(),
    password: z.string().min(PASSWORD_MIN_LENGTH, 'Way too short!'),
    // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    comfirmPassword: z.string().min(PASSWORD_MIN_LENGTH, 'Way too short!'),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: 'custom',
        message: 'This username is already taken',
        path: ['username'],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: 'custom',
        message: 'This email is already taken',
        path: ['email'],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .refine(checkPassword, {
    message: 'Both passwords should be the same!',
    path: ['comfirmPassword'],
  });

export async function createAccountAction(prevState: any, formData: FormData) {
  const data = {
    avatar: formData.get('avatar'),
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    comfirmPassword: formData.get('comfirmPassword'),
  };

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const hashedPassword = await bcrypt.hash(result.data.password, 12);

    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
        avatar: result.data.avatar,
      },
      select: {
        id: true,
      },
    });

    const session = await getSession();
    session.id = user.id;
    await session.save();

    // 리디렉션
    redirect('/profile');
  }
}
