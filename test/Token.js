const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
return ethers.utils.parseUnits(n.toString(), 'ether')	
}

describe('Token', () => {
    
    let token

	beforeEach(async() => {
	// Fetch Token from Blockchain
	const Token = await ethers.getContractFactory('Token')
  	token = await Token.deploy('Dapp university', 'DAPP' , '1000000')	
	})     
    
   	describe('Deployment', () => {
   		const name = 'Dapp university'
   		const symbol = 'DAPP'
 		const decimals = '18'
 		const totalSupply = tokens('1000000')
 			
   	 // Check that name is correct
	it('has correct name', async () => {
	expect(await token.name()).to.equal(name)	
	})

    // Check that symbol is correct
	it('has correct symbol', async () => {	 	
	expect(await token.symbol()).to.equal(symbol)	
	})

    // Check that it has correct decimals
	it('has correct decimals', async () => {	 	
	expect(await token.decimals()).to.equal(decimals)	
	})

	 // Check that it has correct total supply
	it('has correct total sypply', async () => {	
	expect(await token.totalSupply()).to.equal(totalSupply)	
	})	

   	})

   
})