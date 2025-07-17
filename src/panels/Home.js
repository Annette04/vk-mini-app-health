import { Panel, PanelHeader, Header, Button, Group, Cell, Div} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { Icon28UserOutline} from '@vkontakte/icons';

export const Home = ({ id }) => {
  const routeNavigator = useRouteNavigator();

  return (
      <Panel id={id}>
        <PanelHeader>Здоровье</PanelHeader>

        <Group header={<Header mode="secondary">Основные функции</Header>}>
          <Div>
            <Cell
                before={<Icon28UserOutline />}
                onClick={() => routeNavigator.push('profile')}
            >
              Мой профиль
            </Cell>
            <Button
                /*before={<Icon28HeartOutline />}*/
                onClick={() => routeNavigator.push('add_measurement')}
            >
              Добавить показатели
            </Button>
            <Button
                /*before={<Icon28PillOutline />}*/
                onClick={() => routeNavigator.push('medication')}
            >
              Напоминания о лекарствах
            </Button>
            <Button
                /*before={<Icon28ChartOutline />}*/
                onClick={() => routeNavigator.push('statistics')}
            >
              Статистика
            </Button>
          </Div>
        </Group>
      </Panel>
  );
};

/*Home.propTypes = {
  id: PropTypes.string.isRequired,
};*/

Home.propTypes = {
  id: PropTypes.string.isRequired,
  fetchedUser: PropTypes.shape({
    photo_200: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    city: PropTypes.shape({
      title: PropTypes.string,
    }),
  }),
};
