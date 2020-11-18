# Module Summary

## Introduction to Testing

- Testing can be done with the help of 2 packages: Mocha & Chai
- You write your own tests and expectations
- You can test async code & code that needs a database connection
- Override 3rd party methods with so called Stubs (or Mocks)

## What to Test

- Only test your own code
- Test only things you are responsible for.
- E.g.: Don't test if res.status(201) sets a status. But test if the status is 201!

## Useful Resources & Links

- [Mocha](https://mochajs.org/)
- [Chai](https://www.chaijs.com/)
- [Sinon](https://sinonjs.org/)
