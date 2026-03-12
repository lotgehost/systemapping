'use client';

import { create } from 'zustand';
import { Node, Edge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange, Connection, addEdge } from '@xyflow/react';
import { SystemNode, SystemEdge, Source } from '@/types';

export interface MapNodeData extends Record<string, unknown> {
  label: string;
  nodeType: string;
  description: string;
  sources: Source[];
}

export interface MapEdgeData extends Record<string, unknown> {
  relation_type: string;
  description: string;
  sources: Source[];
}

export type MapNode = Node<MapNodeData>;
export type MapEdge = Edge<MapEdgeData>;

interface MapStore {
  projectId: string | null;
  prompt: string;
  nodes: MapNode[];
  edges: MapEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  status: 'idle' | 'generating' | 'ready' | 'error';
  errorMessage: string;

  setProjectId: (id: string) => void;
  setPrompt: (prompt: string) => void;
  setStatus: (s: MapStore['status'], msg?: string) => void;
  loadFromProject: (nodes: SystemNode[], edges: SystemEdge[]) => void;

  onNodesChange: (changes: NodeChange<MapNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<MapEdge>[]) => void;
  onConnect: (connection: Connection) => void;

  addNode: (node: Omit<SystemNode, 'id'> & { id?: string }) => void;
  updateNodeData: (id: string, data: Partial<MapNodeData>) => void;
  updateEdgeData: (id: string, data: Partial<MapEdgeData>) => void;

  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
}

export const useMapStore = create<MapStore>((set, get) => ({
  projectId: null,
  prompt: '',
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  status: 'idle',
  errorMessage: '',

  setProjectId: (id) => set({ projectId: id }),
  setPrompt: (prompt) => set({ prompt }),
  setStatus: (status, errorMessage = '') => set({ status, errorMessage }),

  loadFromProject: (systemNodes, systemEdges) => {
    const flowNodes: MapNode[] = systemNodes.map((n) => ({
      id: n.id,
      type: n.type,
      position: { x: 0, y: 0 },
      data: {
        label: n.label,
        nodeType: n.type,
        description: n.description,
        sources: n.sources,
      },
    }));

    const flowEdges: MapEdge[] = systemEdges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: 'labeled',
      data: {
        relation_type: e.relation_type,
        description: e.description,
        sources: e.sources,
      },
    }));

    set({ nodes: flowNodes, edges: flowEdges });
  },

  onNodesChange: (changes) =>
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) })),

  onEdgesChange: (changes) =>
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),

  onConnect: (connection) => {
    const newEdge: MapEdge = {
      id: `e-${Date.now()}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      type: 'labeled',
      data: { relation_type: '관련', description: '', sources: [] },
    };
    set((state) => ({ edges: addEdge(newEdge, state.edges) as MapEdge[] }));
  },

  addNode: (node) => {
    const id = node.id ?? Math.random().toString(36).slice(2);
    const { nodes } = get();
    const newNode: MapNode = {
      id,
      type: node.type,
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      data: {
        label: node.label,
        nodeType: node.type,
        description: node.description,
        sources: node.sources,
      },
    };
    set({ nodes: [...nodes, newNode] });
  },

  updateNodeData: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
    })),

  updateEdgeData: (id, data) =>
    set((state) => ({
      edges: state.edges.map((e) =>
        e.id === id
          ? { ...e, data: { ...(e.data as MapEdgeData), ...data } as MapEdgeData }
          : e
      ),
    })),

  selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),
}));
