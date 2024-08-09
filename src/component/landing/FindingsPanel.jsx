import React from 'react';
import styled from 'styled-components';
import { Typography } from '@mui/material';

const articles = [
  {
    authors: 'Xiaohang Tang, Sam Wong, Kevin Pu, Xi Chen, Yalong Yang, Yan Chen',
    title: 'VizGroup: An AI-Assisted Event-Driven System for Real-Time Collaborative Programming Learning Analytics',
    conference: 'UIST 2024',
    imageUrl: 'https://chensivan.github.io/img/vizgroup.png',
    preprintLink: 'https://chensivan.github.io/papers/vizgroup_uist_2024.pdf', 
    demo30secLink: 'https://www.dropbox.com/scl/fi/gmfexd5qd0il12zuxg7m6/uist-preview.mp4?rlkey=34j2i3odgau6visikzae9ttq6&dl=0', 
    demo5minLink: 'https://www.dropbox.com/scl/fi/ovfsmqllqd1zt5igx5onl/uist-demo.mp4?rlkey=s49cru2syqphiwjnjio9du3g4&dl=0', 
  },
  {
    authors: 'Ashley Zhang, Xiaohang Tang, Steve Oney, Yan Chen',
    title: "CFlow: Supporting Semantic Flow Analysis of Students' Code in Programming Problems at Scale",
    conference: 'ACM Learning @ Scale 2024 (L@S) \'24',
    imageUrl: 'https://chensivan.github.io/img/cflow.png',
    pdfLink: 'https://arxiv.org/pdf/2404.10089', 
    arxivLink: 'https://arxiv.org/abs/2404.10089', 
    talkVideoLink: 'https://www.dropbox.com/s/mlw6y2r5ceyjesz/CFlow-v1.m4v?dl=0', 
  }, // <-- Closing curly brace added here
  {
    authors: 'Ashley Zhang, Yan Chen, Steve Oney',
    title: "VizProg: Identifying Misunderstandings by Visualizing Students' Coding Progress",
    conference: 'ACM Conference on Human Factors in Computing Systems (CHI), 2023 (🏅Best Paper Honorable Mention)',
    imageUrl: 'https://chensivan.github.io/img/vizprog.png',
    pdfLink: 'https://chensivan.github.io/papers/chi2023_vizprog.pdf', 
    demo9minLink: 'http://localhost:3000/about#',
    description: "VizProg presents an innovative, real-time visualization system that meaningfully displays class-wide students' coding progress, making it simple for programming instructors to pinpoint issues and mistakes.",
    thoughts: "The challenge of delivering programming education at scale is exacerbated by factors such as real-time instruction, a large student population, novice learners, and the complexity of the material being taught. To enhance the classroom experience for students and simplify the task for instructors, how can we make programming education more engaging and manageable?"
  },
  // Add more articles as needed
];

const FindingsContainer = styled.div`
  width: 70%;
  margin: 0 auto;
  padding: 20px;
`;

const HeaderContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const HeaderText = styled(Typography)`
  margin-bottom: 10px;
`;

const IntroText = styled(Typography)`
  margin-bottom: 20px;
`;

const DivisionLine = styled.hr`
  margin-bottom: 20px;
`;

const ArticlesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Article = styled.div`
  display: flex;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  align-items: flex-start;
  text-align: left;
`;

const ArticleImage = styled.div`
  width: 200px;
  height: 150px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-right: 20px;
`;

const ArticleContent = styled.div`
  flex: 1;
`;

const ArticleTitle = styled(Typography)`
  margin-bottom: 10px;
  font-weight: bold;
`;

const ArticleMeta = styled.div`
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
`;

const ArticleLinks = styled.div`
  display: flex;
  gap: 10px;
`;

const ArticleLink = styled.a`
  text-decoration: none;
  color: #0073e6;
  transition: color 0.3s;

  &:hover {
    color: #005bb5;
  }
`;

const Articles = () => {
  return (
    <FindingsContainer>
      <HeaderContainer>
        <HeaderText variant='h3' sx={{ fontWeight: '500', marginTop: 1, padding: '15px' }}>
          Previous Findings
        </HeaderText>
        <IntroText variant='body1'>
          Our previous findings highlight the positive impact of AI-assisted monitoring on collaborative programming learning. Instructors reported improved student engagement and more effective collaboration, with AI-generated insights helping to identify and address learning gaps promptly. These results demonstrate the potential of VizGroup to transform educational experiences by fostering deeper understanding and teamwork.
        </IntroText>
        <DivisionLine />
      </HeaderContainer>
      <ArticlesContainer>
        {articles.map((article, index) => (
          <Article key={index}>
            <ArticleImage style={{ backgroundImage: `url(${article.imageUrl})` }} />
            <ArticleContent>
              <ArticleTitle variant='h6'>
                {article.authors}. {article.title}. {article.conference}
              </ArticleTitle>
              <ArticleMeta>
                <ArticleLinks>
                  {article.preprintLink && (
                    <ArticleLink href={article.preprintLink} target="_blank" rel="noopener noreferrer">
                      pre-print
                    </ArticleLink>
                  )}
                  {article.demo30secLink && (
                    <>
                      {' | '}
                      <ArticleLink href={article.demo30secLink} target="_blank" rel="noopener noreferrer">
                        30 second demo
                      </ArticleLink>
                    </>
                  )}
                  {article.demo5minLink && (
                    <>
                      {' | '}
                      <ArticleLink href={article.demo5minLink} target="_blank" rel="noopener noreferrer">
                        5 min demo
                      </ArticleLink>
                    </>
                  )}
                  {article.pdfLink && (
                    <ArticleLink href={article.pdfLink} target="_blank" rel="noopener noreferrer">
                      local pdf
                    </ArticleLink>
                  )}
                  {article.arxivLink && (
                    <>
                      {' | '}
                      <ArticleLink href={article.arxivLink} target="_blank" rel="noopener noreferrer">
                        arxiv
                      </ArticleLink>
                    </>
                  )}
                  {article.talkVideoLink && (
                    <>
                      {' | '}
                      <ArticleLink href={article.talkVideoLink} target="_blank" rel="noopener noreferrer">
                        talk video
                      </ArticleLink>
                    </>
                  )}
                  {article.demo9minLink && (
                    <>
                      {' | '}
                      <ArticleLink href={article.demo9minLink} target="_blank" rel="noopener noreferrer">
                        9 min system demo
                      </ArticleLink>
                    </>
                  )}
                </ArticleLinks>
                {article.description && (
                  <Typography variant="body2" sx={{ marginTop: 2 }}>
                    {article.description}
                  </Typography>
                )}
                {article.thoughts && (
                  <Typography variant="body2" sx={{ marginTop: 2, fontStyle: 'italic' }}>
                    Thoughts: {article.thoughts}
                  </Typography>
                )}
              </ArticleMeta>
            </ArticleContent>
          </Article>
        ))}
      </ArticlesContainer>
    </FindingsContainer>
  );
};

export default Articles;