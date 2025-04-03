import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  display: flex;
  justify-content: center;
  flex: 1;
`;

const MessagesWrapper = styled.div`
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 24px;
  width: 80%;
  max-width: 1000px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const MessageCard = styled.div`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dcdcdc;
  background-color: #ffffff;
  transition: background-color 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #e8e8e8;
  }
`;

const CharityName = styled.div`
  font-weight: 500;
  flex: 1;
`;

const Category = styled.div`
  flex: 1;
  color: #666;
`;

const Amount = styled.div`
  flex: 1;
  font-weight: 500;
`;

const Actions = styled.div`
  width: 40px;
  text-align: center;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #FD3E6E;
  }
`;

const Messages = () => {
  const messages = [
    { id: 1, name: 'Charity Matlapo', category: 'Healthcare', amount: 'R10 000' },
    { id: 2, name: 'Charity Matlapo', category: 'Healthcare', amount: 'R10 000' },
    { id: 3, name: 'Charity Matlapo', category: 'Healthcare', amount: 'R10 000' },
  ];

  return (
    <Container>
      <MessagesWrapper>
        {messages.map((message) => (
          <MessageCard key={message.id}>
            <CharityName>{message.name}</CharityName>
            <Category>{message.category}</Category>
            <Amount>{message.amount}</Amount>
            <Actions>•••</Actions>
          </MessageCard>
        ))}
      </MessagesWrapper>
    </Container>
  );
};

export default Messages;