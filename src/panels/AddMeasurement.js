import { Panel, PanelHeader, FormItem, Input, Button, Group, Div, PanelHeaderBack, Tabs, TabsItem } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { useState } from 'react';

export const AddMeasurement = ({ id }) => {
    const routeNavigator = useRouteNavigator();
    const [measurement, setMeasurement] = useState({
        type: 'pressure',
        value1: '',
        value2: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().substring(0, 5),
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMeasurement(prev => ({ ...prev, [name]: value }));
    };

    const handleTypeChange = (type) => {
        setMeasurement(prev => ({
            ...prev,
            type,
            value1: '',
            value2: ''
        }));
    };

    const resetForm = () => {
        setMeasurement({
            type: measurement.type, // сохраняем текущий тип
            value1: '',
            value2: '',
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().substring(0, 5),
            notes: ''
        });
    };

    const handleSubmit = () => {
        // Проверяем заполнение обязательных полей
        if (
            (measurement.type === 'pressure' && (!measurement.value1 || !measurement.value2)) ||
            (measurement.type !== 'pressure' && !measurement.value1)
        ) {
            alert('Заполните все обязательные поля');
            return;
        }

        // Получаем текущие данные из localStorage
        const measurements = JSON.parse(localStorage.getItem('healthMeasurements') || '[]');

        // Добавляем новые данные
        measurements.push(measurement);

        // Сохраняем обновленные данные
        localStorage.setItem('healthMeasurements', JSON.stringify(measurements));

        // Показываем уведомление
        alert("Данные успешно сохранены");

        // Очищаем форму
        resetForm();
    };

    return (
        <Panel id={id}>
            <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
                Добавить показатели
            </PanelHeader>

            <Group>
                <FormItem top="Тип показателя">
                    <Tabs>
                        <TabsItem
                            selected={measurement.type === 'pressure'}
                            onClick={() => handleTypeChange('pressure')}
                        >
                            Давление
                        </TabsItem>
                        <TabsItem
                            selected={measurement.type === 'pulse'}
                            onClick={() => handleTypeChange('pulse')}
                        >
                            Пульс
                        </TabsItem>
                        <TabsItem
                            selected={measurement.type === 'glucose'}
                            onClick={() => handleTypeChange('glucose')}
                        >
                            Сахар
                        </TabsItem>
                        <TabsItem
                            selected={measurement.type === 'mood'}
                            onClick={() => handleTypeChange('mood')}
                        >
                            Настроение
                        </TabsItem>
                    </Tabs>
                </FormItem>

                {measurement.type === 'pressure' && (
                    <>
                        <FormItem top="Верхнее давление">
                            <Input
                                type="number"
                                name="value1"
                                value={measurement.value1}
                                onChange={handleChange}
                            />
                        </FormItem>
                        <FormItem top="Нижнее давление">
                            <Input
                                type="number"
                                name="value2"
                                value={measurement.value2}
                                onChange={handleChange}
                            />
                        </FormItem>
                    </>
                )}

                {measurement.type === 'pulse' && (
                    <FormItem top="Пульс (уд/мин)">
                        <Input
                            type="number"
                            name="value1"
                            value={measurement.value1}
                            onChange={handleChange}
                        />
                    </FormItem>
                )}

                {measurement.type === 'glucose' && (
                    <FormItem top="Сахар в крови натощак (ммоль/л)">
                        <Input
                            type="number"
                            name="value1"
                            value={measurement.value1}
                            onChange={handleChange}
                            step="0.1"
                        />
                    </FormItem>
                )}

                {measurement.type === 'mood' && (
                    <FormItem top="Настроение (1-10)">
                        <Input
                            type="number"
                            name="value1"
                            value={measurement.value1}
                            onChange={handleChange}
                            min="1"
                            max="10"
                        />
                    </FormItem>
                )}

                <FormItem top="Дата">
                    <Input
                        type="date"
                        name="date"
                        value={measurement.date}
                        onChange={handleChange}
                    />
                </FormItem>

                <FormItem top="Время">
                    <Input
                        type="time"
                        name="time"
                        value={measurement.time}
                        onChange={handleChange}
                    />
                </FormItem>

                <FormItem top="Заметки">
                    <Input
                        type="text"
                        name="notes"
                        value={measurement.notes}
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

AddMeasurement.propTypes = {
    id: PropTypes.string.isRequired,
};