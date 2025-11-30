# Breadcrumb System Testing Plan

This document outlines a comprehensive testing strategy for the centralized breadcrumb navigation system.

## Testing Objectives

1. **Functional Testing**: Verify breadcrumbs generate correctly for all route patterns
2. **Dynamic Data Testing**: Ensure dynamic routes fetch and display correct data
3. **Error Handling Testing**: Validate graceful degradation when errors occur
4. **Performance Testing**: Confirm caching and optimization work as expected
5. **Accessibility Testing**: Ensure breadcrumbs are accessible to all users
6. **Cross-browser Testing**: Verify compatibility across different browsers

## Test Environment Setup

### Required Tools
- Jest/React Testing Library for unit tests
- Cypress or Playwright for end-to-end tests
- Browser dev tools for performance monitoring
- Screen readers for accessibility testing

### Test Data
- Sample learning paths with different titles and structures
- Lessons with various chapter/module combinations
- Admin content for testing administrative routes
- User accounts with different permission levels

## Test Categories

### 1. Static Route Testing

#### Test Cases
| Route | Expected Breadcrumb | Test Priority |
|-------|-------------------|---------------|
| `/dashboard` | Dashboard | High |
| `/admin` | Dashboard > Admin | High |
| `/admin/modules` | Dashboard > Admin > Modules | High |
| `/admin/learning-paths` | Dashboard > Admin > Learning Paths | High |
| `/admin/analytics` | Dashboard > Admin > Analytics | Medium |
| `/admin/jobs` | Dashboard > Admin > Jobs | Medium |
| `/admin/users` | Dashboard > Admin > Users | Medium |
| `/profile` | Dashboard > Profile | High |
| `/profile/payment-history` | Dashboard > Profile > Payment History | High |
| `/jobs` | Dashboard > Jobs | Medium |
| `/paths` | Dashboard > Browse Paths | Medium |
| `/pricing` | Dashboard > Pricing | Low |
| `/contact` | Dashboard > Contact | Low |

#### Test Steps
1. Navigate to each static route
2. Verify breadcrumb displays correct hierarchy
3. Click each breadcrumb segment to ensure navigation works
4. Verify the last segment is not clickable (active state)
5. Check home icon appears on first segment

#### Expected Results
- All static routes display correct breadcrumb hierarchy
- Navigation links work correctly
- Active states are properly styled
- Home icon appears consistently

### 2. Dynamic Route Testing

#### Learning Path Routes
| Route Pattern | Dynamic Data Required | Test Cases |
|---------------|---------------------|-------------|
| `/learning-paths/[pathId]` | Path title, emoji | Test with 3 different paths |
| `/admin/learning-paths/[pathId]` | Path title | Test with admin and regular paths |
| `/admin/learning-paths/[pathId]/schedule` | Path title | Test schedule page navigation |

#### Lesson Routes
| Route Pattern | Dynamic Data Required | Test Cases |
|---------------|---------------------|-------------|
| `/lessons/[lessonId]` | Lesson title, chapter title, module title | Test lessons from different modules |

#### Module Routes
| Route Pattern | Dynamic Data Required | Test Cases |
|---------------|---------------------|-------------|
| `/admin/modules/[moduleId]` | Module title | Test with different modules |

#### Test Steps
1. Navigate to dynamic routes with different parameter values
2. Verify API calls are made to fetch dynamic data
3. Confirm fetched data is displayed correctly in breadcrumbs
4. Test navigation between different instances of the same route pattern
5. Verify caching works on subsequent visits

#### Expected Results
- Dynamic data is fetched and displayed correctly
- API endpoints return expected data structure
- Caching prevents redundant requests
- Fallback behavior works when data is missing

### 3. Error Handling Testing

#### Test Scenarios
1. **Network Errors**: Simulate network failures
2. **API Errors**: Return error responses from endpoints
3. **Missing Data**: Test with incomplete data responses
4. **Invalid Routes**: Navigate to non-existent routes
5. **Permission Errors**: Test routes user doesn't have access to

#### Test Steps
1. Use browser dev tools to block network requests
2. Mock API responses with error status codes
3. Navigate to invalid URLs
4. Test with users lacking appropriate permissions
5. Verify graceful degradation in all scenarios

#### Expected Results
- Fallback breadcrumbs display when errors occur
- User-friendly error messages appear
- Navigation remains functional
- No console errors or crashes

### 4. Performance Testing

#### Metrics to Monitor
- API response times for dynamic data
- Cache hit/miss ratios
- Memory usage during navigation
- Bundle size impact

#### Test Steps
1. Monitor network requests during navigation
2. Measure cache effectiveness
3. Test with large datasets
4. Profile memory usage over extended sessions
5. Analyze bundle size impact

#### Expected Results
- API responses under 200ms
- Cache hit rate above 80%
- Minimal memory growth over time
- Bundle size increase under 10KB

### 5. Accessibility Testing

#### Test Criteria
- Screen reader compatibility
- Keyboard navigation support
- ARIA label correctness
- Color contrast compliance

#### Test Steps
1. Navigate using keyboard only
2. Test with screen readers (NVDA, VoiceOver)
3. Verify ARIA labels and roles
4. Check color contrast ratios
5. Test with high contrast mode

#### Expected Results
- All breadcrumb elements are keyboard accessible
- Screen readers announce navigation correctly
- ARIA labels are descriptive
- Color contrast meets WCAG 2.1 AA standards

### 6. Cross-browser Testing

#### Target Browsers
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

#### Test Steps
1. Run functional tests on each browser
2. Verify consistent styling and behavior
3. Test responsive design on mobile devices
4. Check performance variations

#### Expected Results
- Consistent behavior across all browsers
- Responsive design works on mobile devices
- Performance is acceptable on all platforms

## Automated Test Implementation

### Unit Tests

```typescript
// lib/breadcrumb-config.test.ts
import { matchRoute, extractParams } from './breadcrumb-config';

describe('Route Configuration', () => {
  test('matches static routes correctly', () => {
    const config = matchRoute('/dashboard');
    expect(config?.pattern).toBe('/dashboard');
  });

  test('matches dynamic routes correctly', () => {
    const config = matchRoute('/learning-paths/123');
    expect(config?.pattern).toBe('/learning-paths/[pathId]');
  });

  test('extracts parameters correctly', () => {
    const params = extractParams('/learning-paths/123', '/learning-paths/[pathId]');
    expect(params).toEqual({ pathId: '123' });
  });
});
```

### Integration Tests

```typescript
// components/providers/navigation-provider.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { useNavigation } from './navigation-provider';
import { NavigationProvider } from './navigation-provider';

describe('Navigation Provider', () => {
  test('generates breadcrumbs for static routes', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NavigationProvider>{children}</NavigationProvider>
    );

    const { result } = renderHook(() => useNavigation(), { wrapper });

    await waitFor(() => {
      expect(result.current.breadcrumbs).toHaveLength(1);
      expect(result.current.breadcrumbs[0].label).toBe('Dashboard');
    });
  });
});
```

### End-to-End Tests

```typescript
// e2e/breadcrumb.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Breadcrumb Navigation', () => {
  test('displays correct breadcrumbs for learning path', async ({ page }) => {
    await page.goto('/learning-paths/123');
    
    const breadcrumbs = page.locator('[aria-label="Breadcrumb"]');
    await expect(breadcrumbs).toBeVisible();
    
    const breadcrumbItems = breadcrumbs.locator('ol > li');
    await expect(breadcrumbItems).toHaveCount(3);
    
    await expect(breadcrumbItems.nth(0)).toContainText('Dashboard');
    await expect(breadcrumbItems.nth(1)).toContainText('Learning Paths');
    await expect(breadcrumbItems.nth(2)).toContainText('Test Path');
  });

  test('navigates correctly when clicking breadcrumbs', async ({ page }) => {
    await page.goto('/lessons/456');
    
    const dashboardBreadcrumb = page.locator('[aria-label="Breadcrumb"] a').first();
    await dashboardBreadcrumb.click();
    
    await expect(page).toHaveURL('/dashboard');
  });
});
```

## Test Execution Plan

### Phase 1: Unit Testing (Week 1)
- [ ] Implement unit tests for route configuration
- [ ] Test parameter extraction logic
- [ ] Test data fetching utilities
- [ ] Verify cache functionality

### Phase 2: Integration Testing (Week 1-2)
- [ ] Test navigation provider integration
- [ ] Test breadcrumb component rendering
- [ ] Test API endpoint responses
- [ ] Verify error handling

### Phase 3: End-to-End Testing (Week 2)
- [ ] Implement E2E tests for all route patterns
- [ ] Test navigation flows
- [ ] Test dynamic data loading
- [ ] Verify responsive behavior

### Phase 4: Performance Testing (Week 2)
- [ ] Profile API response times
- [ ] Test cache effectiveness
- [ ] Monitor memory usage
- [ ] Analyze bundle size impact

### Phase 5: Accessibility Testing (Week 3)
- [ ] Test keyboard navigation
- [ ] Verify screen reader compatibility
- [ ] Check ARIA implementation
- [ ] Validate color contrast

### Phase 6: Cross-browser Testing (Week 3)
- [ ] Test on all target browsers
- [ ] Verify mobile compatibility
- [ ] Test responsive design
- [ ] Check performance variations

## Success Criteria

The breadcrumb system is considered successful when:

1. **Functional Requirements**
   - All routes display correct breadcrumbs
   - Dynamic data loads and displays properly
   - Navigation works correctly
   - Error handling is graceful

2. **Performance Requirements**
   - API responses under 200ms
   - Cache hit rate above 80%
   - No memory leaks
   - Minimal bundle size impact

3. **Accessibility Requirements**
   - WCAG 2.1 AA compliance
   - Full keyboard navigation
   - Screen reader compatibility
   - Proper ARIA implementation

4. **Compatibility Requirements**
   - Works on all target browsers
   - Responsive on mobile devices
   - Consistent behavior across platforms

## Bug Tracking and Reporting

### Bug Categories
1. **Critical**: System crashes or data corruption
2. **High**: Core functionality broken
3. **Medium**: Feature not working as expected
4. **Low**: UI/UX issues or minor inconsistencies

### Reporting Format
```
Bug ID: BREAD-001
Title: Dynamic breadcrumb not loading for lesson pages
Severity: High
Steps to Reproduce:
1. Navigate to /lessons/123
2. Observe breadcrumb display
Expected Result: "Dashboard > Module Name > Chapter Name > Lesson Title"
Actual Result: "Dashboard > Lessons > 123"
Environment: Chrome 91, Windows 10
```

## Regression Testing

### Triggers for Regression Testing
- Code changes to navigation system
- Updates to Next.js version
- Changes to route structure
- Performance optimizations
- Security updates

### Regression Test Suite
- Quick smoke test of all major routes
- Verify dynamic data loading
- Check performance metrics
- Validate accessibility compliance

## Test Maintenance

### Regular Tasks
- Update test data as content changes
- Add tests for new routes
- Review and update test cases
- Monitor test performance

### Test Data Management
- Keep test data current
- Use realistic data scenarios
- Maintain test account credentials
- Clean up test artifacts

This comprehensive testing plan ensures the centralized breadcrumb system works reliably across all scenarios and provides an excellent user experience.