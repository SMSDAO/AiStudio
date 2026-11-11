/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MASTER GODS AI STUDIO — Public Miniapp Database Service
 * Provides database query, filtering, sorting, and caching for curated
 * public miniapps on the Explore page, including live URL resolution
 * and the 'Just Shipped' real-time deployment feed.
 */

import { AppItem, ShippedEvent } from '../types';
import { INITIAL_APPS, INITIAL_SHIPPED_EVENTS } from '../data/mockData';

export type SortOption = 'popularity' | 'date_desc' | 'date_asc' | 'rating';

export interface MiniappQueryParams {
  category?: string;
  searchQuery?: string;
  sortBy?: SortOption;
  featuredOnly?: boolean;
}

export interface MiniappDatabaseResult {
  apps: AppItem[];
  total: number;
  categories: string[];
  lastSyncedAt: string;
}

class MiniappDatabaseService {
  private dbApps: AppItem[] = [];
  private shippedEvents: ShippedEvent[] = [];
  private isInitialized = false;

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    if (this.isInitialized) return;

    try {
      const stored = localStorage.getItem('gods_miniapp_db_apps');
      if (stored) {
        this.dbApps = JSON.parse(stored);
      } else {
        this.dbApps = [...INITIAL_APPS];
        this.persistApps();
      }

      const storedEvents = localStorage.getItem('gods_miniapp_shipped_events');
      if (storedEvents) {
        this.shippedEvents = JSON.parse(storedEvents);
      } else {
        this.shippedEvents = [...INITIAL_SHIPPED_EVENTS];
        this.persistEvents();
      }
    } catch {
      this.dbApps = [...INITIAL_APPS];
      this.shippedEvents = [...INITIAL_SHIPPED_EVENTS];
    }

    this.isInitialized = true;
  }

  private persistApps() {
    try {
      localStorage.setItem('gods_miniapp_db_apps', JSON.stringify(this.dbApps));
    } catch {
      // Ignore quota
    }
  }

  private persistEvents() {
    try {
      localStorage.setItem('gods_miniapp_shipped_events', JSON.stringify(this.shippedEvents));
    } catch {
      // Ignore quota
    }
  }

  /**
   * Fetches curated public miniapps from the database with sort and filter capabilities.
   */
  public async fetchPublicMiniapps(params: MiniappQueryParams = {}): Promise<MiniappDatabaseResult> {
    this.initDatabase();

    // Emulate realistic database I/O latency
    await new Promise((resolve) => setTimeout(resolve, 180));

    const {
      category = 'All',
      searchQuery = '',
      sortBy = 'popularity',
      featuredOnly = false,
    } = params;

    let result = [...this.dbApps];

    // Filter by Category
    if (category && category !== 'All') {
      result = result.filter(
        (app) => app.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by Featured
    if (featuredOnly) {
      result = result.filter((app) => app.featured);
    }

    // Filter by Search Query (Name, Description, Author, Token)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (app) =>
          app.name.toLowerCase().includes(q) ||
          app.description.toLowerCase().includes(q) ||
          app.tagline?.toLowerCase().includes(q) ||
          app.author.name.toLowerCase().includes(q) ||
          app.author.handle.toLowerCase().includes(q) ||
          app.token?.symbol.toLowerCase().includes(q)
      );
    }

    // Sorting by creation date or popularity
    result.sort((a, b) => {
      switch (sortBy) {
        case 'popularity': {
          // Weighted popularity: uniqueUsers * 2 + opens
          const scoreA = (a.metrics.uniqueUsers || 0) * 2 + (a.metrics.opens || 0);
          const scoreB = (b.metrics.uniqueUsers || 0) * 2 + (b.metrics.opens || 0);
          return scoreB - scoreA;
        }
        case 'date_desc': {
          // Newest creation date first
          const timeA = new Date(a.createdAt || 0).getTime();
          const timeB = new Date(b.createdAt || 0).getTime();
          return timeB - timeA;
        }
        case 'date_asc': {
          // Oldest creation date first
          const timeA = new Date(a.createdAt || 0).getTime();
          const timeB = new Date(b.createdAt || 0).getTime();
          return timeA - timeB;
        }
        case 'rating': {
          return (b.metrics.rating || 0) - (a.metrics.rating || 0);
        }
        default:
          return 0;
      }
    });

    const uniqueCategories = [
      'All',
      ...Array.from(new Set(this.dbApps.map((a) => a.category).filter(Boolean))),
    ];

    return {
      apps: result,
      total: result.length,
      categories: uniqueCategories,
      lastSyncedAt: new Date().toISOString(),
    };
  }

  /**
   * Fetches the 'Just Shipped' live deployment feed
   */
  public async fetchJustShippedFeed(): Promise<ShippedEvent[]> {
    this.initDatabase();
    await new Promise((resolve) => setTimeout(resolve, 100));
    return [...this.shippedEvents];
  }

  /**
   * Records a newly shipped/deployed miniapp into the database and adds a 'Just Shipped' event
   */
  public async recordShippedMiniapp(app: AppItem, deployUrl?: string): Promise<void> {
    this.initDatabase();

    const existingIndex = this.dbApps.findIndex((a) => a.id === app.id);
    const updatedApp: AppItem = {
      ...app,
      status: 'live',
      vercelDeployUrl: deployUrl || app.vercelDeployUrl || `https://${app.slug}.vini.run`,
      createdAt: app.createdAt || new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      this.dbApps[existingIndex] = updatedApp;
    } else {
      this.dbApps.unshift(updatedApp);
    }
    this.persistApps();

    // Push Just Shipped Event
    const newEvent: ShippedEvent = {
      id: `evt_${Date.now()}`,
      timestamp: 'Just now',
      type: 'app_launched',
      appName: updatedApp.name,
      appSlug: updatedApp.slug,
      detail: `Deployed to Vercel Edge & Base L2 with automated 60% creator fee hook.`,
      badge: 'JUST SHIPPED',
      badgeColor: 'green',
      txHash: '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    };

    this.shippedEvents.unshift(newEvent);
    if (this.shippedEvents.length > 50) {
      this.shippedEvents = this.shippedEvents.slice(0, 50);
    }
    this.persistEvents();
  }

  /**
   * Toggle featured status for admin/creators
   */
  public toggleFeatured(appId: string): boolean {
    this.initDatabase();
    const app = this.dbApps.find((a) => a.id === appId);
    if (app) {
      app.featured = !app.featured;
      this.persistApps();
      return app.featured;
    }
    return false;
  }
}

export const miniappDatabaseService = new MiniappDatabaseService();
