Web3 = require('web3');
request = require('request');



var web3 = // set web3 provider here (infura, etc.)

//addressStr.call(bytes4(sha3(methodQuery)), parameters_values)

var addressStr = "0xa74476443119A942dE498590Fe1f2454d7D4aC0d";
var methodQuery = "fundingStartBlock()";

var erc20_signatures = [
    "balanceOf(address)",
    "totalSupply()",
    "transfer(address,uint256)",
    "transferFrom(address,address,uint256)",
    "approve(address,uint256)",
    "allowance(address,address)"
];

console.log("addressStr: " + addressStr);
console.log("methodQuery: " + methodQuery);

web3.eth.getCode(addressStr).then(bytecode => {
    var functionPattern = /8063\w{8}1461\w{4}/g;
    var functionPattern2 = new RegExp('\w{8}');
    var functionSelector = bytecode.match(functionPattern).map(str =>
    {
        return str.substring(4, 12);
    });
    console.log(functionSelector);
    var methodQuerySignature = web3.utils.sha3(methodQuery).substring(2, 10);

    // check if method being queried is contained

    if (functionSelector.includes(methodQuerySignature)) {
        console.log(methodQuery + " implemented");
    }
    else {
        console.log(methodQuery + " not implemented");
    }


    //request('https://4byte.directory/api/v1/signatures/?hex_signature=' + '0xabcd1234');
  
    // check if all required ERC20 functions are implemented

    var erc20_signature_hashes = erc20_signatures.map(str => {
        return web3.utils.sha3(str).substring(2, 10);
    });
    if (erc20_signature_hashes.every(hash => functionSelector.includes(hash))) {
        console.log("Required ERC20 functions implemented");
    }
    else {
        console.log("Required ERC20 functions NOT implemented");
    }

    erc20_signature_hashes.map(str => {
        request('https://4byte.directory/api/v1/signatures/?hex_signature=' + str, 
            { json: true }, (err, res, body) => {
                if (err) {
                    return console.log(err);
                }
                console.log(body);
                console.log(body.url);
                console.log(body.signature);
            });
    })
});
