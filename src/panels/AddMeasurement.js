import { Panel, PanelHeader, FormItem, Input, Button, Group, Div, Select, PanelHeaderBack } from '@vkontakte/vkui';
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

    const handleSubmit = () => {
        const measurements = JSON.parse(localStorage.getItem('healthMeasurements') || '[]');
        measurements.push(measurement);
        localStorage.setItem('healthMeasurements', JSON.stringify(measurements));
        routeNavigator.back();
    };

    return (
        <Panel id={id}>
            <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
                Добавить показатели
            </PanelHeader>

            <Group>
                <FormItem top="Тип показателя">
                    <Select
                        name="type"
                        value={measurement.type}
                        onChange={handleChange}
                        options={[
                            { label: 'Давление', value: 'pressure' },
                            { label: 'Пульс', value: 'pulse' },
                            { label: 'Сахар в крови', value: 'glucose' },
                            { label: 'Настроение', value: 'mood' }
                        ]}
                    />
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
                    <FormItem top="Сахар в крови (ммоль/л)">
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