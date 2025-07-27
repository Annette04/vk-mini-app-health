import { Panel, PanelHeader, FormItem, Input, Button, Group, Div, Checkbox, PanelHeaderBack, Header } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { getFromCloud, setToCloud } from '../utils/vkCloudStorage';

export const Medication = ({ id }) => {
    const routeNavigator = useRouteNavigator();
    const [medications, setMedications] = useState([]);
    const [newMed, setNewMed] = useState({
        name: '',
        dosage: '',
        times: [],
        days: Array(7).fill(false)
    });

    useEffect(() => {
        const fetchMedications = async () => {
            const savedMeds = await getFromCloud('medications') || [];
            setMedications(savedMeds);
        };

        fetchMedications();
    }, []);

    const addMedication = async () => {
        if (!newMed.name || !newMed.dosage || newMed.times.length === 0 || !newMed.days.some(day => day)) {
            alert('Заполните все обязательные поля');
            return;
        }

        try {
            const updatedMeds = [...medications, newMed];
            const success = await setToCloud('medications', updatedMeds);

            if (success) {
                setMedications(updatedMeds);
                setNewMed({
                    name: '',
                    dosage: '',
                    times: [],
                    days: Array(7).fill(false)
                });
            } else {
                alert('Ошибка при сохранении');
            }
        } catch (error) {
            console.error('Error adding medication:', error);
            alert('Произошла ошибка');
        }
    };

    const removeMedication = async (index) => {
        try {
            const updatedMeds = medications.filter((_, i) => i !== index);
            const success = await setToCloud('medications', updatedMeds);

            if (success) {
                setMedications(updatedMeds);
            } else {
                alert('Ошибка при удалении');
            }
        } catch (error) {
            console.error('Error removing medication:', error);
            alert('Произошла ошибка');
        }
    };

    const handleTimeChange = (index, value) => {
        const newTimes = [...newMed.times];
        newTimes[index] = value;
        setNewMed({ ...newMed, times: newTimes });
    };

    const handleDayChange = (index) => {
        const newDays = [...newMed.days];
        newDays[index] = !newDays[index];
        setNewMed({ ...newMed, days: newDays });
    };

    return (
        <Panel id={id}>
            <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
                Напоминания о лекарствах
            </PanelHeader>

            <Group>
                <FormItem top="Название лекарства">
                    <Input
                        value={newMed.name}
                        onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                    />
                </FormItem>

                <FormItem top="Дозировка">
                    <Input
                        value={newMed.dosage}
                        onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                    />
                </FormItem>

                <FormItem top="Время приема">
                    {newMed.times.map((time, index) => (
                        <div key={index} style={{ marginBottom: 8 }}>
                            <Input
                                type="time"
                                value={time}
                                onChange={(e) => handleTimeChange(index, e.target.value)}
                            />
                            <Button
                                mode="tertiary"
                                size="s"
                                onClick={() => {
                                    const newTimes = newMed.times.filter((_, i) => i !== index);
                                    setNewMed({ ...newMed, times: newTimes });
                                }}
                                style={{ marginLeft: 8 }}
                            >
                                Удалить
                            </Button>
                        </div>
                    ))}
                    <Button
                        size="m"
                        mode="secondary"
                        onClick={() => setNewMed({ ...newMed, times: [...newMed.times, ''] })}
                    >
                        Добавить время
                    </Button>
                </FormItem>

                <FormItem top="Дни недели">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
                            <Checkbox
                                key={day}
                                checked={newMed.days[index]}
                                onChange={() => handleDayChange(index)}
                            >
                                {day}
                            </Checkbox>
                        ))}
                    </div>
                </FormItem>

                <Div>
                    <Button size="l" stretched onClick={addMedication}>
                        Добавить напоминание
                    </Button>
                </Div>
            </Group>

            {medications.length > 0 && (
                <Group header={<Header mode="secondary">Текущие напоминания</Header>}>
                    {medications.map((med, index) => (
                        <Div key={index} style={{ padding: 12, border: '1px solid var(--button_secondary_background)', borderRadius: 8, marginBottom: 8 }}>
                            <div style={{ fontWeight: 500, marginBottom: 4 }}>{med.name} - {med.dosage}</div>
                            <div style={{ marginBottom: 4 }}>Время: {med.times.join(', ')}</div>
                            <div style={{ marginBottom: 8 }}>Дни: {med.days.map((day, i) => day ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][i] : null).filter(Boolean).join(', ')}</div>
                            <Button
                                mode="destructive"
                                size="s"
                                onClick={() => removeMedication(index)}
                            >
                                Удалить
                            </Button>
                        </Div>
                    ))}
                </Group>
            )}
        </Panel>
    );
};

Medication.propTypes = {
    id: PropTypes.string.isRequired,
};