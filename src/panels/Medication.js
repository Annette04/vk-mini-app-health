import { Panel, PanelHeader, FormItem, Input, Button, Group, Div, Checkbox, PanelHeaderBack, Header } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

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
        const savedMeds = JSON.parse(localStorage.getItem('medications') || []);
        setMedications(savedMeds);
    }, []);

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

    const addMedication = () => {
        const updatedMeds = [...medications, newMed];
        setMedications(updatedMeds);
        localStorage.setItem('medications', JSON.stringify(updatedMeds));
        setNewMed({
            name: '',
            dosage: '',
            times: [],
            days: Array(7).fill(false)
        });
    };

    const removeMedication = (index) => {
        const updatedMeds = medications.filter((_, i) => i !== index);
        setMedications(updatedMeds);
        localStorage.setItem('medications', JSON.stringify(updatedMeds));
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
                        <Input
                            key={index}
                            type="time"
                            value={time}
                            onChange={(e) => handleTimeChange(index, e.target.value)}
                        />
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
                    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
                        <Checkbox
                            key={day}
                            checked={newMed.days[index]}
                            onChange={() => handleDayChange(index)}
                        >
                            {day}
                        </Checkbox>
                    ))}
                </FormItem>

                <Div>
                    <Button size="l" stretched onClick={addMedication}>
                        Добавить напоминание
                    </Button>
                </Div>
            </Group>

            <Group header={<Header mode="secondary">Текущие напоминания</Header>}>
                {medications.map((med, index) => (
                    <Div key={index}>
                        <div>{med.name} - {med.dosage}</div>
                        <div>Время: {med.times.join(', ')}</div>
                        <div>Дни: {med.days.map((day, i) => day ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][i] : null).filter(Boolean).join(', ')}</div>
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
        </Panel>
    );
};

Medication.propTypes = {
    id: PropTypes.string.isRequired,
};