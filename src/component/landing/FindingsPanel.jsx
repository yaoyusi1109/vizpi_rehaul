import React from 'react';
import styled from 'styled-components';
import { Typography } from '@mui/material';

const articles = [
  {
    title: 'VizGroup: An AI-Assisted Event-Driven System for Real-Time Collaborative Programming Learning Analytics',
    description: "Programming instructors often conduct collaborative learning activities, like Peer Instruction, to foster a deeper understanding in students and enhance their engagement with learning. These activities, however, may not always yield productive outcomes due to the diversity of student mental models and their ineffective collaboration. In this work, we introduce VizGroup, an AI-assisted system that enables programming instructors to easily oversee students' real-time collaborative learning behaviors during large programming courses. VizGroup leverages Large Language Models (LLMs) to recommend event specifications for instructors so that they can simultaneously track and receive alerts about key correlation patterns between various collaboration metrics and ongoing coding tasks. We evaluated VizGroup with 12 instructors using a dataset collected from a Peer Instruction activity that was conducted in a large programming lecture. The results showed that compared to a version of VizGroup without the suggested units, VizGroup with suggested units helped instructors create additional monitoring units on previously undetected patterns on their own, covered a more diverse range of metrics, and influenced the participants' following notification creation strategies.",
    imageUrl: "https://chensivan.github.io/img/vizgroup.png",
    publicationLink: 'https://arxiv.org/abs/2404.08743',
    pdfLink: 'https://arxiv.org/pdf/2404.08743'
  },
  {
    title: "VizProg: Identifying Misunderstandings By Visualizing Students’ Coding Progress",
    description: "VizProg presents an innovative, real-time visualization system that meaningfully displays class-wide students' coding progress, making it simple for programming instructors to pinpoint issues and mistakes. The challenge of delivering programming education at scale is exacerbated by factors such as real-time instruction, a large student population, novice learners, and the complexity of the material being taught. To enhance the classroom experience for students and simplify the task for instructors, how can we make programming education more engaging and manageable?",
    imageUrl: "https://chensivan.github.io/img/vizprog.png",
    publicationLink: 'https://chensivan.github.io/papers/chi2023_vizprog.pdf'
  },
  // Add more articles as needed
];

const FindingsContainer = styled.div`
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
  flex-wrap: wrap;
  justify-content: space-around;
`;

const Article = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 20px;
  width: calc(50% - 40px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
`;

const ArticleImage = styled.div`
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const ArticleContent = styled.div`
  padding: 20px;
`;

const ArticleTitle = styled(Typography)`
  margin-bottom: 10px;
`;

const ArticleDescription = styled(Typography)`
  margin-bottom: 20px;
  text-align: left;
`;

const ArticleLinks = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const PublicationLink = styled.a`
  text-decoration: none;
  color: #0073e6;
  transition: color 0.3s;

  &:hover {
    color: #005bb5;
  }
`;

const PdfLink = styled.a`
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
        <HeaderText variant='h2'>
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
            <ArticleImage style={{ backgroundImage: `url(${article.imageUrl})` }}></ArticleImage>
            <ArticleContent>
              <ArticleTitle variant='h6'>
                {article.title}
              </ArticleTitle>
              <ArticleDescription variant='body2'>
                {article.description}
              </ArticleDescription>
              <ArticleLinks>
                <PublicationLink href={article.publicationLink} target="_blank" rel="noopener noreferrer">
                  View Publication
                </PublicationLink>
                {article.pdfLink && (
                  <PdfLink href={article.pdfLink} target="_blank" rel="noopener noreferrer">
                    Download PDF
                  </PdfLink>
                )}
              </ArticleLinks>
            </ArticleContent>
          </Article>
        ))}
      </ArticlesContainer>
    </FindingsContainer>
  );
};

export default Articles;