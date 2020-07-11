import React,{ Component }from 'react'
import './App.css'
import Main from './Main.js'

import Web3 from 'web3'
import Election from './abis/Election.json'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      console.log(window.web3)
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account : accounts[0]})

    //  web3.eth.getCoinbase((err, account) => {
    //   if (err === null) {
    //     this.setState({ account : account})
    //   }
    // });

    const networkId = await web3.eth.net.getId()
    const networkData = Election.networks[networkId]
    if(networkData) {
      const election = web3.eth.Contract(Election.abi, networkData.address)
      // console.log(election.methods.createRecord)
      this.setState({ election })
      
      const candidatesCount = await election.methods.candidatesCount().call()
      // console.log(candidatesCount.toString())
      this.setState({ candidatesCount })
      //Load records
      for (var i = 1; i <= candidatesCount; i++) {
        const candidate = await election.methods.candidates(i).call()
        this.setState({
          candidates: [...this.state.candidates, candidate]
        })
      }
      const voter = await election.methods.voters(this.state.account).call()
      this.setState({ current_vote: voter})

      this.setState({ loading: false})
      // console.log(this.state.candidates)
    } else {
      window.alert('contract not deployed to any network.')
    }



  }

  constructor(props) {
    super(props)
    this.state = {
      account : '',
      candidatesCount : 0,
      candidates : [],
      current_vote:'',      
      loading : true
    }

    this.vote = this.vote.bind(this)
  }

  vote(id) {
    this.setState({ loading: true })
    // console.log(name, gen,dob,blood,all,height,weight,sug)
    // (pname,"m","25-2-1909",'o','none',price,82,true)

    this.state.election.methods.vote(id)
      .send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
    })
  }




  render() {
  return (
    <div>
    <nav className="navbar fixed-top bg-dark flex-md-nowrap p-2 shadow">
          <span
            className="navbar-brand col-sm-3 col-md-2 mr-0 text-white"
          >
             Decentralized App for US election
          </span>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
      </nav>

    <div class="container" >
      <div class="row">
        <div class="col-lg-12">
          
          <h1 class="text-center">Election Results</h1>
          
           <main role="main" className="col-lg-12 d-flex mt-4">
              { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Main
                  candidates={this.state.candidates}
                  vote={this.vote}
                  voter={this.state.current_vote}
                  />
              }
            </main>
            <p id="accountAddress" class="text-center">your accountAddress is {this.state.account}</p>

        </div>
      </div>
    </div>
  </div>
  );
 }
}

export default App;
