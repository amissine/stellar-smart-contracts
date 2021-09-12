# tx-functions
Stellar smart contracts - integration tests and more

Moved all common dependencies up: 
```
  "dependencies": {
    "bignumber.js": "^4.1.0",
    "moment": "^2.29.1",
    "node-fetch": "^3.0.0",
    "stellar-sdk": "^8.2.4"
  },  
  "devDependencies": {
    "@rollup/plugin-commonjs": "^17.0.0",
    "@rollup/plugin-node-resolve": "^11.1.0",
    "prettier": "^1.19.1",
    "rollup": "^2.36.1",
    "rollup-plugin-copy": "^3.3.0",
    "rollup-plugin-terser": "^7.0.2"
  }
```
