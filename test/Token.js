const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
return ethers.utils.parseUnits(n.toString(), 'ether')	
}

describe('Token', () => {
    
    let token, accounts, deployer, receiver, exchange

	beforeEach(async() => {
	// Fetch Token from Blockchain
	const Token = await ethers.getContractFactory('Token')
  	token = await Token.deploy('Dapp university', 'DAPP' , '1000000')

  	accounts = await ethers.getSigners()
  	deployer = accounts[0]	
  	receiver = accounts[1]
  	exchange = accounts[2]

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

	 // Check that total supply is assigned to deployer
	it('assigns total supply to deployer', async () => {	
		expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)	
	})	

   	})

   	describe('Sending Tokens', () => {
   		let amount, transaction, result

   		describe('Success', () => {

   			beforeEach(async () =>{
   		    //Transfer tokens
   			amount = tokens(100)
            transaction = await token.connect(deployer).transfer(receiver.address, amount) 
            result = await transaction.wait()	
   		    })

            //ensure token balance changed
   		    it('transfers token balances', async () => {
            expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
            expect(await token.balanceOf(receiver.address)).to.equal(amount)
   		    })

   		    it('emits a Transfer event', async () => {
   			const receipt = result.events[0]
   			expect(receipt.event).to.equal('Transfer')

   			const args = receipt.args
   			expect(args.from).to.equal(deployer.address)
   			expect(args.to).to.equal(receiver.address)
   			expect(args.value).to.equal(amount)
   		    })
   		})

   		describe('Failure', () => {

   			it('rejects insufficient balances', async () => {
   			//transfer more tokens that deployer has - 100M	
   			const invalidAmount = tokens(100000000)	
   			await expect(token.connect(deployer).transfer(receiver.address, invalidAmount)).to.be.reverted
   			})

   			it('rejects invalid recipient', async () => {
   			const amount = tokens(100)	
   			await expect(token.connect(deployer).transfer(0x000000000000000000000000000000000000000, amount)).to.be.reverted
   			})

   		})
  		
   	})

   	describe('Approving tokens', () => {
   		let amount, transaction, result

   		beforeEach(async () => {
   			amount = tokens(100)
            transaction = await token.connect(deployer).approve(exchange.address, amount) 
            result = await transaction.wait()	
   		})

   		describe('Success', () => {
   			it('allocates an allowance for delegated token spending', async () => {
   				expect(await token.allowance(deployer.address, exchange.address)).to.equal(amount)
   			})

   			it('emits a Approval event', async () => {
   			const receipt = result.events[0]
   			expect(receipt.event).to.equal('Approval')

   			const args = receipt.args
   			expect(args.owner).to.equal(deployer.address)
   			expect(args.spender).to.equal(exchange.address)
   			expect(args.value).to.equal(amount)
   		    })
   		})

   		describe('Failure', () => {
   			it('rejects invalid spenders', async () => {
   				await expect(token.connect(deployer).approve('0x000000000000000000000000000000000000000', amount)).to.be.reverted
   			})
   		})
   	})
   
})
