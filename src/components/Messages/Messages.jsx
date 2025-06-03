import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const Container = styled.div`
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center; /* Added to center vertically */
  flex: 1;
  position: relative;
  margin-top: 40px; /* Increased from 44px to match header height */
  width: calc(100% - 250px); /* Account for sidebar */
  margin-left: auto;
`;

const MessagesWrapper = styled.div`
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 800px;
  height: 100%; /* Add fixed minimum height */
  height: calc(100vh - 200px); /* Fixed height */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  .messages-content {
    flex: 1;
    overflow-y: auto; /* Move scroll to inner container */
    margin-right: -8px; /* Compensate for scrollbar */
    padding-right: 8px; /* Add padding to prevent content shift */

    /* Custom scrollbar styling */
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: #ddd;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #ccc;
    }
  }
`;

const MessageCard = styled.div`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dcdcdc;
  background-color: #ffffff;
  transition: background-color 0.2s ease;
  text-align: center; /* Center text content */
  gap: 8px; /* Add gap between elements */
  position: relative;

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
  text-align: center;
`;

const Category = styled.div`
  flex: 1;
  color: #666;
  text-align: center;
`;

const Amount = styled.div`
  flex: 1;
  font-weight: 500;
  text-align: center;
`;

const Actions = styled.div`
  width: 40px;
  text-align: center;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #fd3e6e;
  }
`;

// Add Time styled component
const TimeContainer = styled.div`
  flex: 0.5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const Time = styled.div`
  color: #888;
  font-size: 12px;
`;

const Date = styled.div`
  color: #999;
  font-size: 11px;
`;

// Add these styled components after your existing styled components
const SearchFilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 16px;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 8px 12px;
  flex: 1;
  border: 1px solid #ddd;

  input {
    border: none;
    outline: none;
    width: 100%;
    margin-left: 8px;
    font-size: 14px;
    color: #333;

    &::placeholder {
      color: #999;
    }
  }
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: white;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  outline: none;

  &:hover {
    border-color: #bbb;
  }
`;

const FeedbackPopup = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 16px 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: slideIn 0.3s ease;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);

  &.success {
    background-color: #4CAF50;
    color: white;
  }

  &.error {
    background-color: #f44336;
    color: white;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

// Add these new styled components after your existing styled components
const PopupMenu = styled.div`
  position: absolute;
  right: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  padding: 8px 0;
  min-width: 150px;
  z-index: 1000;
`;

const MenuItem = styled.div`
  padding: 8px 16px;
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }

  &.delete {
    color: #f44336;
  }
`;

// Add these styled components after PopupMenu and MenuItem
const MessageDetail = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid #eee;

    .left {
      .name {
        font-weight: 600;
        font-size: 18px;
        margin-bottom: 4px;
      }
      .metadata {
        color: #666;
        font-size: 12px;
      }
    }

    .close-button {
      cursor: pointer;
      padding: 8px;
      color: #666;
      &:hover {
        color: #fd3e6e;
      }
    }
  }

  .content {
    color: #333;
    line-height: 1.6;
    margin-bottom: 24px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #eee;
`;

const ActionButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &.approve {
    background-color: #4CAF50;
    color: white;
    
    &:hover {
      background-color: #43A047;
    }
  }

  &.decline {
    background-color: #f44336;
    color: white;

    &:hover {
      background-color: #e53935;
    }
  }

  svg {
    font-size: 20px;
  }
`;

// Update mockMessages to include read status
const mockMessages = [
  { 
    id: 1, 
    name: 'Charity Matlapo', 
    category: 'Healthcare', 
    amount: 'R10 000', 
    time: '10:30 AM', 
    date: '2 Jun 2025',
    read: false,
    content: 'Dear NANA team, I am requesting funds for medical supplies needed at our local clinic. The supplies will help us serve over 100 patients daily. Please review the attached documentation for details.' 
  },
  { id: 2, name: 'John Smith', category: 'Education', amount: 'R5 000', time: '11:45 AM', date: '2 Jun 2025', read: true, content: 'Dear NANA team, I would like to express my gratitude for the support received. The funds have been instrumental in advancing our educational programs.' },
  { id: 3, name: 'Sarah Johnson', category: 'Baby Care', amount: 'R3 500', time: '12:15 PM', date: '1 Jun 2025', read: false, content: 'Dear NANA team, we are in urgent need of baby formula and diapers for our upcoming distribution. Your prompt assistance will be greatly appreciated.' },
  { id: 4, name: 'Michael Brown', category: 'Entertainment', amount: 'R2 000', time: '1:30 PM', date: '31 May 2025', read: true, content: 'Dear NANA, thank you for the generous contribution. Our community event was a success, and everyone enjoyed the entertainment provided.' },
  { id: 5, name: 'Emma Davis', category: 'Healthcare', amount: 'R8 000', time: '2:45 PM', date: '30 May 2025', read: false, content: 'Dear NANA team, we have identified more patients in need of urgent medical attention. Additional funds are required to cater to these patients.' },
  { id: 6, name: 'James Wilson', category: 'Education', amount: 'R6 000', time: '3:20 PM', date: '29 May 2025', read: true, content: 'Dear NANA, the educational materials provided have significantly impacted our students\' learning. We are immensely grateful for your support.' },
  { id: 7, name: 'Sophie Taylor', category: 'Baby Care', amount: 'R4 500', time: '4:10 PM', date: '28 May 2025', read: false, content: 'Dear NANA team, we are running low on baby supplies for our outreach programs. Your assistance in replenishing these supplies is crucial.' },
  { id: 8, name: 'Oliver Moore', category: 'Entertainment', amount: 'R1 500', time: '4:55 PM', date: '27 May 2025', read: true, content: 'Dear NANA, your support has brought joy to many in our community. We look forward to more collaborations in the future.' },
  { id: 9, name: 'Isabella Clark', category: 'Healthcare', amount: 'R7 000', time: '5:30 PM', date: '26 May 2025', read: false, content: 'Dear NANA team, we have an urgent case that requires immediate medical intervention. Additional funds are needed to facilitate this.' },
  { id: 10, name: 'William Lee', category: 'Education', amount: 'R5 500', time: '6:15 PM', date: '25 May 2025', read: true, content: 'Dear NANA, the impact of your contribution is evident in the smiles of the children we serve. Thank you for making a difference.' },
];

// Update the Messages component
const Messages = () => {
  // Add message state to track all messages
  const [messages, setMessages] = useState(mockMessages);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [activePopup, setActivePopup] = useState(null);

  // Update filtered messages to use messages state instead of mockMessages
  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
      (filter === 'read' && message.read) || 
      (filter === 'unread' && !message.read);
    
    return matchesSearch && matchesFilter;
  });

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, []);

  // Update handleMessageClick to modify messages state
  const handleMessageClick = useCallback((message) => {
    setSelectedMessage(message);
    // Mark message as read when clicked
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === message.id ? { ...msg, read: true } : msg
      )
    );
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedMessage(null);
  }, []);

  // Add feedback handler
  const handleFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000); // Hide after 3 seconds
  };

  // Add approve/decline handlers
  const handleApprove = () => {
    handleFeedback('success', `Request from ${selectedMessage.name} approved successfully`);
    setSelectedMessage(null);
    // Update messages to mark as approved if needed
  };

  const handleDecline = () => {
    handleFeedback('error', `Request from ${selectedMessage.name} declined`);
    setSelectedMessage(null);
    // Update messages to mark as declined if needed
  };

  // Add popup handlers
  const handleDotsClick = (e, messageId) => {
    e.stopPropagation(); // Prevent message from opening
    setActivePopup(activePopup === messageId ? null : messageId);
  };

  const handleDelete = (e, messageId) => {
    e.stopPropagation();
    setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
    setActivePopup(null);
    handleFeedback('error', 'Request deleted');
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActivePopup(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <Container>
      <MessagesWrapper>
        <SearchFilterContainer>
          <SearchBox>
            <SearchIcon sx={{ color: '#666', fontSize: 20 }} />
            <input 
              type="text" 
              placeholder="Search by name..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </SearchBox>
          <FilterSelect value={filter} onChange={handleFilterChange}>
            <option value="all">All Messages</option>
            <option value="read">Read</option>
            <option value="unread">Unread</option>
          </FilterSelect>
        </SearchFilterContainer>

        {!selectedMessage ? (
          <div className="messages-content">
            {filteredMessages.map((message) => (
              <MessageCard 
                key={message.id} 
                style={{ 
                  backgroundColor: message.read ? '#fff' : '#f8f9fa',
                  cursor: 'pointer'
                }}
                onClick={() => handleMessageClick(message)}
              >
                <CharityName>{message.name}</CharityName>
                <Category>{message.category}</Category>
                <Amount>{message.amount}</Amount>
                <TimeContainer>
                  <Time>{message.time}</Time>
                  <Date>{message.date}</Date>
                </TimeContainer>
                <Actions onClick={(e) => handleDotsClick(e, message.id)}>
                  •••
                  {activePopup === message.id && (
                    <PopupMenu onClick={e => e.stopPropagation()}>
                      <MenuItem onClick={() => handleMessageClick(message)}>
                        Open Request
                      </MenuItem>
                      <MenuItem 
                        className="delete" 
                        onClick={(e) => handleDelete(e, message.id)}
                      >
                        Delete Request
                      </MenuItem>
                    </PopupMenu>
                  )}
                </Actions>
              </MessageCard>
            ))}
          </div>
        ) : (
          <MessageDetail>
            <div className="header">
              <div className="left">
                <div className="name">{selectedMessage.name}</div>
                <div className="metadata">
                  {selectedMessage.category} • {selectedMessage.amount} • 
                  {selectedMessage.date} {selectedMessage.time}
                </div>
              </div>
              <div className="close-button" onClick={handleCloseDetail}>
                ✕
              </div>
            </div>
            <div className="content">
              {selectedMessage.content}
            </div>
            <ActionButtons>
              <ActionButton 
                className="approve"
                onClick={handleApprove}
              >
                <CheckCircleIcon />
                Approve Request
              </ActionButton>
              <ActionButton 
                className="decline"
                onClick={handleDecline}
              >
                <CancelIcon />
                Decline Request
              </ActionButton>
            </ActionButtons>
          </MessageDetail>
        )}

        {feedback && (
          <FeedbackPopup className={feedback.type}>
            {feedback.message}
          </FeedbackPopup>
        )}
      </MessagesWrapper>
    </Container>
  );
};

export default Messages;