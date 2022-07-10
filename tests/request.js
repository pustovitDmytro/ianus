import request from 'supertest';
import { load } from './utils';

const app = load('web').default;

export default request(app);
