import { Panel, PanelHeader, Group, Div, HorizontalScroll, Tabs, TabsItem, PanelHeaderBack, Header } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Statistics = ({ id }) => {
    const routeNavigator = useRouteNavigator();
    const [activeTab, setActiveTab] = useState('pressure');
    const [measurements, setMeasurements] = useState([]);

    useEffect(() => {
        const savedMeasurements = JSON.parse(localStorage.getItem('healthMeasurements') || '[]');
        setMeasurements(savedMeasurements);
    }, []);

    const getChartData = (type) => {
        const filtered = measurements
            .filter(m => m.type === type)
            .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

        return filtered.map(m => ({
            date: `${m.date} ${m.time}`,
            value: type === 'pressure' ? `${m.value1}/${m.value2}` : m.value1,
            numericValue: type === 'pressure' ? (parseInt(m.value1) + parseInt(m.value2)) / 2 : parseFloat(m.value1)
        }));
    };

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
                <Div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={getChartData(activeTab)}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="numericValue"
                                name={activeTab === 'pressure' ? 'Среднее давление' : 'Значение'}
                                stroke="#8884d8"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Div>
            </Group>

            <Group header={<Header mode="secondary">Последние записи</Header>}>
                {measurements
                    .filter(m => m.type === activeTab)
                    .sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`))
                    .slice(0, 5)
                    .map((m, i) => (
                        <Div key={i}>
                            <div>{m.date} {m.time}</div>
                            <div>
                                {m.type === 'pressure' ? `Давление: ${m.value1}/${m.value2}` :
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