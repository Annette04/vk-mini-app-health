import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Group,
    Div,
    Header,
    Card,
    Text,
    Calendar
} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// Нормативные показатели
const NORM_VALUES = {
    pressure: { min: 90, max: 120, minDiastolic: 60, maxDiastolic: 80 },
    pulse: { min: 60, max: 100 },
    glucose: { min: 3.9, max: 5.5 },
    mood: { min: 4, max: 7 }
};

export const Current = ({ id }) => {
    const routeNavigator = useRouteNavigator();
    const [measurements, setMeasurements] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dailyData, setDailyData] = useState(null);

    useEffect(() => {
        const savedMeasurements = JSON.parse(localStorage.getItem('healthMeasurements') || '[]');
        setMeasurements(savedMeasurements);
    }, []);

    useEffect(() => {
        if (measurements.length > 0) {
            const dateString = selectedDate.toISOString().split('T')[0];
            const dateData = measurements.filter(m => m.date === dateString);

            // Сортируем данные по времени (новые сверху)
            const sortByTime = (a, b) => new Date(b.time) - new Date(a.time);

            const groupedData = {
                pressure: dateData.filter(m => m.type === 'pressure').sort(sortByTime),
                pulse: dateData.filter(m => m.type === 'pulse').sort(sortByTime),
                glucose: dateData.filter(m => m.type === 'glucose').sort(sortByTime),
                mood: dateData.filter(m => m.type === 'mood').sort(sortByTime)
            };

            setDailyData(groupedData);
        }
    }, [selectedDate, measurements]);

    // Получаем даты с измерениями для подсветки в календаре
    const getMarkedDates = () => {
        const dates = [...new Set(measurements.map(m => new Date(m.date)))];
        return dates.reduce((acc, date) => {
            acc[date.toISOString().split('T')[0]] = { disabled: false };
            return acc;
        }, {});
    };

    // Анализируем показатели и возвращаем рекомендации
    const analyzeData = (type, value1, value2 = null) => {
        const norm = NORM_VALUES[type];

        if (!value1) return { status: 'no-data', message: 'Нет данных' };

        switch(type) {
            case 'pressure':
                if (value1 < norm.min || value2 < norm.minDiastolic) {
                    return { status: 'low', message: 'Пониженное давление' };
                } else if (value1 > norm.max || value2 > norm.maxDiastolic) {
                    return { status: 'high', message: 'Повышенное давление' };
                } else {
                    return { status: 'normal', message: 'Давление в норме' };
                }

            case 'pulse':
                if (value1 < norm.min) return { status: 'low', message: 'Низкий пульс' };
                if (value1 > norm.max) return { status: 'high', message: 'Высокий пульс' };
                return { status: 'normal', message: 'Пульс в норме' };

            case 'glucose':
                if (value1 < norm.min) return { status: 'low', message: 'Низкий уровень сахара' };
                if (value1 > norm.max) return { status: 'high', message: 'Высокий уровень сахара' };
                return { status: 'normal', message: 'Сахар в норме' };

            case 'mood':
                if (value1 < norm.min) return { status: 'low', message: 'Плохое настроение' };
                if (value1 > norm.max) return { status: 'high', message: 'Отличное настроение!' };
                return { status: 'normal', message: 'Настроение нормальное' };

            default:
                return { status: 'normal', message: '' };
        }
    };

    return (
        <Panel id={id}>
            <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
                Текущие показатели
            </PanelHeader>

            <Group>
                <Div>
                    <Calendar
                        value={selectedDate}
                        onChange={setSelectedDate}
                        markedDates={getMarkedDates()}
                        disablePast={false}
                        disableFuture={true}
                        enableTime={false}
                    />
                </Div>
            </Group>

            {dailyData && (
                <Group>
                    {/* Давление */}
                    {dailyData.pressure.length > 0 && (
                        <>
                            <Header mode="secondary">Давление</Header>
                            {dailyData.pressure.map((item, index) => {
                                const analysis = analyzeData('pressure', item.value1, item.value2);
                                return (
                                    <Card key={`pressure-${index}`} style={{ marginBottom: 16, padding: 12 }} className={
                                        analysis.status === 'high' ? 'health-indicator-danger' :
                                            analysis.status === 'low' ? 'health-indicator-danger' :
                                                'health-indicator-normal'}>
                                        <Text weight="semibold">{item.value1}/{item.value2} мм рт. ст.</Text>
                                        <Text>
                                            {analysis.message} ({item.time})
                                        </Text>
                                    </Card>
                                );
                            })}
                        </>
                    )}

                    {/* Пульс */}
                    {dailyData.pulse.length > 0 && (
                        <>
                            <Header mode="secondary">Пульс</Header>
                            {dailyData.pulse.map((item, index) => {
                                const analysis = analyzeData('pulse', item.value1);
                                return (
                                    <Card key={`pulse-${index}`} style={{ marginBottom: 16, padding: 12 }} className={
                                        analysis.status === 'high' ? 'health-indicator-danger' :
                                            analysis.status === 'low' ? 'health-indicator-danger' :
                                                'health-indicator-normal'}>
                                        <Text weight="semibold">{item.value1} уд/мин</Text>
                                        <Text>
                                            {analysis.message} ({item.time})
                                        </Text>
                                    </Card>
                                );
                            })}
                        </>
                    )}

                    {/* Сахар */}
                    {dailyData.glucose.length > 0 && (
                        <>
                            <Header mode="secondary">Уровень глюкозы</Header>
                            {dailyData.glucose.map((item, index) => {
                                const analysis = analyzeData('glucose', item.value1);
                                return (
                                    <Card key={`glucose-${index}`} style={{ marginBottom: 16, padding: 12 }} className={
                                        analysis.status === 'high' ? 'health-indicator-danger' :
                                            analysis.status === 'low' ? 'health-indicator-danger' :
                                                'health-indicator-normal'}>
                                        <Text weight="semibold">{item.value1} ммоль/л</Text>
                                        <Text>
                                            {analysis.message} ({item.time})
                                        </Text>
                                    </Card>
                                );
                            })}
                        </>
                    )}

                    {/* Настроение */}
                    {dailyData.mood.length > 0 && (
                        <>
                            <Header mode="secondary">Настроение</Header>
                            {dailyData.mood.map((item, index) => {
                                const analysis = analyzeData('mood', item.value1);
                                return (
                                    <Card key={`mood-${index}`} style={{ marginBottom: 16, padding: 12 }} className={
                                        analysis.status === 'high' ? 'health-indicator-normal' :
                                            analysis.status === 'low' ? 'health-indicator-danger' :
                                                'health-indicator-warning' }>
                                        <Text weight="semibold">{item.value1}/10</Text>
                                        <Text>
                                            {analysis.message} ({item.time})
                                        </Text>
                                    </Card>
                                );
                            })}
                        </>
                    )}

                    {Object.values(dailyData).every(arr => arr.length === 0) && (
                        <Div>Нет данных за выбранный день</Div>
                    )}
                </Group>
            )}
        </Panel>
    );
};

Current.propTypes = {
    id: PropTypes.string.isRequired,
};