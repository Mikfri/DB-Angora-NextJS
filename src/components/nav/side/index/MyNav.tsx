// src/components/nav/side/variants/MyNav.tsx
import MyNavBase from '../base/MyNavBase';
import { MyNavClient } from '../client/MyNavClient';

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