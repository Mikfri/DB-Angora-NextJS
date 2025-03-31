// src/components/nav/side/variants/MyNav.tsx
import MyNavBase from './MyNavBase';
import { MyNavClient } from './MyNavClient';

/**
 * Combined MyNav component
 * Uses server-side base with client-side content
 */
export default function MyNav() {
  return (
    <MyNavBase>
      <MyNavClient />
    </MyNavBase>
  );
}