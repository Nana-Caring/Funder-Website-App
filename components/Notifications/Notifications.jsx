import React from 'react';
import styled from 'styled-components';
import { PageContainer } from '../SharedStyles';
import CareGiverSidebar from '../CareGiverSidebar/CareGiverSidebar';
import Header from '../Header/Header';

const MainLayout = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
`;

const ContentArea = styled.div`
  margin-left: 250px;
  width: calc(100% - 250px);
  padding: 80px 24px 24px;
  background: #f8f9fa;
`;

const NotificationItem = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #f8f9fa;
  }
`;

const mockNotifications = [
  {
    id: 1,
    message: "New payment request received",
    time: "2 hours ago",
    isRead: false
  },
  {
    id: 2,
    message: "Monthly report is ready",
    time: "1 day ago",
    isRead: true
  }
];

const Notifications = () => {
  return (
    <MainLayout>
      <CareGiverSidebar />
      <ContentArea>
        <Header title="Notifications" />
        <div style={{ marginTop: '20px' }}>
          {mockNotifications.map((notification) => (
            <NotificationItem 
              key={notification.id}
              style={{ 
                backgroundColor: notification.isRead ? '#fff' : '#f8f9fa',
                borderLeft: notification.isRead ? 'none' : '4px solid #185c37'
              }}
            >
              <div>
                <h4 style={{ margin: '0 0 8px 0' }}>{notification.message}</h4>
                <span style={{ color: '#666', fontSize: '12px' }}>{notification.time}</span>
              </div>
            </NotificationItem>
          ))}
        </div>
      </ContentArea>
    </MainLayout>
  );
};

export default Notifications;