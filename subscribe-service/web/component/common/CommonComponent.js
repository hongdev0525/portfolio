import styled from "styled-components";

import { device } from "component/common/GlobalComponent";

export const fontWeight = (weight) => {
  switch (weight) {
    case "black":
      return 900;
    case "extraBold":
      return 800;
    case "bold":
      return 700;
    case "semiBold":
      return 600;
    case "medium":
      return 500;
    case "regular":
      return 400;
    case "light":
      return 300;
    case "extraLight":
      return 200;
    case "thin":
      return 100;
    default:
      return 500;
  }
}
