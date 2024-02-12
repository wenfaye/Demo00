import defaultSettings from '@/settings'

const title = defaultSettings.title || '调控人机交互云终端'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
