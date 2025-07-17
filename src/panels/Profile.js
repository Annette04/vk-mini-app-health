import { Panel, PanelHeader, FormItem, Input, Button, Group, Div, PanelHeaderBack } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

export const Profile = ({ id }) => {
    const routeNavigator = useRouteNavigator();
    const [formData, setFormData] = useState({
        age: '',
        height: '',
        weight: ''
    });

    useEffect(() => {
        // Загрузка сохраненных данных из localStorage
        const savedData = JSON.parse(localStorage.getItem('healthProfile'));
        if (savedData) {
            setFormData(savedData);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        localStorage.setItem('healthProfile', JSON.stringify(formData));
        routeNavigator.back();
    };

    return (
        <Panel id={id}>
            <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
                Мой профиль
            </PanelHeader>

            <Group>
                <FormItem top="Возраст">
                    <Input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                    />
                </FormItem>
                <FormItem top="Рост (см)">
                    <Input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                    />
                </FormItem>
                <FormItem top="Вес (кг)">
                    <Input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                    />
                </FormItem>

                <Div>
                    <Button size="l" stretched onClick={handleSubmit}>
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