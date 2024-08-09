import React, { useState } from 'react';
import '../../css/landing/aboutUs.scss';
import { Typography } from '@mui/material';

const profiles = [
  { name: 'Yan Chen', role: 'Project Manager', imageUrl: 'https://chensivan.github.io/files/headshot1.jpg', website: 'https://chensivan.github.io/' },
  { name: 'Xiaohang Tang', role: 'Developer', imageUrl: 'https://chensivan.github.io/img/profile_image/xiaohang_tang.jpeg', website: 'https://xiaohang-tang.github.io/' },
  { name: 'Xi Chen', role: 'Developer', imageUrl: 'https://chensivan.github.io/img/profile_image/xi_chen.jpg', website: 'https://11chen.link/' },
  { name: 'Tejas Navada', role: 'Developer', imageUrl: 'https://t3.ftcdn.net/jpg/06/19/26/46/360_F_619264680_x2PBdGLF54sFe7kTBtAvZnPyXgvaRw0Y.jpg', website: 'https://sites.google.com/view/tejas-navada-portfolio/home' },
  { name: 'Susan He', role: 'Tester', imageUrl: 'https://t3.ftcdn.net/jpg/06/19/26/46/360_F_619264680_x2PBdGLF54sFe7kTBtAvZnPyXgvaRw0Y.jpg', website: 'https://zichenghe-susan.github.io/susanhe.github.io/' },
  { name: 'Yusi Yao', role: 'Developer', imageUrl: 'https://yusiyao.org/author/yusi-yao-%E5%A7%9A%E7%BE%BD%E6%80%9D/avatar_hue4deb600174ddfc4efc907f96052d86f_689773_150x150_fill_q75_lanczos_center.jpg', website: 'https://yusiyao.org' },
  { name: 'Rexime Abulikemu', role: 'Designer', imageUrl: 'https://chensivan.github.io/img/profile_image/rehema.jpeg', website: 'https://rexime.github.io/' },
  { name: 'Ninglan Lei', role: 'Support', imageUrl: 'https://t3.ftcdn.net/jpg/06/19/26/46/360_F_619264680_x2PBdGLF54sFe7kTBtAvZnPyXgvaRw0Y.jpg', website: 'https://chensivan.github.io/' },
  { name: 'Bogdan', role: 'Designer', imageUrl: 'https://t3.ftcdn.net/jpg/06/19/26/46/360_F_619264680_x2PBdGLF54sFe7kTBtAvZnPyXgvaRw0Y.jpg', website: 'https://chensivan.github.io/' },
  { name: 'Sam Wong', role: 'Designer', imageUrl: 'https://chensivan.github.io/img/profile_image/samwong.jpg', website: 'https://www.linkedin.com/in/sam-wong-34a48a157/' },
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
                My group studies, designs, and develops interactive Human-AI systems that empower data workers to discover insights and detect critical patterns in real-time data analysis, such as in-class learning behaviors. The systems we develop streamline the analytical process by reducing the effort and programming skills users need. We achieve this by employing AI techniques, such as LLMs, to identify and predict underlying data structures and representations, and by integrating human-centered design principles to ensure seamless interaction between humans and AI. Our goal is to make advanced real-time data analysis more accessible and efficient for everyone by simplifying complex computational processes
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
