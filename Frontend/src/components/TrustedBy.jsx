import React from 'react';
import './TrustedBy.css';

// Import the logos from your assets folder
import lifeFitnessLogo from '../assets/life-fitness-seeklogo.png';
import precorLogo from '../assets/precor-seeklogo.png';
import bowflexLogo from '../assets/bowflex-seeklogo.png';
import nordicTrackLogo from '../assets/nordictrack-seeklogo.png';
import trueFitnessLogo from '../assets/true-fitness-seeklogo.png';
import octaneFitnessLogo from '../assets/octane-fitness-seeklogo.png';
import cybexLogo from '../assets/Cybex.png';
import totalGymLogo from '../assets/Total gym.png';

// Create an array of the logos to map over
const logos = [
    { src: lifeFitnessLogo, alt: 'Life Fitness' },
{ src: precorLogo, alt: 'Precor' },
{ src: bowflexLogo, alt: 'Bowflex' },
{ src: nordicTrackLogo, alt: 'NordicTrack' },
{ src: trueFitnessLogo, alt: 'True Fitness' },
{ src: octaneFitnessLogo, alt: 'Octane Fitness' },
{ src: cybexLogo, alt: 'Cybex' },
{ src: totalGymLogo, alt: 'Total Gym' },
];

const TrustedBy = () => {
    return (
        <section className="trusted-by-section">
        <h2 className="trusted-by-title">Trusted by the best</h2>
        <div className="logos-container">
        {logos.map((logo, index) => (
            <div className="logo-item" key={index}>
            <img src={logo.src} alt={logo.alt} />
            </div>
        ))}
        </div>
        </section>
    );
};

export default TrustedBy;
