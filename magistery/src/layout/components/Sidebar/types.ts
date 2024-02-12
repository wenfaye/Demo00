export interface MenuItem {
  uid: string;
  title: string;
  permission: string|undefined;
  url: string|undefined;
  icon: string|undefined;
  classes: string|undefined;
  children: MenuItem[];
  divided: boolean|undefined;
  visible: boolean;
}

export function normalizeMenuItems(items: MenuItem[]): MenuItem[] {
  let isDivided = false;
  const results: MenuItem[] = [];
  for (const idx in items) {
    const item = items[idx];
    if (item.children && item.children.length > 0) {
      item.children = normalizeMenuItems(item.children);
    }
    if (isDivided) {
      item.divided = true;
    }
    if (item.title && item.title == 'divider') {
      isDivided = true;
      continue;
    }
    isDivided = false;
    results.push(item);
  }
  return results;
}
