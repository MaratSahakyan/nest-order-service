import { compare, hash } from 'bcrypt';
import { constant } from './constant';

const hashData = async (string: string) =>
  hash(string, constant.HASH_SALT_COUNT);

const compareData = async (string: string, hashedString: string) =>
  compare(string, hashedString);

export { hashData, compareData };
