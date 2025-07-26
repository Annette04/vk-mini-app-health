import { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge-mock';
import { View, SplitLayout, SplitCol, ScreenSpinner } from '@vkontakte/vkui';
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router';

import { Home, Profile, AddMeasurement, Medication, Statistics, Current } from './panels';
import { DEFAULT_VIEW_PANELS } from './routes';

export const App = () => {
  const { panel: activePanel = DEFAULT_VIEW_PANELS.HOME } = useActiveVkuiLocation();
  const [fetchedUser, setUser] = useState();
  const [popout, setPopout] = useState(<ScreenSpinner />);

  useEffect(() => {
    async function fetchData() {
      const user = await bridge.send('VKWebAppGetUserInfo');
      setUser(user);
      setPopout(null);
    }
    fetchData();
  }, []);

  return (
      <SplitLayout popout={popout}>
        <SplitCol>
          <View activePanel={activePanel}>
            <Home id="home" fetchedUser={fetchedUser} />
            <Profile id="profile" />
            <AddMeasurement id="add_measurement" />
            <Medication id="medication" />
            <Statistics id="statistics" />
            <Current id="current" />
          </View>
        </SplitCol>
      </SplitLayout>
  );
};
