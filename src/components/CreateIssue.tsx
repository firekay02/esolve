import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../hooks/useIssues';
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Issue } from '../types';

interface CreateIssueProps {
  onIssueCreated: () => void;
}

export const CreateIssue: React.FC<CreateIssueProps> = ({ onIssueCreated }) => {
  const { user } = useAuth();
  const { createIssue } = useIssues(user?.id);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Issue['priority']>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    
    try {
      await createIssue(title.trim(), description.trim(), priority);
      setIsSuccess(true);
      
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      
      // Redirect after success
      setTimeout(() => {
        onIssueCreated();
      }, 2000);
    } catch (error) {
      console.error('Failed to create issue:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Issue Created Successfully!</h2>
        <p className="text-gray-600 mb-6">
          Your support request has been submitted. Our team will review it and get back to you soon.
        </p>
        <button
          onClick={onIssueCreated}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Issues
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Create Support Issue</h2>
        <p className="text-sm text-gray-600 mt-1">Describe your problem and we'll help you resolve it</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Issue Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief description of your issue"
            required
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
            Priority Level
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Issue['priority'])}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="low">Low - General questions</option>
            <option value="medium">Medium - Standard issues</option>
            <option value="high">High - Important problems</option>
            <option value="urgent">Urgent - Critical issues</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Please provide as much detail as possible about your issue, including steps to reproduce, error messages, and any relevant information..."
            required
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Tips for faster resolution:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-600">
                <li>Include specific error messages if any</li>
                <li>Mention which browser/device you're using</li>
                <li>Describe what you were trying to do when the issue occurred</li>
                <li>Include screenshots if helpful</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onIssueCreated}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !description.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              'Create Issue'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};