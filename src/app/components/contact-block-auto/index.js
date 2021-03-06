import React from 'react';
import GradientWords from '../gradient-words';

function ContactBlockAuto() {
  return (
    <div className="contact-block contact-block-auto">
      <div className="home-text-block">
        <div className="section-title">Make something awesome</div>
        <h2>Get in touch <br /><span className="contact-block-email"><GradientWords word="mobility@ustwo.com" color="auto" reverse={true} /></span></h2>
        <div className="contact-block-image">
          <img src="/images/logo-ustwoauto.svg" alt="ustwo Auto" />
        </div>
      </div>
    </div>
  );
}

export default ContactBlockAuto;
