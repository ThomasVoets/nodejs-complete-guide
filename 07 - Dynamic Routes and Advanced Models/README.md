# Module Summary

## Dynamic Routing

- You can pass dynamic path segments by adding a ":" to the Express router path
- The name you add after ":" is the name by which you can extract the data on req.params
- Optional (query) parameters can also be passed (?params=value&b=2) and extracted (req.params.myParam)

## More on Models

- A Cart model was added - it holds static methods only
- You can interact between models (e.g. delete cart item if a product is deleted)
- Working with files for data storage is suboptimal for bigger amounts of data

## Useful Resources & Links

- [Official Routing Docs](https://expressjs.com/en/guide/routing.html)
