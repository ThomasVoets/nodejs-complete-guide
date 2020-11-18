import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const resHandler = (req, res, next) => {
  res.sendFile(path.join(__dirname, 'my-page.html'));
};

export default resHandler;
