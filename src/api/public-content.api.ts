import { delay } from './client'
import { mockDepartments, mockNews, mockResources } from './mock-data'
import type { Department, NewsArticle, Resource } from '@/types'

export const publicContentApi = {
  async getDepartments(): Promise<Department[]> {
    return delay(mockDepartments, 400)
  },
  async getDepartmentById(id: string): Promise<Department | null> {
    return delay(mockDepartments.find((d) => d.id === id) ?? null, 300)
  },
  async getNews(): Promise<NewsArticle[]> {
    return delay(mockNews, 400)
  },
  async getResources(): Promise<Resource[]> {
    return delay(mockResources, 400)
  },
  async getStats() {
    return delay(
      {
        applicationsReceived: 12450,
        applicationsProcessed: 9820,
        activeCentres: 68,
        typicalProcessingWindow: '3–5 Days',
      },
      400,
    )
  },
  async subscribeToNewsletter(_email: string): Promise<{ subscribed: boolean }> {
    // Mocks POST /api/newsletter/subscribe. A real backend would validate the
    // address, add it to a mailing list, and typically send a confirmation email.
    return delay({ subscribed: true }, 800)
  },
}
