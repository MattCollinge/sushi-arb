sushiData.exchange.observePairs({exchangeChain:'Spooky_FTM'}).subscribe({next: (pairs) => console.log(pairs), error: (err) => console.log(err)})

sushiData.exchange.observeTokens({exchangeChain:'Spooky_FTM'}).subscribe({next: (pairs) => console.log(pairs), error: (err) => console.log(err)})

sushiData.exchange.observeFactory({exchangeChain:'Spooky_FTM'}).subscribe({next: (pairs) => console.log(pairs), error: (err) => console.log(err)})

sushiData.blocks.observeLatestBlock({exchangeChain:'Spooky_FTM'}).subscribe({next: (pairs) => console.log(pairs), error: (err) => console.log(err)})