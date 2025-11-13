import React from 'react';
import AdminHeader from '../components/AdminHeader';
import AdminFooter from '../components/AdminFooter';
import './About.css';

const About = () => {
  return (
    <>
      <AdminHeader />
      <main className="about-container">
        <h1 className="about-title">About the Alumni Portal</h1>
        <p className="about-text">
          The Alumni Portal is designed to help graduates stay connected with their institution, 
          share updates, collaborate on opportunities, and maintain strong professional and personal networks. 
          By offering features such as alumni directories, event updates, and admin announcements, 
          this platform bridges the gap between past and present, fostering lifelong connections.
        </p>
      </main>
      <AdminFooter />
    </>
  );
};

export default About;
