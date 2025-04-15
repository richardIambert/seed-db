import { config } from 'dotenv';

export const setEnvironment = () => {
  const path = `${process.cwd()}/.env.${process.env.NODE_ENV || 'development'}`;
  config({ path });
};

export const convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};
