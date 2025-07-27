import {Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar, Card} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { getFromCloud } from '../utils/vkCloudStorage';

export const Home = ({ id, fetchedUser }) => {
  const { photo_200, city, first_name, last_name } = { ...fetchedUser };
  const routeNavigator = useRouteNavigator();
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const profileData = await getFromCloud('healthProfile');
      setInfo(profileData);
    };

    fetchProfile();
  }, []);

  // Функция для расчета ИМТ
  const calculateBMI = () => {
    if (!info || !info.height || !info.weight) return null;

    // Переводим рост из см в метры
    const heightInMeters = info.height / 100;
    // Рассчитываем ИМТ
    const bmi = (info.weight / (heightInMeters * heightInMeters)).toFixed(1);

    return bmi;
  };

  // Функция для определения категории ИМТ
  const getBMICategory = (bmi) => {
    if (!bmi) return '';

    if (bmi < 18.5) return ' - Недостаточный вес';
    if (bmi >= 18.5 && bmi < 25) return ' - Нормальный вес';
    if (bmi >= 25 && bmi < 30) return ' - Избыточный вес';
    return ' - Ожирение';
  };

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);

  // Определяем статус ИМТ для стилизации карточки
  const getBMIStatus = (bmi) => {
    if (!bmi) return 'no-data';

    if (bmi < 18.5) return 'low';
    if (bmi >= 18.5 && bmi < 25) return 'normal';
    if (bmi >= 25 && bmi < 30) return 'warning';
    return 'danger';
  };

  const bmiStatus = getBMIStatus(bmi);

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
              {info && <div className="profile-info"><b>Пол:</b> {info.gender === "male" ? "мужской" : "женский"}</div>}
              {info && <div className="profile-info"><b>Рост:</b> {info.height} см</div>}
              {info && <div className="profile-info"><b>Вес:</b> {info.weight} кг</div>}
              {/*{bmi && (
                  <div className="profile-info">
                    <b>Индекс массы тела:</b> {bmi}{bmiCategory}
                  </div>
              )}*/}
              {/* Карточка ИМТ */}
              {bmi && (
                  <>
                    <Card
                        style={{ marginBottom: 16, padding: 12 }}
                        className={
                          bmiStatus === 'danger' ? 'health-indicator-danger' :
                              bmiStatus === 'warning' ? 'health-indicator-warning' :
                                  bmiStatus === 'low' ? 'health-indicator-danger' :
                                      'health-indicator-normal'
                        }
                    >
                      <b>Индекс массы тела:</b> {bmi}{bmiCategory}
                    </Card>
                  </>
              )}
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
            <Button
                stretched size="l"
                className="button-in-home-screen-2"
                onClick={() => routeNavigator.push('current')}
            >
              Текущие показатели
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