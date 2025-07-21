import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { IssueList } from './IssueList';
import { CreateIssue } from './CreateIssue';
import { IssueDetail } from './IssueDetail';
import { PaymentPlans } from './PaymentPlans';
import { 
  TicketIcon, 
  Plus, 
  CreditCard, 
  LogOut, 
  User,
  Bell,
  Settings
} from 'lucide-react';
import { Issue } from '../types';

type ActiveView = 'issues' | 'create' | 'payment' | 'issue-detail';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<ActiveView>('issues');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const handleIssueSelect = (issue: Issue) => {
    setSelectedIssue(issue);
    setActiveView('issue-detail');
  };

  const handleBackToIssues = () => {
    setSelectedIssue(null);
    setActiveView('issues');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TicketIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">SupportHub</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-sm p-4 space-y-2">
              <button
                onClick={() => setActiveView('issues')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeView === 'issues' || activeView === 'issue-detail'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <TicketIcon className="h-5 w-5 mr-3" />
                My Issues
              </button>
              
              <button
                onClick={() => setActiveView('create')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeView === 'create'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Plus className="h-5 w-5 mr-3" />
                Create Issue
              </button>
              
              <button
                onClick={() => setActiveView('payment')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeView === 'payment'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CreditCard className="h-5 w-5 mr-3" />
                Upgrade Plan
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeView === 'issues' && (
              <IssueList onIssueSelect={handleIssueSelect} />
            )}
            
            {activeView === 'create' && (
              <CreateIssue onIssueCreated={() => setActiveView('issues')} />
            )}
            
            {activeView === 'payment' && (
              <PaymentPlans />
            )}
            
            {activeView === 'issue-detail' && selectedIssue && (
              <IssueDetail 
                issue={selectedIssue} 
                onBack={handleBackToIssues}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};