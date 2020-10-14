const ENV = process.env.NODE_ENV;
const dirname = ENV !== 'production' && ENV !== 'staging' ? 'development' : ENV;
import { CustomError } from '../src/shared/helpers/helpers';

let server;
try {
  server = require(`./${dirname}/server.json`);
} catch (e) {
  throw new CustomError({ message: `Не найден конфигурационный файл (/config/${dirname}/server.json). Ознакомтесь с инструкцией /config/__example__/readme.txt` });
}

export default { server };
