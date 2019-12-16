import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Row } from 'native-base';

export default Calendar = ({ date }) => {

    getMonthName = (month) => {
        let monthNames = [
            "January", "February", "March",
            "April", "May", "June",
            "July", "August", "September",
            "October", "November", "December"
        ];

        return monthNames[month];
    }

    getDayName = (day) => {
        let dayNames = [
            "CN", "T2", "T3", "T4", "T5", "T6", "T7",
        ];

        return dayNames[day];
    }

    renderBar = () => {
        const month = date.getMonth();
        const year = date.getFullYear();
        const monthName = this.getMonthName(month);
        return (
            <View style={styles.bar}>
                <TouchableOpacity style={styles.barTouchable}>
                    <View style={[styles.barButton, styles.barButtonPrev]}>
                        <Text>
                            &larr;
                        </Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.barMonth}>
                    <Text style={styles.barText}>
                        {monthName + " "}
                    </Text>
                </View>

                <View style={styles.barYear}>
                    <Text style={styles.barText}>
                        {year}
                    </Text>
                </View>

                <TouchableOpacity style={styles.barTouchable}>
                    <View style={[styles.barButton, styles.barButtonNext]}>
                        <Text>
                            &rarr;
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    renderDayNames = () => {
        const elements = [];

        for (let i = 0; i < 7; i++) {
            const dayIndex = i % 7;
            elements.push(
                <View key={i} style={styles.dayInner}>
                    <Text style={[styles.shadedText, styles.dayText]}>
                        {this.getDayName(dayIndex)}
                    </Text>
                </View>
            );
        }

        return (
            <View style={styles.week}>
                {elements}
            </View>
        );
    }

    renderRow = (item) => {
        return (
            item.map(val => (
                <TouchableOpacity style={{ padding: 10 }}>
                    <View style={{ width: 20, height: 20 }}>
                        <Text>{val}</Text>
                    </View>
                </TouchableOpacity>
            ))
        );
    }

    getWeekDetail = () => {
        let indexOfWeek = new Date(date.getFullYear(), date.getMonth(), 1).getDay();// index thứ trong tuần
        let daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); //số ngày trong tháng
        let daysInLastMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate();// 31
        const week = [];

        //push số ngày còn của tháng trước = lượng indexOfWeek
        //lấy số ngày của tháng trước
        for (let i = indexOfWeek - 1; i >= 0; i--) {
            week.push(daysInLastMonth - i);
        };

        //số ngày của tháng này => bắt đầu từ 1 -> daysInMonth
        for (let i = 1; i <= daysInMonth; i++) {
            week.push(i);
        }

        //chia thành 5 mảng
        let weekDiv = new Array(5);

        let index = 0;
        for (let i = 0; i < 5; i++) {
            let offset = 0;
            weekDiv[i] = new Array();
            while (offset < 7) {
                weekDiv[i].push(week[index]);
                index++;
                offset++;
            }
        }

        return (
            weekDiv.map(item => (
                <View style={{ flexDirection: 'row', justifyContent: "space-around", alignItems: 'center' }}>
                    {this.renderRow(item)}
                </View>
            )));
    }

    return (
        <View style={[styles.calendar]}>
            {this.renderBar()}
            {this.renderDayNames()}
            {this.getWeekDetail()}
        </View>
    );

}

const styles = StyleSheet.create({
    calendar: {
        borderBottomWidth: 1,
        borderStyle: "solid",
        borderBottomColor: "#BDBDBD",
        backgroundColor: "white",
    },

    week: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },

    dayOuter: {
        flex: 1,
    },

    dayInner: {
        paddingTop: 12,
        paddingRight: 12,
        paddingBottom: 12,
        paddingLeft: 8,
        backgroundColor: "white",
        borderBottomWidth: 3,
        borderStyle: "solid",
        borderColor: "white",
    },

    todayDayInner: {
        borderColor: "#BF360C"
    },

    dayText: {
        textAlign: "right",
    },

    dayWeekendText: {
        color: "#BF360C",
    },

    bar: {
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    barText: {
        color: "#424242",
    },

    barButton: {
        backgroundColor: "white",
        padding: 10,
    },

    schadedText: {
        color: "#AAAAAA",
    }
});
