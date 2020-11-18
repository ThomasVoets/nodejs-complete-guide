import fs from 'fs/promises';

const resHandler = async (req, res, next) => {
  try {
    const data = await fs.readFile('my-page.html', 'utf8');
    res.send(data);
  } catch (err) {
    console.log(err);
  }
};

export default resHandler;
