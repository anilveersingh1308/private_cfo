# Reports API Fix - Enum Status Issue Resolution

## Problem Identified
The reports API was returning a 500 error with the message:
```
invalid input value for enum invoice_status: "pending"
```

## Root Cause
The database schema defined `invoiceStatusEnum` with these values:
```typescript
['draft', 'sent', 'paid', 'overdue', 'cancelled']
```

However, the reports API was trying to use enum values that don't exist:
- ❌ `'pending'` (doesn't exist in enum)
- ❌ `'refunded'` (doesn't exist in enum)

## Solution Applied

### 1. Fixed Database Queries in `/app/api/admin/reports/route.ts`

**Before (Broken):**
```typescript
pendingPayments: sql<number>`sum(case when ${invoices.status} = 'pending' then ${invoices.amount} else 0 end)`,
refunds: sql<number>`sum(case when ${invoices.status} = 'refunded' then ${invoices.amount} else 0 end)`,
```

**After (Fixed):**
```typescript
pendingPayments: sql<number>`sum(case when ${invoices.status} = 'sent' or ${invoices.status} = 'overdue' then ${invoices.amount} else 0 end)`,
cancelled: sql<number>`sum(case when ${invoices.status} = 'cancelled' then ${invoices.amount} else 0 end)`,
```

### 2. Updated Response Interface in `/app/admin/reports/page.tsx`

**Before:**
```typescript
financial: {
  totalRevenue: number;
  monthlyGrowth: number;
  pendingPayments: number;
  refunds: number;  // ❌ Changed to cancelled
};
```

**After:**
```typescript
financial: {
  totalRevenue: number;
  monthlyGrowth: number;
  pendingPayments: number;
  cancelled: number;  // ✅ Uses correct enum value
};
```

### 3. Updated UI Display Labels

**Before:**
```tsx
<span className="metric-label">Refunds</span>
<span className="metric-value danger">{formatCurrency(reportData.financial.refunds)}</span>
```

**After:**
```tsx
<span className="metric-label">Cancelled</span>
<span className="metric-value danger">{formatCurrency(reportData.financial.cancelled)}</span>
```

## Business Logic Mapping

| Business Concept | Database Enum Values | SQL Logic |
|------------------|---------------------|-----------|
| **Paid Revenue** | `'paid'` | Direct match |
| **Pending Payments** | `'sent'`, `'overdue'` | Invoices sent but not yet paid |
| **Cancelled** | `'cancelled'` | Cancelled invoices |
| **Draft** | `'draft'` | Not counted in financial stats |

## Verification

### API Response Test:
```bash
GET /api/admin/reports?period=month
Status: 200 OK ✅
```

### Sample Response:
```json
{
  "consultations": {
    "total": 8,
    "completed": 2,
    "upcoming": 3,
    "cancelled": 1,
    "revenue": 1700,
    "averageRating": 4.5
  },
  "financial": {
    "totalRevenue": 5700,
    "monthlyGrowth": 0,
    "pendingPayments": 4000,
    "cancelled": 0
  },
  "users": {
    "total": 16,
    "active": 14,
    "newThisMonth": 16,
    "subscribersCount": 6
  }
}
```

## Result
✅ **Reports API now working correctly**
✅ **All enum values properly mapped**
✅ **Financial metrics displaying real data**
✅ **UI updated with correct labels**

The reports page is now fully functional with real database integration and proper enum handling.
