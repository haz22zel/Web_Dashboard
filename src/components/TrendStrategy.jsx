import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  padding: 80px 2rem 2rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white;
`;

const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #ff6ac1, #38bdf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  font-family: 'Inter', sans-serif;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: #c084fc;
  font-family: 'Inter', sans-serif;
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: #c084fc;
    box-shadow: 0 0 0 3px rgba(192, 132, 252, 0.2);
  }

  option {
    background: #1a1a2e;
    color: white;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const DashboardCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(192, 132, 252, 0.3);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #c084fc;
`;

const CardContent = styled.div`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #ff6ac1;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.7;
`;

const TrendingTopicsSection = styled.div`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #c084fc;
  font-family: 'Inter', sans-serif;
  text-align: center;
`;

const TrendingTopicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const TopicCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(192, 132, 252, 0.3);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ff6ac1, #38bdf8);
  }
`;

const TopicRank = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6ac1, #38bdf8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  color: white;
`;

const TopicName = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: white;
  font-family: 'Inter', sans-serif;
`;

const TopicStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const TopicMetric = styled.div`
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #ff6ac1;
`;

const MetricLabel = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 0.2rem;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-radius: 20px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ModalTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #c084fc;
  font-family: 'Inter', sans-serif;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 1.5rem 0;
`;

const DetailCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const DetailLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.7;
  margin-bottom: 0.5rem;
`;

const DetailValue = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #ff6ac1;
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 1rem 0;
`;

const RelatedTopics = styled.div`
  margin-top: 1.5rem;
`;

const RelatedTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #c084fc;
  margin-bottom: 1rem;
`;

const RelatedList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const RelatedTag = styled.span`
  background: rgba(192, 132, 252, 0.2);
  color: #c084fc;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid rgba(192, 132, 252, 0.3);
`;

const SubtopicsSection = styled.div`
  margin-top: 2rem;
`;

const SubtopicsTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #c084fc;
  margin-bottom: 1.5rem;
  font-family: 'Inter', sans-serif;
`;

const SubtopicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
`;

const SubtopicCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 106, 193, 0.3);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #ff6ac1, #38bdf8);
  }
`;

const SubtopicRank = styled.div`
  position: absolute;
  top: 0.8rem;
  right: 1rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6ac1, #38bdf8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8rem;
  color: white;
`;

const SubtopicName = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  color: white;
  font-family: 'Inter', sans-serif;
  padding-right: 2rem;
`;

const SubtopicMetrics = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
`;

const SubtopicMetric = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SubtopicMetricValue = styled.div`
  font-weight: 600;
  color: #ff6ac1;
`;

const SubtopicMetricLabel = styled.div`
  opacity: 0.7;
  font-size: 0.8rem;
  margin-top: 0.2rem;
`;

const BackButton = styled.button`
  background: linear-gradient(135deg, #ff6ac1, #38bdf8);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
  font-family: 'Inter', sans-serif;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 106, 193, 0.3);
  }
`;

function TrendStrategy() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topicCategory, setTopicCategory] = useState('all');
  const [contentType, setContentType] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isDetailView, setIsDetailView] = useState(false);

  const topicCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'technology', label: 'Technology' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'news', label: 'News & Politics' },
    { value: 'sports', label: 'Sports' },
    { value: 'education', label: 'Education' },
    { value: 'business', label: 'Business' }
  ];

  const contentTypes = [
    { value: 'all', label: 'All Content Types' },
    { value: 'video', label: 'Video' },
    { value: 'image', label: 'Image' },
    { value: 'text', label: 'Text' },
    { value: 'story', label: 'Story' },
    { value: 'reel', label: 'Reel' },
    { value: 'live', label: 'Live Stream' }
  ];

  // Sample trending topics data
  const trendingTopics = [
    {
      id: 1,
      name: "Ozzy",
      views: "2.4M",
      engagement: "85%",
      growth: "+12%"
    },
    {
      id: 2,
      name: "Black Sabbath",
      views: "1.8M",
      engagement: "78%",
      growth: "+8%"
    },
    {
      id: 3,
      name: "Gaza",
      views: "1.5M",
      engagement: "92%",
      growth: "+15%"
    },
    {
      id: 4,
      name: "#15YearsOfOneDirection",
      views: "1.2M",
      engagement: "89%",
      growth: "+6%"
    },
    {
      id: 5,
      name: "MAEWNAM IS THE WAN",
      views: "980K",
      engagement: "76%",
      growth: "+4%"
    },
    {
      id: 6,
      name: "Hamas",
      views: "850K",
      engagement: "88%",
      growth: "+9%"
    }
  ];

  // Extended data for detailed view
  const topicDetails = {
    1: {
      name: "Ozzy",
      description: "Ozzy Osbourne, the Prince of Darkness, continues to trend as fans celebrate his legendary career in heavy metal music.",
      views: "2.4M",
      engagement: "85%",
      growth: "+12%",
      reach: "5.2M",
      shares: "45K",
      comments: "12K",
      relatedTopics: ["Black Sabbath", "Heavy Metal", "Rock Music", "Prince of Darkness"],
      subtopics: [
        { name: "Crazy Train", views: "890K", engagement: "92%", growth: "+18%" },
        { name: "Paranoid", views: "650K", engagement: "88%", growth: "+14%" },
        { name: "Iron Man", views: "520K", engagement: "85%", growth: "+11%" }
      ]
    },
    2: {
      name: "Black Sabbath",
      description: "The iconic heavy metal band Black Sabbath is trending as fans reminisce about their groundbreaking contributions to music.",
      views: "1.8M",
      engagement: "78%",
      growth: "+8%",
      reach: "3.8M",
      shares: "32K",
      comments: "8.5K",
      relatedTopics: ["Ozzy", "Heavy Metal", "Tony Iommi", "Paranoid"],
      subtopics: [
        { name: "Tony Iommi", views: "720K", engagement: "85%", growth: "+12%" },
        { name: "War Pigs", views: "580K", engagement: "82%", growth: "+9%" },
        { name: "Children of the Grave", views: "420K", engagement: "79%", growth: "+7%" }
      ]
    },
    3: {
      name: "Gaza",
      description: "Current events in Gaza continue to generate significant discussion and engagement across social media platforms.",
      views: "1.5M",
      engagement: "92%",
      growth: "+15%",
      reach: "4.1M",
      shares: "67K",
      comments: "28K",
      relatedTopics: ["Middle East", "Politics", "News", "Humanitarian"],
      subtopics: [
        { name: "Humanitarian Aid", views: "680K", engagement: "95%", growth: "+22%" },
        { name: "Peace Talks", views: "520K", engagement: "89%", growth: "+16%" },
        { name: "International Response", views: "410K", engagement: "87%", growth: "+13%" }
      ]
    },
    4: {
      name: "#15YearsOfOneDirection",
      description: "Fans celebrate 15 years since the formation of One Direction, sharing memories and nostalgic content.",
      views: "1.2M",
      engagement: "89%",
      growth: "+6%",
      reach: "2.9M",
      shares: "38K",
      comments: "15K",
      relatedTopics: ["One Direction", "Harry Styles", "Niall Horan", "Boy Bands"],
      subtopics: [
        { name: "Harry Styles", views: "580K", engagement: "91%", growth: "+8%" },
        { name: "Niall Horan", views: "420K", engagement: "87%", growth: "+5%" },
        { name: "What Makes You Beautiful", views: "320K", engagement: "84%", growth: "+3%" }
      ]
    },
    5: {
      name: "MAEWNAM IS THE WAN",
      description: "A trending phrase that has captured attention across social media platforms with high engagement rates.",
      views: "980K",
      engagement: "76%",
      growth: "+4%",
      reach: "2.1M",
      shares: "22K",
      comments: "6.8K",
      relatedTopics: ["Viral", "Social Media", "Trending", "Internet Culture"],
      subtopics: [
        { name: "Viral Memes", views: "380K", engagement: "82%", growth: "+6%" },
        { name: "Social Media Trends", views: "290K", engagement: "78%", growth: "+4%" },
        { name: "Internet Culture", views: "210K", engagement: "75%", growth: "+2%" }
      ]
    },
    6: {
      name: "Hamas",
      description: "Ongoing discussions about Hamas continue to generate significant social media activity and engagement.",
      views: "850K",
      engagement: "88%",
      growth: "+9%",
      reach: "1.9M",
      shares: "41K",
      comments: "18K",
      relatedTopics: ["Middle East", "Politics", "Current Events", "International News"],
      subtopics: [
        { name: "Political Analysis", views: "320K", engagement: "90%", growth: "+12%" },
        { name: "Regional Impact", views: "280K", engagement: "86%", growth: "+8%" },
        { name: "International Relations", views: "220K", engagement: "83%", growth: "+6%" }
      ]
    }
  };

  // Check if we're in detail view based on URL parameter
  useEffect(() => {
    if (topicId && topicDetails[topicId]) {
      setIsDetailView(true);
      setSelectedTopic(topicDetails[topicId]);
    } else {
      setIsDetailView(false);
      setSelectedTopic(null);
    }
  }, [topicId]);

  // If we're in detail view, show the topic detail page
  if (isDetailView && selectedTopic) {
    return (
      <Container>
        <Content>
          <Header>
            <BackButton onClick={() => navigate('/trend-strategy')}>
              ← Back to Dashboard
            </BackButton>
            <ModalTitle>{selectedTopic.name}</ModalTitle>
            <Description>{selectedTopic.description}</Description>
          </Header>

          <SubtopicsSection>
            <SubtopicsTitle>Top 3 Trending Subtopics</SubtopicsTitle>
            <SubtopicsGrid>
              {selectedTopic.subtopics.map((subtopic, index) => (
                <SubtopicCard key={index}>
                  <SubtopicRank>{index + 1}</SubtopicRank>
                  <SubtopicName>{subtopic.name}</SubtopicName>
                  <SubtopicMetrics>
                    <SubtopicMetric>
                      <SubtopicMetricValue>{subtopic.views}</SubtopicMetricValue>
                      <SubtopicMetricLabel>Views</SubtopicMetricLabel>
                    </SubtopicMetric>
                    <SubtopicMetric>
                      <SubtopicMetricValue>{subtopic.engagement}</SubtopicMetricValue>
                      <SubtopicMetricLabel>Engagement</SubtopicMetricLabel>
                    </SubtopicMetric>
                    <SubtopicMetric>
                      <SubtopicMetricValue>{subtopic.growth}</SubtopicMetricValue>
                      <SubtopicMetricLabel>Growth</SubtopicMetricLabel>
                    </SubtopicMetric>
                  </SubtopicMetrics>
                </SubtopicCard>
              ))}
            </SubtopicsGrid>
          </SubtopicsSection>
          
          <DetailGrid>
            <DetailCard>
              <DetailLabel>Views</DetailLabel>
              <DetailValue>{selectedTopic.views}</DetailValue>
            </DetailCard>
            <DetailCard>
              <DetailLabel>Engagement</DetailLabel>
              <DetailValue>{selectedTopic.engagement}</DetailValue>
            </DetailCard>
            <DetailCard>
              <DetailLabel>Growth</DetailLabel>
              <DetailValue>{selectedTopic.growth}</DetailValue>
            </DetailCard>
            <DetailCard>
              <DetailLabel>Reach</DetailLabel>
              <DetailValue>{selectedTopic.reach}</DetailValue>
            </DetailCard>
            <DetailCard>
              <DetailLabel>Shares</DetailLabel>
              <DetailValue>{selectedTopic.shares}</DetailValue>
            </DetailCard>
            <DetailCard>
              <DetailLabel>Comments</DetailLabel>
              <DetailValue>{selectedTopic.comments}</DetailValue>
            </DetailCard>
          </DetailGrid>

          <RelatedTopics>
            <RelatedTitle>Related Topics</RelatedTitle>
            <RelatedList>
              {selectedTopic.relatedTopics.map((topic, index) => (
                <RelatedTag key={index}>{topic}</RelatedTag>
              ))}
            </RelatedList>
          </RelatedTopics>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        <Header>
          <Title>Trend Dashboard</Title>
          <Subtitle>Analyze and filter trending content across different categories and formats</Subtitle>
        </Header>

        <FilterSection>
          <FilterGroup>
            <FilterLabel>Topic Category</FilterLabel>
            <FilterSelect 
              value={topicCategory} 
              onChange={(e) => setTopicCategory(e.target.value)}
            >
              {topicCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Content Type</FilterLabel>
            <FilterSelect 
              value={contentType} 
              onChange={(e) => setContentType(e.target.value)}
            >
              {contentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>
        </FilterSection>

        <TrendingTopicsSection>
          <SectionTitle>Top 6 Trending Topics</SectionTitle>
          <TrendingTopicsGrid>
            {trendingTopics.map((topic, index) => (
              <TopicCard 
                key={topic.id} 
                onClick={() => navigate(`/topic/${topic.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <TopicRank>{index + 1}</TopicRank>
                <TopicName>{topic.name}</TopicName>
                <TopicStats>
                  <TopicMetric>
                    <MetricValue>{topic.views}</MetricValue>
                    <MetricLabel>Views</MetricLabel>
                  </TopicMetric>
                  <TopicMetric>
                    <MetricValue>{topic.engagement}</MetricValue>
                    <MetricLabel>Engagement</MetricLabel>
                  </TopicMetric>
                  <TopicMetric>
                    <MetricValue>{topic.growth}</MetricValue>
                    <MetricLabel>Growth</MetricLabel>
                  </TopicMetric>
                </TopicStats>
              </TopicCard>
            ))}
          </TrendingTopicsGrid>
        </TrendingTopicsSection>

        <DashboardGrid>
          <DashboardCard>
            <CardTitle>Trending Topics</CardTitle>
            <CardContent>
              Based on your selected filters, here are the top trending topics:
            </CardContent>
            <StatsGrid>
              <StatItem>
                <StatValue>24</StatValue>
                <StatLabel>Active Trends</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>1.2M</StatValue>
                <StatLabel>Total Views</StatLabel>
              </StatItem>
            </StatsGrid>
          </DashboardCard>

          <DashboardCard>
            <CardTitle>Engagement Metrics</CardTitle>
            <CardContent>
              Performance insights for your selected category and content type:
            </CardContent>
            <StatsGrid>
              <StatItem>
                <StatValue>85%</StatValue>
                <StatLabel>Engagement Rate</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>2.4K</StatValue>
                <StatLabel>Avg. Shares</StatLabel>
              </StatItem>
            </StatsGrid>
          </DashboardCard>

          <DashboardCard>
            <CardTitle>Content Recommendations</CardTitle>
            <CardContent>
              Suggested content strategies based on current trends and your filters.
            </CardContent>
          </DashboardCard>

          <DashboardCard>
            <CardTitle>Audience Insights</CardTitle>
            <CardContent>
              Demographic and behavioral data for your target audience.
            </CardContent>
          </DashboardCard>
        </DashboardGrid>
      </Content>
    </Container>
  );
}

export default TrendStrategy; 