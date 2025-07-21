import { useState, useEffect } from 'react';
import { Issue, Message } from '../types';

export const useIssues = (customerId?: string) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchIssues = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockIssues: Issue[] = [
        {
          id: '1',
          title: 'Login Issues',
          description: 'Unable to login to my account after password reset',
          status: 'open',
          priority: 'high',
          customerId: customerId || '1',
          agentId: 'agent-1',
          createdAt: new Date(Date.now() - 86400000),
          updatedAt: new Date(Date.now() - 3600000),
          messages: [
            {
              id: 'm1',
              content: 'I\'m having trouble logging in after resetting my password.',
              senderId: customerId || '1',
              senderName: 'Customer',
              senderRole: 'customer',
              timestamp: new Date(Date.now() - 86400000),
            },
            {
              id: 'm2',
              content: 'I can help you with that. Let me check your account settings.',
              senderId: 'agent-1',
              senderName: 'Sarah Johnson',
              senderRole: 'agent',
              timestamp: new Date(Date.now() - 82800000),
            },
          ],
        },
        {
          id: '2',
          title: 'Billing Question',
          description: 'Question about my subscription plan and pricing',
          status: 'resolved',
          priority: 'medium',
          customerId: customerId || '1',
          createdAt: new Date(Date.now() - 172800000),
          updatedAt: new Date(Date.now() - 86400000),
          messages: [],
        },
      ];
      
      setIssues(mockIssues);
      setLoading(false);
    };

    fetchIssues();
  }, [customerId]);

  const createIssue = async (title: string, description: string, priority: Issue['priority']) => {
    const newIssue: Issue = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      status: 'open',
      priority,
      customerId: customerId || '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    };
    
    setIssues(prev => [newIssue, ...prev]);
    return newIssue;
  };

  const addMessage = (issueId: string, content: string, senderId: string, senderName: string, senderRole: 'customer' | 'agent') => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      senderId,
      senderName,
      senderRole,
      timestamp: new Date(),
    };

    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { ...issue, messages: [...issue.messages, newMessage], updatedAt: new Date() }
        : issue
    ));
  };

  return { issues, loading, createIssue, addMessage };
};