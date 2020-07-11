const Election= artifacts.require('./Election.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Election', (acc) => {
  let electi,electin

  before(async () => {
    electi = await Election.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await electi.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })
  })

  describe('candidates',async () => {
    it('candidateCount changed', async () => {
      const candiCount = await electi.candidatesCount()
      assert.equal(candiCount,2, 'contains 2 candidates')
    });

    it("checking details of candidates with the correct values", () => {
    return Election.deployed().then((obj) => {
      electin = obj;
      return electin.candidates(1);
    }).then((candi) => {
      assert.equal(candi[0].toNumber(), 1, "id is correct");
      assert.equal(candi[1], "Donald Trump", "name is correct");
      assert.equal(candi[2], 0, "initail voteCount1 is correct");
      return electin.candidates(2);
    }).then((candi) => {
      assert.equal(candi[0], 2, "id2 is correct");
      assert.equal(candi[1], "Joe  Biden", "name is correct");
      assert.equal(candi[2], 0, "initail voteCount2 is correct");
    });
  	});
  })

  describe('Vote', async () => {
  	let res,candi
  	before(async () => {
  		res = await electi.vote(1, { from: acc[0]})
  		//candi = await electi.candidates(1)
  	})

  	it("checking votes after vote1 for candidate1", async () => {
  		let event = res.logs[0].args
  		candi = await electi.candidates(event.candiId)

  		assert.equal(candi[0],1,"id is crt after vote")
  		assert.equal(candi[2],1,"vote is incremented by 1")

  	})

  	it("checking votes after vote1 for candidate2", async () => {
  		candi = await electi.candidates(2)

  		assert.equal(candi[0],2,"id is crt after vote")
  		assert.equal(candi[2],0,"vote is incremented by 1")

  		// fail for same account twice
  		await await electi.vote(1, { from: acc[0]}).should.be.rejected;
  		// fail for unkown candidate
  		await await electi.vote(69, { from: acc[1]}).should.be.rejected;
  	})

  	it("checking voters", async () => {
  		
  		res = await electi.voters(acc[0])

  		assert(res,"set to true ")
  		

  	})

  })
  

})