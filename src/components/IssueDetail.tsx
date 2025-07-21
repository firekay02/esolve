import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../hooks/useIssues';
import { 
  ArrowLeft, 
  Send, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  User,
  Bot
} from 'lucide-react';
import { Issue } from '../types';

interface IssueDetailProps {
  issue: Issue;
  onBack: () => void;
}

export const IssueDetail: React.FC<IssueDetailProps> = ({ issue, onBack }) => {
  const { user } = useAuth();
  const { addMessage } = useIssues(user?.id);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const getStatusIcon = (status: Issue['status']) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'closed':
        return <XCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Issue['status']) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Issue['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    addMessage(
      issue.id,
      newMessage.trim(),
      user!.id,
      user!.name,
      'customer'
    );

    setNewMessage('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      addMessage(
        issue.id,
        "Thank you for your message. I'm reviewing this and will get back to you shortly with more information.",
        'agent-1',
        'Sarah Johnson',
        'agent'
      );
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Issues
          </button>
          
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(issue.priority)}`}>
              {issue.priority} priority
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(issue.status)}`}>
              {issue.status.replace('-', ' ')}
            </span>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          {getStatusIcon(issue.status)}
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">{issue.title}</h1>
            <p className="text-gray-600 mb-4">{issue.description}</p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Created {issue.createdAt.toLocaleDateString()}</span>
              </div>
              
              {issue.agentId && (
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Assigned to Sarah Johnson</span>
                </div>
              )}
              
              <span>Issue #{issue.id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="p-6">
        <div className="space-y-6 mb-6 max-h-96 overflow-y-auto">
          {issue.messages.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start the conversation</h3>
              <p className="text-gray-600">Send a message to get help with your issue.</p>
            </div>
          ) : (
            issue.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderRole === 'customer' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.senderRole === 'customer'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium">
                      {message.senderRole === 'customer' ? 'You' : message.senderName}
                    </span>
                    {message.senderRole === 'agent' && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Agent
                      </span>
                    )}
                  </div>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.senderRole === 'customer' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium">Sarah Johnson</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Agent
                  </span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};