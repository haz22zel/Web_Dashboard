import styled from 'styled-components';

const HeroContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  min-height: 35vh;
  padding-top: 2vh;
`;

const Title = styled.h1`
  font-size: 6rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: #fff;
  margin-bottom: 0;
  font-family: 'Inter', sans-serif;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #b0b8c1;
  margin-bottom: 0.5em;
  font-family: 'Inter', sans-serif;
`;

function HeroSection() {
  return (
    <HeroContainer>
      <Title>ASTRA</Title>
      <Description>Dig into global trends for your contents creation</Description>
    </HeroContainer>
  );
}

export default HeroSection; 