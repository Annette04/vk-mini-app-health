import {Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';

export const Home = ({ id, fetchedUser }) => {
  const { photo_200, city, first_name, last_name } = { ...fetchedUser };
  const routeNavigator = useRouteNavigator();

  // Получаем данные из localStorage и парсим их в объект
  const infoString = localStorage.getItem("healthProfile");
  const info = infoString ? JSON.parse(infoString) : null;

  return (
      <Panel id={id}>
        <PanelHeader>Дневник здоровья</PanelHeader>
        <Group>
          <Div>
            <div className="title-home">Мой профиль</div>
            <div className="placeholder">
              <Cell before={photo_200 && <Avatar src={photo_200} />} subtitle={city?.title}>
                {`${first_name} ${last_name}`}
              </Cell>

              <div className="title1">Данные пользователя:</div>
              {info && <div className="profile-info"><b>Возраст:</b> {info.age}</div>}
              {info && <div className="profile-info"><b>Рост:</b> {info.height}</div>}
              {info && <div className="profile-info"><b>Вес:</b> {info.weight}</div>}
              <Button
                  className="button-in-home-screen"
                  onClick={() => routeNavigator.push('profile')}
              >
                Изменить информацию
              </Button>
            </div>
            <Button
                stretched size="l"
                onClick={() => routeNavigator.push('add_measurement')}
            >
              Добавить показатели
            </Button>
            <div></div>
            <Button
                stretched size="l"
                className="button-in-home-screen-2"
                onClick={() => routeNavigator.push('medication')}
            >
              Напоминания о лекарствах
            </Button>
            <div></div>
            <Button
                stretched size="l"
                className="button-in-home-screen-2"
                onClick={() => routeNavigator.push('statistics')}
            >
              Статистика
            </Button>
          </Div>
        </Group>
      </Panel>
  );
};

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