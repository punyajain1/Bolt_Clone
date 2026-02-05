import { Step, StepType } from './types';

export function parseXml(response: string): Step[] {
  const codeBlockMatch = response.match(/```(?:html|xml)?\s*([\s\S]*?)```/);
  const xmlToProcess = codeBlockMatch ? codeBlockMatch[1] : response;

  const xmlMatch = xmlToProcess.match(/<boltArtifact[^>]*>([\s\S]*?)<\/boltArtifact>/);
  
  if (!xmlMatch) {
    return [];
  }

  const xmlContent = xmlMatch[1];
  const steps: Step[] = [];
  let stepId = 1;

  const titleMatch = xmlToProcess.match(/title="([^"]*)"/);
  const artifactTitle = titleMatch ? titleMatch[1] : 'Project Files';

  steps.push({
    id: stepId++,
    title: artifactTitle,
    description: '',
    type: StepType.CreateFolder,
    status: 'pending'
  });

  const actionRegex = /<boltAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?\s*>([\s\S]*?)<\/boltAction>/g;
  
  let match;
  while ((match = actionRegex.exec(xmlContent)) !== null) {
    const [, type, filePath, content] = match;

    if (type === 'file') {
      steps.push({
        id: stepId++,
        title: `Create ${filePath || 'file'}`,
        description: '',
        type: StepType.CreateFile,
        status: 'pending',
        code: content.trim(),
        path: filePath
      });
    } else if (type === 'shell') {
      steps.push({
        id: stepId++,
        title: 'Run command',
        description: '',
        type: StepType.RunScript,
        status: 'pending',
        code: content.trim()
      });
    }
  }

  return steps;
}