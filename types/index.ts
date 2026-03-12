export type NodeType = 'variable' | 'lever' | 'exogenous';

export type SourceType = 'web' | 'upload' | 'user' | 'ai_inference';

export interface Source {
  type: SourceType;
  title: string;
  url?: string;
  file_name?: string;
  excerpt?: string;
}

export interface SystemNode {
  id: string;
  label: string;
  type: NodeType;
  description: string;
  sources: Source[];
}

export interface SystemEdge {
  id: string;
  source: string;
  target: string;
  polarity: '+' | '-';
  loop_label?: string;
  description: string;
  sources: Source[];
}

export interface Project {
  id: string;
  prompt: string;
  nodes: SystemNode[];
  edges: SystemEdge[];
  sources: Source[];
  share_slug: string | null;
  status: 'pending' | 'generating' | 'ready' | 'error';
  created_at: string;
  updated_at: string;
}

export interface Upload {
  id: string;
  project_id: string;
  file_name: string;
  storage_key: string;
  extracted_text: string | null;
  created_at: string;
}
