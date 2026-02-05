import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { FolderTree, Play, Code2, CheckCircle2, Loader2, ChevronRight, ChevronDown, File } from 'lucide-react';
import axios from 'axios';
import { backendUrl } from '../config';
import { FileItem, Step, StepType } from '../types';
import { parseXml } from '../steps';

// FileExplorer component that can handle any nested structure
const FileExplorer: React.FC<{
  files: FileItem[];
  selectedFile: FileItem | null;
  onFileSelect: (file: FileItem) => void;
  level?: number;
}> = ({ files, selectedFile, onFileSelect, level = 0 }) => {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['/src'])); // Default expand src folder

  const toggleExpand = (path: string) => {
    setExpandedPaths(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const renderFileItem = (file: FileItem) => {
    const isFolder = file.type === 'folder';
    const isExpanded = expandedPaths.has(file.path);
    const hasChildren = file.children && file.children.length > 0;

    return (
      <div key={file.path}>
        <button
          onClick={() => isFolder ? toggleExpand(file.path) : onFileSelect(file)}
          className={`w-full text-left py-1 px-2 rounded flex items-center hover:bg-[#21262d] ${
            !isFolder && selectedFile?.path === file.path ? 'bg-[#1f6feb] text-white' : 'text-[#8b949e]'
          }`}
          style={{ paddingLeft: `${(level * 12) + 8}px` }}
        >
          {isFolder && hasChildren && (
            isExpanded ? 
              <ChevronDown className="w-4 h-4 mr-1" /> :
              <ChevronRight className="w-4 h-4 mr-1" />
          )}
          {isFolder ? (
            <FolderTree className="w-4 h-4 mr-2 text-[#58a6ff]" />
          ) : (
            <File className="w-4 h-4 mr-2" />
          )}
          <span className="text-sm overflow-hidden text-ellipsis whitespace-nowrap">
            {file.name}
          </span>
        </button>
        
        {isFolder && isExpanded && file.children && (
          <div>
            {file.children.map(child => renderFileItem({
              ...child,
              path: `${file.path}/${child.name}`
            }))}
          </div>
        )}
      </div>
    );
  };

  return <div className="space-y-0">{files.map(file => renderFileItem(file))}</div>;
};

const BuilderPage = () => {
  const location = useLocation();
  const user_prompt = location.state?.prompt as string;
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [mockFiles, setMockFiles] = useState<FileItem[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);

  const getFileLanguage = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      default:
        return 'plaintext';
    }
  };

  useEffect(() => {
    let originalFiles = [...mockFiles];
    let updateHappened = false;

    steps.filter(({status}) => status === "pending").forEach(step => {
      if (step?.type === StepType.CreateFile && step.path) {
        updateHappened = true;
        const pathParts = step.path.split('/').filter(Boolean);
        
        // Create or update file in the structure
        let currentLevel = originalFiles;
        let currentPath = '';
        
        pathParts.forEach((part, index) => {
          currentPath = currentPath ? `${currentPath}/${part}` : `/${part}`;
          const isLastPart = index === pathParts.length - 1;
          
          if (isLastPart) {
            // Handle file
            const fileIndex = currentLevel.findIndex(item => item.path === currentPath);
            const fileItem = {
              name: part,
              type: 'file' as "file",
              path: currentPath,
              content: step.code
            };
            
            if (fileIndex === -1) {
              currentLevel.push(fileItem);
            } else {
              currentLevel[fileIndex] = fileItem;
            }
          } else {
            // Handle folder
            let folder = currentLevel.find(item => item.path === currentPath);
            
            if (!folder) {
              folder = {
                name: part,
                type: 'folder',
                path: currentPath,
                children: []
              };
              currentLevel.push(folder);
            }
            
            currentLevel = folder.children || [];
          }
        });
      }
    });

    if (updateHappened) {
      setMockFiles(originalFiles);
      setSteps(steps => steps.map(s => ({ ...s, status: "completed" })));
    }
  }, [steps, mockFiles]);

  const init = async (user_prompt: string) => {
    try {
      const response = await axios.post(`${backendUrl}/tamplet`, {promt: user_prompt});
      const prompts = response.data.promt;
      const uiPrompts = response.data.uipromt[0];
      const stepsFromXml = parseXml(uiPrompts);
      setSteps(stepsFromXml);
      
      const chat_response = await axios.post(`${backendUrl}/chat`, {
        message: [...prompts, user_prompt].map(x => ({
            role: "user",
            content: x,
          })),
      });
      setSteps((s) => [...s, ...parseXml(chat_response.data.answer)]);



    } catch (error) {
      console.error('Error initializing:', error);
    }
  };

  useEffect(() => {
    if (user_prompt) {
      init(user_prompt);
    }
  }, [user_prompt]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex">
      {/* Left Sidebar - Steps */}
      <div className="w-80 bg-[#161b22] p-6 overflow-y-auto border-r border-[#30363d]">
        <h2 className="text-xl font-bold mb-6 text-[#f0f6fc]">Build Progress</h2>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className={`absolute left-[15px] top-[30px] w-[2px] h-[calc(100%+24px)] ${
                  step.status === 'completed' ? 'bg-[#238636]' : 'bg-[#30363d]'
                }`} />
              )}
              <div className="flex items-start space-x-4">
                <div className="relative z-10">
                  {step.status === 'completed' && (
                    <CheckCircle2 className="w-8 h-8 text-[#238636]" />
                  )}
                  {step.status === 'in-progress' && (
                    <div className="rounded-full bg-[#1f6feb] p-1">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                  {step.status === 'pending' && (
                    <div className="w-8 h-8 rounded-full border-2 border-[#30363d]" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium mb-1 ${
                    step.status === 'completed' ? 'text-[#f0f6fc]' :
                    step.status === 'in-progress' ? 'text-[#58a6ff]' :
                    'text-[#8b949e]'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#8b949e]">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <div className="bg-[#161b22] p-4 flex space-x-4 border-b border-[#30363d]">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center space-x-2 px-4 py-2 rounded ${
              activeTab === 'code'
                ? 'bg-[#238636] text-white'
                : 'text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <Code2 className="w-5 h-5" />
            <span>Code</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center space-x-2 px-4 py-2 rounded ${
              activeTab === 'preview'
                ? 'bg-[#238636] text-white'
                : 'text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <Play className="w-5 h-5" />
            <span>Preview</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex">
          {/* File Explorer */}
          <div className="w-64 bg-[#161b22] border-r border-[#30363d] p-4">
            <div className="flex items-center space-x-2 mb-4">
              <FolderTree className="w-5 h-5 text-[#58a6ff]" />
              <h3 className="font-semibold text-[#f0f6fc]">Files</h3>
            </div>
            <FileExplorer
              files={mockFiles}
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
            />
          </div>

          {/* Editor/Preview */}
          <div className="flex-1 bg-[#0d1117]">
            {activeTab === 'code' && selectedFile ? (
              <Editor
                height="100%"
                defaultLanguage={getFileLanguage(selectedFile.name)}
                value={selectedFile.content}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  readOnly: true
                }}
                onChange={(value) => {
                  if (selectedFile && value) {
                    const updatedFile = { ...selectedFile, content: value };
                    setSelectedFile(updatedFile);
                  }
                }}
              />
            ) : activeTab === 'preview' ? (
              <div className="w-full h-full flex items-center justify-center text-[#8b949e]">
                Preview will be shown here
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#8b949e]">
                Select a file to view its contents
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;