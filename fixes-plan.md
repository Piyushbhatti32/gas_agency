# Gas Agency System - Fixes Plan

## Issue 1: Agency Dashboard Data Loading Error

**Problem**: The agency dashboard is trying to fetch bookings from `/api/agency/bookings` but this API route doesn't exist.

**Solution**: Create a new API route at `src/app/api/agency/bookings/route.js` that fetches bookings for a specific agency.

**Implementation**:
1. Create the API route file
2. Implement GET method that:
   - Accepts agencyId as query parameter
   - Fetches bookings where agencyId matches
   - Includes user details in the response
   - Returns bookings ordered by creation date

## Issue 2: Profile Pages Not Editable

**Problem**: Profile pages only have read functionality, no edit/update capability.

**Solution**: Add PUT methods to existing profile API routes to handle updates.

**Agency Profile**:
1. Update `src/app/api/agency/profile/route.js` to add PUT method
2. Implement update logic for agency profile fields
3. Add validation for required fields

**User Profile**:
1. Update `src/app/api/user/profile/route.js` to add PUT method
2. Implement update logic for user profile fields
3. Add validation for required fields

## Issue 3: User and Role Name Display

**Problem**: User name and role are not clearly displayed in the UI.

**Solution**: Update the Navigation component to show user name and role.

**Implementation**:
1. Modify `src/components/Navigation.jsx` to display:
   - User's name
   - User's role (USER, AGENCY, ADMIN)
2. Position this information in the top right corner of the navigation bar

## Implementation Order

1. Create agency bookings API route
2. Add PUT method to agency profile API route
3. Add PUT method to user profile API route
4. Update Navigation component
5. Test all fixes