// src/components/nav/side/UserProfileNav.tsx
import { UserProfileNavClient } from './UserProfileNavClient';

/**
 * UserProfileNav - Navigation for user profile
 * Server wrapper that imports client logic
 */
export default function UserProfileNav() {
  return (
    <nav className="side-nav">
      <UserProfileNavClient />
    </nav>
  );
}