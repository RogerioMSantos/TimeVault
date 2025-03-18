# Setup the Dapp

Try running some of the following tasks to get started
```shell
npm install
```

## To start the contract

Compile the contract
```shell
npx hardhat compile
```

Start local node
```shell
npx hardhat node
```

Deploy contract
```shell
npx hardhat run --network localhost scripts/deploy.js
```

Set up NODE_OPTIONS with legacy provider
```shell
# Linux
export NODE_OPTIONS=--openssl-legacy-provider

# Windows (CMD)
set NODE_OPTIONS=--openssl-legacy-provider

# Windows (PowerShell)
$env:NODE_OPTIONS="--openssl-legacy-provider"
```

Start React app
```shell
npm start
```

