import React from 'react';
import ReactDOM from 'react-dom';

import Revealer from './Revealer/Revealer.jsx';

import BoyPNG from './img/boy.png';
import MusclesPNG from './img/muscles.png';

require('./index.scss');

ReactDOM.render(
  <main>
    <h1>React Revealer component:</h1>
    <div className='revealer-demo'>
      <div className='revealer-demo__box'>
        <h2>Standard:</h2>
        <Revealer>
          <div>
            <img draggable='false' src={BoyPNG}></img>
          </div>
          <div>
            <img draggable='false' src={MusclesPNG}></img>
          </div>
        </Revealer>
      </div>
      <div className='revealer-demo__box'>
        <h2>Initial handler position: (33%)</h2>
        <Revealer
          initialHandlerPosition={ 33 }
        >
          <div>
            <img draggable='false' src={BoyPNG}></img>
          </div>
          <div>
            <img draggable='false' src={MusclesPNG}></img>
          </div>
        </Revealer>
      </div>
      <div className='revealer-demo__box'>
        <h2>Hot end area mode on (25%), move handler almost to left or right end:</h2>
        <Revealer
          initialHandlerPosition={ 33 }
          hotAreaPercentage={ 25 }
        >
          <div>
            <img draggable='false' src={BoyPNG}></img>
          </div>
          <div>
            <img draggable='false' src={MusclesPNG}></img>
          </div>
        </Revealer>
      </div>
      <div className='revealer-demo__box'>
        <h2>Hot offset mode on (25%), move handler to one side by more than 25%:</h2>
        <Revealer
          initialHandlerPosition={ 33 }
          hotOffsetPercentage={ 25 }
        >
          <div>
            <img draggable='false' src={BoyPNG}></img>
          </div>
          <div>
            <img draggable='false' src={MusclesPNG}></img>
          </div>
        </Revealer>
      </div>
      <div className='revealer-demo__box'>
        <h2>With all parameters:</h2>
        <Revealer
          hotAreaPercentage={ 25 }
          hotOffsetPercentage={ 33 }
          initialHandlerPosition={ 33 }
        ><div>
          <img draggable='false' src={BoyPNG}></img>
        </div>
          <div>
            <img draggable='false' src={MusclesPNG}></img>
          </div>
        </Revealer>
      </div>
    </div>
    <br /><br /><br />
    Component author:<br />
    <a
      target='_blank'
      href='http://oskarotwinowski.com'
    >Oskar Otwinowski
    </a>
    <br /><br />
    Image source:<br />
    <a
      target='_blank'
      href='http://www.freepik.com/free-vector/flat-human-x-ray-illustration_838890.htm'
    >Designed by Freepik
    </a>
  </main>,
  document.getElementById('mount')
);
