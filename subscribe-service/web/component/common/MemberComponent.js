import styled from "styled-components";
import { fontWeight } from "./CommonComponent";

export const Title = styled.h1`
  margin-top: 80px;
  font-size: 28px;
  font-weight: ${fontWeight("medium")};
  color: #232323;
`;

export const Input = styled.input`
  height: 56px;
  width: 364px;
  border: none;
  border-bottom: 1px solid #dbdbdb;
  padding: 0 10px;
  ::placeholder {
    font-size: 16px;
    font-weight: normal;
    color: #767676;
  }
`;

export const NoticeInfo = styled.p`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: normal;
  text-align: left;
  color: #dc5f00;
  margin: 4px 0 16px 0;
`;

export const Button = styled.button`
  width: 364px;
  height: 56px;
  border-radius: 12px;
  background-color: ${(props) => props.background};
  color: ${(props) => props.color};
  border: ${(props) => props.border};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;

