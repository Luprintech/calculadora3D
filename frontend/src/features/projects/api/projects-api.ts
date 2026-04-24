import type { FormData } from '@/lib/schema';
import { httpRequest, jsonRequest } from '@/shared/api/http-client';

export interface Project extends FormData {
  id: string;
  createdAt: string;
}

// Legacy alias — kept for backward compatibility
export type SavedProject = Project;

const GUEST_PROJECTS_KEY = 'filamentos_guest_projects';

function createLocalId(): string {
  return `guest-local-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
}

export function getGuestProjects(): Project[] {
  try {
    const raw = localStorage.getItem(GUEST_PROJECTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveGuestProject(data: Omit<Project, 'id' | 'createdAt'> & { id?: string }): Project {
  const projects = getGuestProjects();
  const id = data.id && data.id.startsWith('guest-local-') ? data.id : createLocalId();
  const project: Project = {
    ...(data as Omit<Project, 'id' | 'createdAt'>),
    id,
    createdAt: new Date().toISOString(),
  };

  const next = [project, ...projects.filter((item) => item.id !== id)].slice(0, 25);
  localStorage.setItem(GUEST_PROJECTS_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event('filamentos:guest-projects-updated'));
  return project;
}

export function deleteGuestProject(id: string): void {
  const next = getGuestProjects().filter((project) => project.id !== id);
  localStorage.setItem(GUEST_PROJECTS_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event('filamentos:guest-projects-updated'));
}

export const projectsApi = {
  async getAll(): Promise<Project[]> {
    return httpRequest<Project[]>({ url: '/api/projects' });
  },

  async getById(id: string): Promise<Project> {
    return httpRequest<Project>({ url: `/api/projects/${id}` });
  },

  async save(data: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    return httpRequest<Project>({
      url: '/api/projects',
      init: jsonRequest('POST', data),
    });
  },

  async update(id: string, data: Omit<Project, 'id' | 'createdAt'>): Promise<{ id: string }> {
    return httpRequest<{ id: string }>({
      url: `/api/projects/${id}`,
      init: jsonRequest('PUT', data),
    });
  },

  async delete(id: string): Promise<void> {
    await httpRequest<{ success: true }>({
      url: `/api/projects/${id}`,
      init: { method: 'DELETE' },
    });
  },
};
