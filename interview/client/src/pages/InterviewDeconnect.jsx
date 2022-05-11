import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { EndPointContext } from '../useContext';
import '../assets/css/InterviewStarted.css';

function InterviewDeconnect() {
  const msg = useContext(EndPointContext);
  function sum(a, b) {
    return a + b;
  }
  return (
    <div className="container-disconnect">
      <h3>Vous avez quitté la réunion.</h3>
      <h1>{msg}</h1>
      <h3>{sum(1, 2)}</h3>
      <div className="buttons">
        {/* <Link to="/rooms/:hash"> */}
        <Link to="/rooms/2">
          <Button id="button-reunion" variant="outlined">
            Réintégrer la réunion
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default InterviewDeconnect;
