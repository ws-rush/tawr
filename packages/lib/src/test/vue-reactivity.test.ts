import { reactive } from '@vue/reactivity'
import { describe, it, expect } from 'vitest'

describe('Vue Reactivity with Nested Objects', () => {
  it('should handle deeply nested object mutations', () => {
    const store = reactive({
      user: {
        profile: {
          address: {
            home: {
              street: '123 Main St',
              city: 'Springfield',
              country: 'USA'
            },
            work: {
              street: '456 Business Ave',
              city: 'Enterprise',
              country: 'USA'
            }
          },
          contacts: {
            email: 'test@example.com',
            phone: {
              home: '123-456-7890',
              mobile: '098-765-4321'
            }
          }
        }
      }
    })

    // Test nested object property updates
    store.user.profile.address.home.street = '789 New St'
    expect(store.user.profile.address.home.street).toBe('789 New St')

    // Test multiple nested updates
    store.user.profile.contacts.phone.mobile = '111-222-3333'
    store.user.profile.address.work.city = 'Metropolis'
    expect(store.user.profile.contacts.phone.mobile).toBe('111-222-3333')
    expect(store.user.profile.address.work.city).toBe('Metropolis')

    // Test object replacement at different levels
    store.user.profile.address.home = {
      street: '321 Park Rd',
      city: 'Newtown',
      country: 'USA'
    }
    expect(store.user.profile.address.home.street).toBe('321 Park Rd')
    expect(store.user.profile.address.home.city).toBe('Newtown')

    // Test nested array in objects
    const storeWithArray = reactive({
      departments: {
        engineering: {
          teams: {
            frontend: {
              members: [
                { id: 1, name: 'Alice', role: 'dev' },
                { id: 2, name: 'Bob', role: 'lead' }
              ]
            }
          }
        }
      }
    })

    // Test array mutations in nested objects
    storeWithArray.departments.engineering.teams.frontend.members.push({
      id: 3,
      name: 'Charlie',
      role: 'dev'
    })
    expect(storeWithArray.departments.engineering.teams.frontend.members).toHaveLength(3)
    expect(storeWithArray.departments.engineering.teams.frontend.members[2].name).toBe('Charlie')

    // Test updating nested array objects
    storeWithArray.departments.engineering.teams.frontend.members[0].role = 'senior'
    expect(storeWithArray.departments.engineering.teams.frontend.members[0].role).toBe('senior')
  })

  it('should handle nested object property deletion', () => {
    interface Colors {
      primary: string;
      secondary: string;
      accent?: string;
    }
    
    const store = reactive({
      settings: {
        theme: {
          colors: {
            primary: '#000000',
            secondary: '#ffffff',
            accent: '#ff0000'
          } as Colors
        }
      }
    })

    // Test deleting nested properties
    delete store.settings.theme.colors.accent
    expect(store.settings.theme.colors.accent).toBeUndefined()
    expect('accent' in store.settings.theme.colors).toBe(false)

    // Verify other properties remain intact
    expect(store.settings.theme.colors.primary).toBe('#000000')
    expect(store.settings.theme.colors.secondary).toBe('#ffffff')
  })

  it('should handle nested object property addition', () => {
    interface Providers {
      [key: string]: boolean | { enabled: boolean; apiVersion: string };
    }
    
    const store = reactive({
      config: {
        features: {
          auth: {
            providers: {
              google: true
            } as Providers
          }
        }
      }
    })

    // Test adding new nested properties
    store.config.features.auth.providers.facebook = true
    store.config.features.auth.providers.twitter = {
      enabled: true,
      apiVersion: 'v2'
    }

    expect(store.config.features.auth.providers.facebook).toBe(true)
    expect(store.config.features.auth.providers.twitter.enabled).toBe(true)
    expect(store.config.features.auth.providers.twitter.apiVersion).toBe('v2')
  })

  it('should handle deeply nested arrays with objects', () => {
    interface Task {
      id: number;
      title: string;
      subtasks?: Task[];
      metadata?: {
        [key: string]: any;
      };
    }

    const store = reactive({
      projects: {
        active: {
          tasks: [
            {
              id: 1,
              title: 'Main Task',
              subtasks: [
                {
                  id: 11,
                  title: 'Sub Task 1',
                  metadata: {
                    priority: 'high',
                    tags: ['important', 'urgent']
                  }
                }
              ]
            }
          ] as Task[]
        }
      }
    })

    // Test nested array mutation
    store.projects.active.tasks[0].subtasks?.push({
      id: 12,
      title: 'Sub Task 2',
      metadata: {
        priority: 'medium',
        tags: ['pending']
      }
    })

    expect(store.projects.active.tasks[0].subtasks).toHaveLength(2)
    expect(store.projects.active.tasks[0].subtasks?.[1].title).toBe('Sub Task 2')

    // Test deeply nested object mutation
    if (store.projects.active.tasks[0].subtasks?.[0].metadata) {
      store.projects.active.tasks[0].subtasks[0].metadata.tags.push('critical')
      store.projects.active.tasks[0].subtasks[0].metadata.dueDate = '2024-02-02'
    }

    expect(store.projects.active.tasks[0].subtasks?.[0].metadata?.tags).toContain('critical')
    expect(store.projects.active.tasks[0].subtasks?.[0].metadata?.dueDate).toBe('2024-02-02')

    // Test nested object replacement
    store.projects.active.tasks[0].subtasks![0].metadata = {
      priority: 'critical',
      tags: ['blocker'],
      assignee: 'John'
    }

    expect(store.projects.active.tasks[0].subtasks?.[0].metadata?.priority).toBe('critical')
    expect(store.projects.active.tasks[0].subtasks?.[0].metadata?.tags).toHaveLength(1)
    expect(store.projects.active.tasks[0].subtasks?.[0].metadata?.assignee).toBe('John')
  })
})
