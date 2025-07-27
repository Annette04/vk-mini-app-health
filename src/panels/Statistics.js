import { Panel, PanelHeader, Group, Div, Tabs, TabsItem, PanelHeaderBack, Header, Button } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getFromCloud } from '../utils/vkCloudStorage';

export const Statistics = ({ id }) => {
    const routeNavigator = useRouteNavigator();
    const [activeTab, setActiveTab] = useState('pressure');
    const [measurements, setMeasurements] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        const fetchMeasurements = async () => {
            const savedMeasurements = await getFromCloud('healthMeasurements') || [];
            setMeasurements(savedMeasurements);
        };

        fetchMeasurements();
    }, []);

    const formatDate = (dateStr) => {
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
    };

    const formatTime = (timeStr) => {
        return timeStr.substring(0, 5); // Берем только часы и минуты
    };

    const formatDateTime = (dateStr, timeStr) => {
        return `${formatDate(dateStr)} ${formatTime(timeStr)}`;
    };

    const changeMonth = (direction) => {
        const newMonth = new Date(currentMonth);
        if (direction === 'prev') {
            newMonth.setMonth(newMonth.getMonth() - 1);
        } else {
            newMonth.setMonth(newMonth.getMonth() + 1);
        }
        setCurrentMonth(newMonth);
    };

    const getMonthName = (date) => {
        const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    };

    const getDailyData = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1;
        const monthStr = month < 10 ? `0${month}` : month;

        return measurements
            .filter(m => {
                if (m.type !== activeTab) return false;

                const [mYear, mMonth] = m.date.split('-');
                return mYear === year.toString() && mMonth === monthStr;
            })
            .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
    };

    const getChartData = () => {
        const dailyMeasurements = getDailyData();

        if (activeTab === 'pressure') {
            return dailyMeasurements.map(m => ({
                id: `${m.date}-${m.time}`,
                dateTime: formatDateTime(m.date, m.time),
                date: formatDate(m.date),
                time: formatTime(m.time),
                displayTime: `${formatTime(m.time)}`, // Для отображения в легенде
                systolic: parseInt(m.value1),
                diastolic: parseInt(m.value2),
                pulse: m.pulse ? parseInt(m.pulse) : null
            }));
        } else {
            return dailyMeasurements.map(m => ({
                id: `${m.date}-${m.time}`,
                dateTime: formatDateTime(m.date, m.time),
                date: formatDate(m.date),
                time: formatTime(m.time),
                displayTime: `${formatTime(m.time)}`, // Для отображения в легенде
                value: parseFloat(m.value1)
            }));
        }
    };

    const getLastFiveMeasurements = () => {
        return measurements
            .filter(m => m.type === activeTab)
            .sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`))
            .slice(0, 5);
    };

    const CustomizedLegend = ({ payload }) => {
        return (
            <div style={{ textAlign: 'center', padding: '10px' }}>
                {payload.map((entry, index) => (
                    <div key={`item-${index}`} style={{ display: 'inline-block', margin: '0 10px' }}>
                        <span style={{
                            display: 'inline-block',
                            width: '12px',
                            height: '12px',
                            backgroundColor: entry.color,
                            marginRight: '5px'
                        }}></span>
                        <span>{`${entry.value} (${getChartData()[index]?.displayTime || ''})`}</span>
                    </div>
                ))}
            </div>
        );
    };

    const renderPressureChart = () => (
        <LineChart
            data={getChartData()}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
                dataKey="dateTime"
                tickFormatter={(value) => {
                    const parts = value.split(' ');
                    return parts[0];
                }}
            />
            <YAxis yAxisId="left" domain={[60, 200]} label={{ value: 'Давление', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" domain={[40, 120]} label={{ value: 'Пульс', angle: 90, position: 'insideRight' }} />
            <Tooltip
                formatter={(value, name, props) => {
                    if (name === 'Систолическое' || name === 'Диастолическое') {
                        return [`${value} мм рт.ст.`, name];
                    }
                    if (name === 'Пульс') {
                        return [`${value} уд/мин`, name];
                    }
                    return [value, name];
                }}
                labelFormatter={(label) => label}
            />
            <Legend content={<CustomizedLegend />} />
            <Line
                yAxisId="left"
                type="monotone"
                dataKey="systolic"
                name="Систолическое"
                stroke="#ff7300"
                dot={{ r: 4 }}
            />
            <Line
                yAxisId="left"
                type="monotone"
                dataKey="diastolic"
                name="Диастолическое"
                stroke="#387908"
                dot={{ r: 4 }}
            />
            {getChartData().some(item => item.pulse !== null) && (
                <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="pulse"
                    name="Пульс"
                    stroke="#ff0000"
                    dot={{ r: 4 }}
                />
            )}
        </LineChart>
    );

    const renderStandardChart = () => (
        <LineChart
            data={getChartData()}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
                dataKey="dateTime"
                tickFormatter={(value) => {
                    const parts = value.split(' ');
                    return parts[0];
                }}
            />
            <YAxis />
            <Tooltip
                labelFormatter={(label) => label}
                formatter={(value) => {
                    if (activeTab === 'pulse') return [`${value} уд/мин`, 'Пульс'];
                    if (activeTab === 'glucose') return [`${value} ммоль/л`, 'Сахар'];
                    return [`${value}/10`, 'Настроение'];
                }}
            />
            <Legend content={<CustomizedLegend />} />
            <Line
                type="monotone"
                dataKey="value"
                name={activeTab === 'pulse' ? 'Пульс' :
                    activeTab === 'glucose' ? 'Сахар' : 'Настроение'}
                stroke="#8884d8"
                dot={{ r: 4 }}
            />
        </LineChart>
    );

    return (
        <Panel id={id}>
            <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
                Статистика
            </PanelHeader>

            <Group>
                <Tabs>
                    <TabsItem
                        selected={activeTab === 'pressure'}
                        onClick={() => setActiveTab('pressure')}
                    >
                        Давление
                    </TabsItem>
                    <TabsItem
                        selected={activeTab === 'pulse'}
                        onClick={() => setActiveTab('pulse')}
                    >
                        Пульс
                    </TabsItem>
                    <TabsItem
                        selected={activeTab === 'glucose'}
                        onClick={() => setActiveTab('glucose')}
                    >
                        Сахар
                    </TabsItem>
                    <TabsItem
                        selected={activeTab === 'mood'}
                        onClick={() => setActiveTab('mood')}
                    >
                        Настроение
                    </TabsItem>
                </Tabs>

                <Div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button onClick={() => changeMonth('prev')}>Предыдущий</Button>
                    <Header mode="secondary">{getMonthName(currentMonth)}</Header>
                    <Button onClick={() => changeMonth('next')}>Следующий</Button>
                </Div>

                <Div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        {activeTab === 'pressure' ? renderPressureChart() : renderStandardChart()}
                    </ResponsiveContainer>
                </Div>
            </Group>

            <Group header={<Header mode="secondary">Последние 5 записей</Header>}>
                {getLastFiveMeasurements().map((m, i) => (
                    <Div key={i}>
                        <div>{formatDateTime(m.date, m.time)}</div>
                        <div>
                            {m.type === 'pressure' ? `Давление: ${m.value1}/${m.value2}${m.pulse ? `, Пульс: ${m.pulse}` : ''}` :
                                m.type === 'pulse' ? `Пульс: ${m.value1} уд/мин` :
                                    m.type === 'glucose' ? `Сахар: ${m.value1} ммоль/л` :
                                        `Настроение: ${m.value1}/10`}
                        </div>
                        {m.notes && <div>Заметки: {m.notes}</div>}
                    </Div>
                ))}
            </Group>
        </Panel>
    );
};

Statistics.propTypes = {
    id: PropTypes.string.isRequired,
};