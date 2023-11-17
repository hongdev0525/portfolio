import styled from "styled-components";
import Experience from "component/subscribe/experience/Experience";

const ExperienceMainWrapper = styled.div`
  display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
`

function ExperienceMain() {
  return (
    <ExperienceMainWrapper>
      <Experience></Experience>
    </ExperienceMainWrapper>
  );
}

export default ExperienceMain;