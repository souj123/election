import React,{ Component }from 'react';
import './App.css';

class Main extends Component {
  render() {
  return (
    <div class="container" >
      
      <div id="content" >
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Votes</th>
            </tr>
          </thead>
          {this.props.candidates.map((candidate, key) => {
                return(
                  <tr key={key}>
                    <th scope="row">{candidate.id.toString()}</th>
                    <td>{candidate.name}</td>
                    <td>{candidate.voteCount.toString()}</td>
                  </tr>
                )
            })}

        </table>

        <hr/>
        <form class="text-center" onSubmit={(event) => {
                  event.preventDefault()
                  
                  this.props.vote(this.candi)
                }}>
          <div class="form-group">
            <label for="candidatesSelect">Select Candidate : &nbsp;</label>
            <input id="candi" type="radio" name="candi"
              onChange={(input) => { this.candi = 1}}
            required /> candidate 1   &nbsp;
            <input id="candi" type="radio" name="candi"
              onChange={(input) => { this.candi = 2}}
            required /> candidate 2
          </div>
           { this.props.voter
              ? null
              :<button type="submit" class="btn btn-primary">Vote</button>
            }
        </form>

        
      </div>
    </div>
    
  );
 }
}

export default Main;
