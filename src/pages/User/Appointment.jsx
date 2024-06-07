import React, { useEffect, useState } from 'react';
import HeaderBar from '../../components/HeaderBar/HeaderBar'
import styles from './User.module.css'
import useUserContext from '../../hooks/useUserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Collapse, Divider, Button } from 'antd';
import { API_URL } from '../../constants/values';

export default function Appointment() {
    const [appointment, setAppointment] = useState([]);
    const [options, setOptions] = useState([]);

    const { user, saveUser } = useUserContext();

    const navigater = useNavigate();

    const getDoctorNameByID = (id) => {
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === id) {
                return options[i].label;
            }
        }
    }

    useEffect(() => {
        if (user) {
            axios.get(API_URL + 'patient/' + user.id)
                .then(res => {
                    const patient = res.data;

                    axios.get(API_URL + 'patient/appointment/' + patient.id)
                        .then(res => {
                            const appointment = res.data;
                            console.log(appointment);
                            setAppointment(appointment);

                            axios.get(API_URL + 'doctor/list')
                                .then(res => {
                                    const doctors = res.data;
                                    const options = doctors.map(doctor => {
                                        return {
                                            value: doctor.id,
                                            label: doctor.name
                                        }
                                    });

                                    setOptions(options);
                                })
                                .catch(err => console.log(err));
                        })
                        .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
        }

    }, [user]);

    const setStatusColor = (status) => {
        if (status === 'Scheduled') {
            return '#ffc107';
        } else if (status === 'Approved') {
            return '#28a745';
        } else if (status === 'Done') {
            return '#0dcaf0';
        }
    }

    const renderButton = (status, id) => {
        if (status === 'Scheduled') {
            return (
                <div style={{ 'display': 'flex', 'justifyContent': 'space-between' }}>
                    <Button style={{ 'marginRight': '5px' }} disabled>Cancel</Button>
                    <Button style={{ 'marginRight': '5px' }} type="primary" ghost>Reschedule</Button>
                </div>
            )
        } else if (status === 'Done') {
            return (
                <div style={{ 'display': 'flex', 'justifyContent': 'space-between' }}>
                    <Button style={{ 'marginRight': '5px' }} disabled>Cancel</Button>
                    <Button style={{ 'marginRight': '5px' }} type='primary' onClick={() => navigater('/appointment/detail/' + id)}>Detail</Button>
                </div>
            )
        } else {
            return (
                <div style={{ 'display': 'flex', 'justifyContent': 'space-between' }}>
                    <Button style={{ 'marginRight': '5px' }} danger>Cancel</Button>
                    <Button style={{ 'marginRight': '5px', 'border': '1px solid #28a745','color': '#28a745' }} ghost>Meeting</Button>
                </div>
            )
        }
    }

    const renderAppointment = appointment.map((appointment, index) => {
        const item = {
            key: appointment.id,
            label: 'Appointment with doctor',
            children: <div>
                <p>Doctor: {getDoctorNameByID(appointment.doctorId)}</p>
                <p>Date: {appointment.date}</p>
                <p>Time: {appointment.startTime}</p>
                <p>Status: {appointment.status}</p>
                {renderButton(appointment.status, appointment.id)}
            </div>
        };

        return (
            <div key={index} style={{ 'width': '90%' }}>
                <Divider orientation="left">{appointment.date}</Divider>
                <Collapse defaultActiveKey={appointment.id} style={{ 'width': '100%', 'backgroundColor': setStatusColor(appointment.status) }}>
                    <Collapse.Panel header={item.label} key={appointment.id}>
                        {item.children}
                    </Collapse.Panel>
                </Collapse>
            </div>
        )
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <HeaderBar title="Appointment"/>
            </div>
            <div className={styles.appointment}>
                {renderAppointment}
            </div>
        </div>
    );
}