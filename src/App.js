import React, { useEffect, useState } from 'react';
import HeroSection from './components/HeroSection';
import PackedBubbleChart from './components/PackedBubbleChart';
import Navigation from './components/Navigation';
import styled from 'styled-components';
import Papa from 'papaparse';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RawData from './components/RawData';
import TrendStrategy from './components/TrendStrategy';

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  gap: 2vw;
  padding-top: 60px;
`;

const LeftSection = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 6vh;
  padding-left: 6vh;
`;

const RightSection = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  padding-top: 6vh;
  padding-left: 8vw;
`;

const HeroContainer = styled.section`
  margin-top: 4vh;
`;

function App() {
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    fetch('/top_20_trends_2025-07-24_153717.csv')
      .then(res => res.text())
      .then(csv => {
        const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true }).data;
        const sorted = parsed
          .filter(d => d.keyword && d.TrendScore && !isNaN(Number(d.TrendScore)))
          .sort((a, b) => Number(b.TrendScore) - Number(a.TrendScore))
          .slice(0, 15)
          .map((d, i) => ({ keyword: d.keyword, score: Number(d.TrendScore), rank: i + 1 }));
        setTrendData(sorted);
      });
  }, []);

  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={
          <MainContainer>
            <LeftSection>
              <HeroContainer>
                <HeroSection />
              </HeroContainer>
            </LeftSection>
            <RightSection>
              <PackedBubbleChart data={trendData} />
            </RightSection>
          </MainContainer>
        } />
        <Route path="/raw-data" element={<RawData />} />
        <Route path="/trend-strategy" element={<TrendStrategy />} />
        <Route path="/topic/:topicId" element={<TrendStrategy />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
