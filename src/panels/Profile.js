
import {
    Panel,
    PanelHeader,
    FormItem,
    Input,
    Button,
    Group,
    Div,
    PanelHeaderBack,
    Radio
} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { getFromCloud, setToCloud } from '../utils/vkCloudStorage';

export const Profile = ({ id }) => {
    const routeNavigator = useRouteNavigator();
    const [formData, setFormData] = useState({
        gender: '',
        age: '',
        height: '',
        weight: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const savedData = await getFromCloud('healthProfile');
            if (savedData) {
                setFormData(savedData);
            }
        };

        fetchProfile();
    }, []);

    const handleSubmit = async () => {
        try {
            const success = await setToCloud('healthProfile', formData);

            if (success) {
                routeNavigator.back();
            } else {
                alert('Ошибка при сохранении профиля');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Произошла ошибка при сохранении');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenderChange = (e) => {
        setFormData(prev => ({ ...prev, gender: e.target.value }));
    };

    return (
        <Panel id={id}>
            <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
                Мой профиль
            </PanelHeader>

            <Group>
                <FormItem top="Пол">
                    <Radio
                        name="gender"
                        value="male"
                        checked={formData.gender === 'male'}
                        onChange={handleGenderChange}
                        style={{ marginBottom: 8 }}
                    >
                        Мужской
                    </Radio>
                    <Radio
                        name="gender"
                        value="female"
                        checked={formData.gender === 'female'}
                        onChange={handleGenderChange}
                    >
                        Женский
                    </Radio>
                </FormItem>

                <FormItem top="Возраст">
                    <Input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="Введите возраст"
                    />
                </FormItem>
                <FormItem top="Рост (см)">
                    <Input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        placeholder="Введите рост"
                    />
                </FormItem>
                <FormItem top="Вес (кг)">
                    <Input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="Введите вес"
                    />
                </FormItem>

                <Div>
                    <Button
                        size="l"
                        stretched
                        onClick={handleSubmit}
                        disabled={!formData.gender}
                    >
                        Сохранить
                    </Button>
                </Div>
            </Group>
        </Panel>
    );
};

Profile.propTypes = {
    id: PropTypes.string.isRequired,
};