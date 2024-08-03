import React, { useState } from 'react';
import '../../css/landing/researchers.scss';
import { Typography, TextField, Button } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import axios from 'axios';

const host = process.env.REACT_APP_HOST_API + "/contact"

const ResearchersPanel = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSendEmail = async () => {
    try {
      await axios.post(host, {
        email,
        subject,
        message
      });
      alert('Email sent successfully');
    } catch (error) {
      console.error('There was an error sending the email:', error);
      console.error(error.response.data.details || 'Failed to send email');
    }
  };

  return (
    <div className="researchers">
      <div className="header-container">
        <Typography variant='h2' className="header-text">
          Interested in Joining VizPI?
        </Typography>
        <Typography variant='body1' className="intro-text" gutterBottom>
          We are looking for passionate researchers to join our team and help us expand our knowledge and research capabilities. Below you will find more information on how you can contribute and be a part of our growing community.
        </Typography>
        <Typography variant='body1' className="intro-text" gutterBottom>
          If you have any questions or want to apply, please write us an email at <a href="mailto:info@VizPI.org">info@VizPI.org</a>.
        </Typography>
        <hr className="division-line" />
      </div>
      <div className="content-container">
        <Typography variant='h4' className="section-title">
          Opportunities for Researchers
        </Typography>
        <Typography variant='body1' className="section-content">
          <strong>Collaborate on Existing Projects:</strong> We are always looking for experts to help us with ongoing studies. Your expertise can help us gain deeper insights and improve the quality of our research.
        </Typography>
        <Typography variant='body1' className="section-content">
          <strong>Lead New Research Initiatives:</strong> If you have an idea for a study that aligns with our mission, we would love to support you in bringing it to life. We provide the resources and platform you need to conduct meaningful research.
        </Typography>
        <Typography variant='body1' className="section-content">
          <strong>Mentor Young Researchers:</strong> Share your knowledge and experience with the next generation of scientists. Mentorship opportunities are available for experienced researchers willing to guide students and junior researchers.
        </Typography>
        <hr className="division-line" />
      </div>
      <div className="contact-form">
      <Typography variant='h4' className="section-title">
        Contact Us
      </Typography>
      <Typography variant='body1' className="intro-text" gutterBottom>
        If you have any suggestions, discover any bugs, or are interested in joining our team, please feel free to reach out to us!
      </Typography>
        <TextField
          label="Your Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Subject"
          variant="outlined"
          fullWidth
          margin="normal"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <TextField
          label="Message"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendEmail}
        >
          Send
        </Button>
      </div>
      <div className="social-media-container">
        <a href="https://twitter.com/YourProfile" target="_blank" rel="noopener noreferrer" className="social-icon">
          <TwitterIcon fontSize="large" />
        </a>
        <a href="https://linkedin.com/YourProfile" target="_blank" rel="noopener noreferrer" className="social-icon">
          <LinkedInIcon fontSize="large" />
        </a>
        <a href="https://facebook.com/YourProfile" target="_blank" rel="noopener noreferrer" className="social-icon">
          <FacebookIcon fontSize="large" />
        </a>
        <a href="https://instagram.com/YourProfile" target="_blank" rel="noopener noreferrer" className="social-icon">
          <InstagramIcon fontSize="large" />
        </a>
      </div>
    </div>
  );
};

export default ResearchersPanel;
