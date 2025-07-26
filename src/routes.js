import {
  createHashRouter,
  createPanel,
  createRoot,
  createView,
  RoutesConfig,
} from '@vkontakte/vk-mini-apps-router';

export const DEFAULT_ROOT = 'default_root';

export const DEFAULT_VIEW = 'default_view';

export const DEFAULT_VIEW_PANELS = {
  HOME: 'home',
  PROFILE: 'profile',
  ADD_MEASUREMENT: 'add_measurement',
  MEDICATION: 'medication',
  STATISTICS: 'statistics',
  CURRENT: 'current'
};

export const routes = RoutesConfig.create([
  createRoot(DEFAULT_ROOT, [
    createView(DEFAULT_VIEW, [
      createPanel(DEFAULT_VIEW_PANELS.HOME, '/', []),
      createPanel(DEFAULT_VIEW_PANELS.PROFILE, `/${DEFAULT_VIEW_PANELS.PROFILE}`, []),
      createPanel(DEFAULT_VIEW_PANELS.ADD_MEASUREMENT, `/${DEFAULT_VIEW_PANELS.ADD_MEASUREMENT}`, []),
      createPanel(DEFAULT_VIEW_PANELS.MEDICATION, `/${DEFAULT_VIEW_PANELS.MEDICATION}`, []),
      createPanel(DEFAULT_VIEW_PANELS.STATISTICS, `/${DEFAULT_VIEW_PANELS.STATISTICS}`, []),
      createPanel(DEFAULT_VIEW_PANELS.CURRENT, `/${DEFAULT_VIEW_PANELS.CURRENT}`, []),
    ]),
  ]),
]);

export const router = createHashRouter(routes.getRoutes());
