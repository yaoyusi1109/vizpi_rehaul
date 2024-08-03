import React from 'react';
import '../../css/landing/findings.scss';
import { Typography } from '@mui/material';
import hexagon from '../../icon/about/hexagon.png';
import autoGroup from '../../icon/SettingPassRate.png';

const articles = [
  {
    title: 'How is the color spectrum divided up differently in different languages?',
    description: 'To answer this question, we collected color names in over 14 common written languages and built probabilistic models that find different sets of nameable (salient) colors across languages                     Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat modi explicabo ut dolorem dolor unde perspiciatis sapiente voluptatibus molestiae corporis ipsam fuga ex soluta autem est, hic eaque iste nobis....',
    imageUrl: hexagon,
    publicationLink: 'https://www.example.com/publication1',
    pdfLink: 'https://www.example.com/pdf1'
  },
  {
    title: 'How do participants currently contribute on VizPI and how would they like to do so in the future?',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat modi explicabo ut dolorem dolor unde perspiciatis sapiente voluptatibus molestiae corporis ipsam fuga ex soluta autem est, hic eaque iste nobis.To answer this question, we analyzed more than 8,000 feedback messages from volunteers provided at the end of four VizPI studies...',
    imageUrl: hexagon,
    publicationLink: 'https://www.example.com/publication2'
  },
  // Add more articles as needed
];

const Articles = () => {
  return (
    <div className="findings">
      <div className="header-container">
        <Typography variant='h2' className="header-text">
          Previous Findings
        </Typography>
        <Typography variant='body1' className="intro-text">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit reprehenderit explicabo tenetur expedita aliquam ut dolores. Natus nam eum consequatur enim voluptatum placeat, possimus praesentium adipisci expedita quod hic sunt?
        </Typography>
        <hr className="division-line" />

      </div>
      <div className="articles-container">
        {articles.map((article, index) => (
          <div className="article" key={index}>
            <div className="article-image" style={{ backgroundImage: `url(${article.imageUrl})` }}></div>
            <div className="article-content">
              <Typography variant='h6' className="article-title">
                {article.title}
              </Typography>
              <Typography variant='body2' className="article-description">
                {article.description}
              </Typography>
              <div className="article-links">
                <a href={article.publicationLink} target="_blank" rel="noopener noreferrer" className="publication-link">
                  View Publication
                </a>
                {article.pdfLink && (
                  <a href={article.pdfLink} target="_blank" rel="noopener noreferrer" className="pdf-link">
                    Download PDF
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Articles;
