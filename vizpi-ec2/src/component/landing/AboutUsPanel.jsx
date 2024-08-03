import React, { useState } from 'react';
import '../../css/landing/aboutUs.scss';
import { Typography } from '@mui/material';

const profiles = [
  { name: 'purple_dragon', role: 'Developer', imageUrl: 'https://chensivan.github.io/files/headshot1.jpg', website: 'https://chensivan.github.io/' },
  { name: 'blue_dragon', role: 'Designer', imageUrl: 'https://chensivan.github.io/files/headshot1.jpg', website: 'https://chensivan.github.io/' },
  { name: 'green_dragon', role: 'Project Manager', imageUrl: 'https://chensivan.github.io/files/headshot1.jpg', website: 'https://chensivan.github.io/' },
  { name: 'red_dragon', role: 'Tester', imageUrl: 'https://chensivan.github.io/files/headshot1.jpg', website: 'https://chensivan.github.io/' },
  { name: 'yellow_dragon', role: 'Developer', imageUrl: 'https://chensivan.github.io/files/headshot1.jpg', website: 'https://chensivan.github.io/' },
  { name: 'orange_dragon', role: 'Support', imageUrl: 'https://chensivan.github.io/files/headshot1.jpg', website: 'https://chensivan.github.io/' },
  { name: 'pink_dragon', role: 'Designer', imageUrl: 'https://chensivan.github.io/files/headshot1.jpg', website: 'https://chensivan.github.io/' },
];

const ExplorePanel = () => {
    const [modalOpen, setModalOpen] = useState(false); 
    const [exercise, setExercise] = useState(""); // State for exercise

    return (
        <div className="about-us">
            <div className="header-container">
                <Typography variant='h2' className="header-text">
                    Our team
                </Typography>
                <Typography variant='body1' className="intro-text">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat modi explicabo ut dolorem dolor unde perspiciatis sapiente voluptatibus molestiae corporis ipsam fuga ex soluta autem est, hic eaque iste nobis.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat modi explicabo ut dolorem dolor unde perspiciatis sapiente voluptatibus molestiae corporis ipsam fuga ex soluta autem est, hic eaque iste nobis.

                </Typography>
                <hr className="division-line" />

                
            </div>
            <div className="profile-container">
                {profiles.map((profile, index) => (
                    <div className="profile" key={index}>                        
                        <div className="profile-description">
                            {profile.role}
                        </div>
                        <div className="profile-pic" style={{ backgroundImage: `url(${profile.imageUrl})` }}></div>
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="profile-name">
                            {profile.name}
                        </a>
                    </div>
                ))}
            </div>
            
        </div>
    );
};

export default ExplorePanel;
